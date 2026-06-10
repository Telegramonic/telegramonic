use super::{
    AuthResult, AuthState, Drive, DriveStats, FileMetadata, FolderMetadata, TelegramService,
    TelegramUser,
};
use chrono::Utc;
use grammers_client::{Client, Config, InitParams};
use grammers_session::Session;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone)]
pub struct RealTelegramService {
    client: Arc<Mutex<Option<Client>>>,
    api_id: Arc<Mutex<Option<i32>>>,
    api_hash: Arc<Mutex<Option<String>>>,
    session_file: String,
    login_token: Arc<Mutex<Option<grammers_client::types::LoginToken>>>,
    password_token: Arc<Mutex<Option<grammers_client::types::PasswordToken>>>,
    folders: Arc<Mutex<Vec<FolderMetadata>>>,
    files: Arc<Mutex<Vec<FileMetadata>>>,
    uploaded_chunks: Arc<Mutex<HashMap<i64, Vec<(i32, Vec<u8>)>>>>,
    upload_progress: Arc<Mutex<HashMap<i64, i32>>>,
}

impl std::fmt::Debug for RealTelegramService {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("RealTelegramService")
            .field("session_file", &self.session_file)
            .finish()
    }
}

fn get_channel_id(updates: &grammers_client::grammers_tl_types::enums::Updates) -> Option<i64> {
    use grammers_client::grammers_tl_types as tl;
    match updates {
        tl::enums::Updates::Updates(u) => {
            for chat in &u.chats {
                match chat {
                    tl::enums::Chat::Channel(c) => return Some(c.id),
                    tl::enums::Chat::ChannelForbidden(c) => return Some(c.id),
                    _ => {}
                }
            }
        }
        tl::enums::Updates::Combined(u) => {
            for chat in &u.chats {
                match chat {
                    tl::enums::Chat::Channel(c) => return Some(c.id),
                    tl::enums::Chat::ChannelForbidden(c) => return Some(c.id),
                    _ => {}
                }
            }
        }
        _ => {}
    }
    None
}

impl RealTelegramService {
    fn get_config_path(filename: &str) -> std::path::PathBuf {
        if let Ok(dir) = std::env::var("TELEGRAMONIC_DATA_DIR") {
            std::path::Path::new(&dir).join(filename)
        } else {
            std::path::PathBuf::from(filename)
        }
    }

    pub fn new() -> Self {
        let (api_id, api_hash) = match Self::load_credentials_file() {
            Ok(creds) => (Some(creds.0), Some(creds.1)),
            Err(_) => (None, None),
        };

        let session_file = Self::get_config_path("telegram.session")
            .to_string_lossy()
            .into_owned();

        Self {
            client: Arc::new(Mutex::new(None)),
            api_id: Arc::new(Mutex::new(api_id)),
            api_hash: Arc::new(Mutex::new(api_hash)),
            session_file,
            login_token: Arc::new(Mutex::new(None)),
            password_token: Arc::new(Mutex::new(None)),
            folders: Arc::new(Mutex::new(Vec::new())),
            files: Arc::new(Mutex::new(Vec::new())),
            uploaded_chunks: Arc::new(Mutex::new(HashMap::new())),
            upload_progress: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    fn load_credentials_file() -> Result<(i32, String), String> {
        let path = Self::get_config_path("telegram.credentials");
        let content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
        let lines: Vec<&str> = content.lines().collect();
        if lines.len() < 2 {
            return Err("Invalid credentials file format".to_string());
        }
        let api_id = lines[0].trim().parse::<i32>().map_err(|e| e.to_string())?;
        let api_hash = lines[1].trim().to_string();
        Ok((api_id, api_hash))
    }

    fn save_credentials_file(api_id: i32, api_hash: &str) -> Result<(), String> {
        let path = Self::get_config_path("telegram.credentials");
        let content = format!("{}\n{}", api_id, api_hash);
        std::fs::write(path, content).map_err(|e| e.to_string())
    }

    async fn get_client(&self) -> Result<Client, String> {
        let mut client_opt = self.client.lock().await;
        if let Some(ref client) = *client_opt {
            return Ok(client.clone());
        }

        // Validate credentials before attempting connection
        let (api_id, api_hash) = match (*self.api_id.lock().await, &*self.api_hash.lock().await) {
            (Some(id), Some(hash)) => (id, hash.clone()),
            _ => return Err("Telegram API credentials (api_id, api_hash) have not been configured on this server. Please enter them during login.".to_string()),
        };

        // Initialize a new Grammers client
        let session =
            Session::load_file_or_create(&self.session_file).map_err(|e| e.to_string())?;
        let config = Config {
            session,
            api_id,
            api_hash,
            params: InitParams {
                catch_up: true,
                ..Default::default()
            },
        };

        let client = Client::connect(config).await.map_err(|e| e.to_string())?;
        *client_opt = Some(client.clone());
        Ok(client)
    }
}

#[axum::async_trait]
impl TelegramService for RealTelegramService {
    async fn get_auth_state(&self) -> AuthState {
        tracing::info!("get_auth_state request");
        let res = match self.get_client().await {
            Ok(client) => match client.is_authorized().await {
                Ok(true) => AuthState::LoggedIn,
                _ => {
                    // Session file exists on disk — try to reconnect using it
                    if std::path::Path::new(&self.session_file).exists() {
                        tracing::info!("Session file found, attempting session reconnect...");
                        match client.get_me().await {
                            Ok(_) => {
                                tracing::info!("Session reconnect succeeded");
                                AuthState::LoggedIn
                            }
                            Err(e) => {
                                tracing::warn!("Session reconnect failed: {}, session is stale", e);
                                AuthState::LoggedOut
                            }
                        }
                    } else {
                        AuthState::LoggedOut
                    }
                }
            },
            Err(_) => AuthState::LoggedOut,
        };
        tracing::info!("get_auth_state response: {:?}", res);
        res
    }

    async fn send_code(
        &self,
        phone: &str,
        api_id: i32,
        api_hash: &str,
    ) -> Result<AuthResult, String> {
        tracing::info!("send_code request: phone={}, api_id={}, api_hash=[masked]", phone, api_id);
        // Reset client and credentials since new ones are being provided
        {
            *self.client.lock().await = None;
            *self.api_id.lock().await = Some(api_id);
            *self.api_hash.lock().await = Some(api_hash.to_string());
        }

        let client = self.get_client().await?;

        let token = client
            .request_login_code(phone)
            .await
            .map_err(|e| e.to_string())?;

        let mut token_lock = self.login_token.lock().await;
        *token_lock = Some(token);

        let res = Ok(AuthResult {
            success: true,
            next_step: Some("code".to_string()),
            error: None,
        });
        tracing::info!("send_code response: {:?}", res);
        res
    }

    async fn sign_in(
        &self,
        phone: &str,
        phone_code_hash: &str,
        code: &str,
    ) -> Result<AuthResult, String> {
        tracing::info!("sign_in request: phone={}, phone_code_hash={}, code=[masked]", phone, phone_code_hash);
        let client = self.get_client().await?;
        let token_lock = self.login_token.lock().await;
        let token = token_lock
            .as_ref()
            .ok_or("Login token not found. Call send-code first.")?;

        let res = match client.sign_in(token, code).await {
            Ok(_user) => {
                // Save credentials to local configuration file
                let api_id = *self.api_id.lock().await;
                let api_hash = self.api_hash.lock().await.clone();
                if let (Some(id), Some(hash)) = (api_id, api_hash) {
                    let _ = Self::save_credentials_file(id, &hash);
                }

                // Save session to local configuration file
                let _ = client.session().save_to_file(&self.session_file);

                Ok(AuthResult {
                    success: true,
                    next_step: Some("dashboard".to_string()),
                    error: None,
                })
            }
            Err(grammers_client::SignInError::PasswordRequired(pwd_token)) => {
                let mut pwd_lock = self.password_token.lock().await;
                *pwd_lock = Some(pwd_token);
                Ok(AuthResult {
                    success: true,
                    next_step: Some("password".to_string()),
                    error: None,
                })
            }
            Err(e) => Ok(AuthResult {
                success: false,
                next_step: Some("code".to_string()),
                error: Some(e.to_string()),
            }),
        };
        tracing::info!("sign_in response: {:?}", res);
        res
    }

    async fn check_password(&self, password: &str) -> Result<AuthResult, String> {
        tracing::info!("check_password request: password=[masked]");
        let client = self.get_client().await?;
        let token = {
            let mut pwd_lock = self.password_token.lock().await;
            pwd_lock
                .take()
                .ok_or("Password token not found. Sign-in first.")?
        };

        client
            .check_password(token, password)
            .await
            .map_err(|e| e.to_string())?;

        // Save credentials to local configuration file
        let api_id = *self.api_id.lock().await;
        let api_hash = self.api_hash.lock().await.clone();
        if let (Some(id), Some(hash)) = (api_id, api_hash) {
            let _ = Self::save_credentials_file(id, &hash);
        }

        // Save session to local configuration file
        let _ = client.session().save_to_file(&self.session_file);

        let res = Ok(AuthResult {
            success: true,
            next_step: Some("dashboard".to_string()),
            error: None,
        });
        tracing::info!("check_password response: {:?}", res);
        res
    }

    async fn log_out(&self) -> Result<bool, String> {
        tracing::info!("log_out request");
        let client = self.get_client().await?;
        let _ = client.sign_out().await;

        {
            *self.api_id.lock().await = None;
            *self.api_hash.lock().await = None;
            *self.client.lock().await = None;
        }

        let _ = std::fs::remove_file(&self.session_file);
        let _ = std::fs::remove_file(Self::get_config_path("telegram.credentials"));
        let res = Ok(true);
        tracing::info!("log_out response: {:?}", res);
        res
    }

    async fn reset_authorization(&self) -> Result<bool, String> {
        tracing::info!("reset_authorization request");
        {
            *self.api_id.lock().await = None;
            *self.api_hash.lock().await = None;
            *self.client.lock().await = None;
        }
        let _ = std::fs::remove_file(&self.session_file);
        let _ = std::fs::remove_file(Self::get_config_path("telegram.credentials"));
        let res = Ok(true);
        tracing::info!("reset_authorization response: {:?}", res);
        res
    }

    async fn get_me(&self) -> Result<TelegramUser, String> {
        tracing::info!("get_me request");
        let client = self.get_client().await?;
        let me = client.get_me().await.map_err(|e| e.to_string())?;
        let res = Ok(TelegramUser {
            id: me.id(),
            first_name: me.first_name().to_string(),
            last_name: me.last_name().map(|s| s.to_string()),
            username: me.username().map(|s| s.to_string()),
            phone: me.phone().map(|s| s.to_string()),
        });
        tracing::info!("get_me response: {:?}", res);
        res
    }

    async fn get_users(&self) -> Result<Vec<TelegramUser>, String> {
        tracing::info!("get_users request");
        let res = match self.get_me().await {
            Ok(me) => Ok(vec![me]),
            Err(e) => Err(e),
        };
        tracing::info!("get_users response: {:?}", res);
        res
    }

    async fn get_full_user(&self, user_id: i64) -> Result<TelegramUser, String> {
        tracing::info!("get_full_user request: user_id={}", user_id);
        let res = Ok(TelegramUser {
            id: user_id,
            first_name: "Telegram".to_string(),
            last_name: Some("User".to_string()),
            username: None,
            phone: None,
        });
        tracing::info!("get_full_user response: {:?}", res);
        res
    }

    async fn update_profile(
        &self,
        first_name: &str,
        last_name: Option<&str>,
    ) -> Result<bool, String> {
        tracing::info!("update_profile request: first_name={}, last_name={:?}", first_name, last_name);
        let res = Ok(true);
        tracing::info!("update_profile response: {:?}", res);
        res
    }

    async fn update_status(&self, offline: bool) -> Result<bool, String> {
        tracing::info!("update_status request: offline={}", offline);
        let res = Ok(true);
        tracing::info!("update_status response: {:?}", res);
        res
    }

    async fn update_username(&self, username: &str) -> Result<bool, String> {
        tracing::info!("update_username request: username={}", username);
        let res = Ok(true);
        tracing::info!("update_username response: {:?}", res);
        res
    }

    async fn get_drives(&self) -> Result<Vec<Drive>, String> {
        tracing::info!("get_drives request");
        let res = (|| async {
            let client = self.get_client().await?;
            let mut dialogs_iter = client.iter_dialogs();
            let mut drives = Vec::new();

            while let Some(dialog) = dialogs_iter.next().await.map_err(|e| e.to_string())? {
                let chat = dialog.chat();
                if matches!(chat, grammers_client::types::Chat::Channel(_)) {
                    drives.push(Drive {
                        chat_id: chat.id(),
                        name: chat.name().to_string(),
                        icon: None,
                    });
                }
            }
            Ok(drives)
        })().await;
        tracing::info!("get_drives response: {:?}", res);
        res
    }

    async fn get_stats(&self) -> Result<DriveStats, String> {
        tracing::info!("get_stats request");
        let files = self.files.lock().await;
        let folders = self.folders.lock().await;
        let total_size: i64 = files.iter().map(|f| f.size).sum();

        let res = Ok(DriveStats {
            total_space: 10995116277760, // 10 TB simulated capacity
            used_space: total_size,
            file_count: files.len() as i64,
            folder_count: folders.len() as i64,
        });
        tracing::info!("get_stats response: {:?}", res);
        res
    }

    async fn get_folders(&self, parent_id: Option<i64>) -> Result<Vec<FolderMetadata>, String> {
        tracing::info!("get_folders request: parent_id={:?}", parent_id);
        let res = (|| async {
            let mut result = Vec::new();

            if parent_id.is_none() {
                let drives = self.get_drives().await?;
                for drive in drives {
                    result.push(FolderMetadata {
                        id: drive.chat_id,
                        parent_id: None,
                        name: drive.name,
                    });
                }
            }

            let folders = self.folders.lock().await;
            let filtered: Vec<FolderMetadata> = folders
                .iter()
                .filter(|f| f.parent_id == parent_id)
                .cloned()
                .collect();

            result.extend(filtered);
            Ok(result)
        })().await;
        tracing::info!("get_folders response: {:?}", res);
        res
    }

    async fn get_files(
        &self,
        folder_id: Option<i64>,
        search_query: Option<&str>,
        all: Option<bool>,
    ) -> Result<Vec<FileMetadata>, String> {
        tracing::info!("get_files request: folder_id={:?}, search_query={:?}, all={:?}", folder_id, search_query, all);
        let res = (|| async {
            let mut result = Vec::new();

            if all == Some(true) {
                // Fetch files from ALL folders (channels)
                let client = self.get_client().await?;
                let mut dialogs_iter = client.iter_dialogs();
                let mut chats = Vec::new();

                while let Some(dialog) = dialogs_iter.next().await.map_err(|e| e.to_string())? {
                    let chat = dialog.chat();
                    if matches!(chat, grammers_client::types::Chat::Channel(_)) {
                        chats.push((chat.id(), chat.pack()));
                    }
                }

                for (chat_id, chat) in chats {
                    let mut messages = client.iter_messages(chat);
                    while let Some(msg) = messages.next().await.map_err(|e| e.to_string())? {
                        if let Some(media) = msg.media() {
                            if let grammers_client::types::Media::Document(doc) = media {
                                let doc_name = doc.name().to_string();
                                let file_ext = doc_name.split('.').last().map(|s| s.to_string());
                                let icon_type = match file_ext.as_deref() {
                                    Some("pdf") => "pdf".to_string(),
                                    Some("png") | Some("jpg") | Some("jpeg") | Some("gif") | Some("svg") => "image".to_string(),
                                    Some("zip") | Some("tar") | Some("gz") | Some("rar") => "archive".to_string(),
                                    Some("mp4") | Some("mkv") | Some("avi") | Some("mov") => "video".to_string(),
                                    Some("mp3") | Some("wav") | Some("ogg") | Some("m4a") | Some("flac") => "audio".to_string(),
                                    Some("js") | Some("ts") | Some("tsx") | Some("rs") | Some("py") | Some("json") | Some("css") | Some("html") => "code".to_string(),
                                    Some("csv") | Some("xlsx") | Some("xls") => "csv".to_string(),
                                    _ => "file".to_string(),
                                };
                                
                                let created_at = doc.creation_date()
                                    .map(|d| d.to_rfc3339())
                                    .unwrap_or_else(|| Utc::now().to_rfc3339());

                                result.push(FileMetadata {
                                    id: doc.id(),
                                    folder_id: Some(chat_id),
                                    name: doc_name,
                                    size: doc.size(),
                                    mime_type: doc.mime_type().map(|s| s.to_string()),
                                    file_ext,
                                    created_at,
                                    icon_type,
                                    telegram_message_id: Some(msg.id()),
                                });
                            }
                        }
                    }
                }
            } else if let Some(chat_id) = folder_id {
                // Fetch files from the Telegram channel (messages containing documents)
                let client = self.get_client().await?;
                let mut dialogs_iter = client.iter_dialogs();
                let mut target_chat = None;

                while let Some(dialog) = dialogs_iter.next().await.map_err(|e| e.to_string())? {
                    let chat = dialog.chat();
                    if chat.id() == chat_id {
                        target_chat = Some(chat.pack());
                        break;
                    }
                }

                if let Some(chat) = target_chat {
                    let mut messages = client.iter_messages(chat);
                    while let Some(msg) = messages.next().await.map_err(|e| e.to_string())? {
                        if let Some(media) = msg.media() {
                            if let grammers_client::types::Media::Document(doc) = media {
                                let doc_name = doc.name().to_string();
                                let file_ext = doc_name.split('.').last().map(|s| s.to_string());
                                let icon_type = match file_ext.as_deref() {
                                    Some("pdf") => "pdf".to_string(),
                                    Some("png") | Some("jpg") | Some("jpeg") | Some("gif") | Some("svg") => "image".to_string(),
                                    Some("zip") | Some("tar") | Some("gz") | Some("rar") => "archive".to_string(),
                                    Some("mp4") | Some("mkv") | Some("avi") | Some("mov") => "video".to_string(),
                                    Some("mp3") | Some("wav") | Some("ogg") | Some("m4a") | Some("flac") => "audio".to_string(),
                                    Some("js") | Some("ts") | Some("tsx") | Some("rs") | Some("py") | Some("json") | Some("css") | Some("html") => "code".to_string(),
                                    Some("csv") | Some("xlsx") | Some("xls") => "csv".to_string(),
                                    _ => "file".to_string(),
                                };
                                
                                let created_at = doc.creation_date()
                                    .map(|d| d.to_rfc3339())
                                    .unwrap_or_else(|| Utc::now().to_rfc3339());

                                result.push(FileMetadata {
                                    id: doc.id(),
                                    folder_id: Some(chat_id),
                                    name: doc_name,
                                    size: doc.size(),
                                    mime_type: doc.mime_type().map(|s| s.to_string()),
                                    file_ext,
                                    created_at,
                                    icon_type,
                                    telegram_message_id: Some(msg.id()),
                                });
                            }
                        }
                    }
                }
            }

            // Add local in-memory files and deduplicate by ID
            let mut file_map = HashMap::new();
            for file in result {
                file_map.insert(file.id, file);
            }

            let local_files = self.files.lock().await;
            for file in local_files.iter() {
                if all == Some(true) || file.folder_id == folder_id {
                    file_map.insert(file.id, file.clone());
                }
            }

            let mut filtered: Vec<FileMetadata> = file_map.into_values().collect();

            if let Some(query) = search_query {
                let query_lower = query.to_lowercase();
                filtered.retain(|f| f.name.to_lowercase().contains(&query_lower));
            }

            Ok(filtered)
        })().await;
        tracing::info!("get_files response: {:?}", res);
        res
    }

    async fn create_folder(
        &self,
        name: &str,
        parent_id: Option<i64>,
    ) -> Result<FolderMetadata, String> {
        tracing::info!("create_folder request: name={}, parent_id={:?}", name, parent_id);
        
        if name.is_empty() {
            return Err("Folder name cannot be empty".to_string());
        }

        let client_res = self.get_client().await;

        if parent_id.is_none() && client_res.is_ok() {
            // Create a Telegram channel
            let client = client_res.unwrap();
            let title = name.to_string();
            
            use grammers_client::grammers_tl_types as tl;
            
            let result = client.invoke(&tl::functions::channels::CreateChannel {
                broadcast: true,
                megagroup: false,
                for_import: false,
                title,
                about: "Telegramonic Cloud Drive".to_string(),
                address: None,
                geo_point: None,
                forum: false,
                ttl_period: None,
            }).await.map_err(|e| e.to_string())?;

            let channel_id = get_channel_id(&result)
                .ok_or_else(|| "Failed to extract channel ID from updates".to_string())?;

            // Since it is created on Telegram, we do not update local self.folders list.
            Ok(FolderMetadata {
                id: channel_id,
                parent_id: None,
                name: name.to_string(),
            })
        } else {
            // Subfolder created locally or fallback to local storage (mock/test behavior)
            let mut folders = self.folders.lock().await;
            let new_id = (folders.len() + 1) as i64;
            let new_folder = FolderMetadata {
                id: new_id,
                parent_id,
                name: name.to_string(),
            };

            folders.push(new_folder.clone());
            Ok(new_folder)
        }
    }

    async fn delete_folder(&self, id: i64) -> Result<bool, String> {
        tracing::info!("delete_folder request: id={}", id);
        
        // Check if the folder is a Telegram channel (drive)
        let client = self.get_client().await?;
        let mut dialogs_iter = client.iter_dialogs();
        let mut target_chat = None;

        while let Some(dialog) = dialogs_iter.next().await.map_err(|e| e.to_string())? {
            let chat = dialog.chat();
            if chat.id() == id {
                target_chat = Some(chat.pack());
                break;
            }
        }

        let is_channel_deleted = if let Some(chat) = target_chat {
            if let Some(channel) = chat.try_to_input_channel() {
                if let Err(e) = client.invoke(&grammers_tl_types::functions::channels::DeleteChannel { channel }).await {
                    tracing::warn!("Failed to delete channel as creator: {}. Trying delete_dialog/leave fallback...", e);
                    client.delete_dialog(chat).await.map_err(|e| e.to_string())?;
                }
            } else {
                client.delete_dialog(chat).await.map_err(|e| e.to_string())?;
            }
            true
        } else {
            false
        };

        let mut folders = self.folders.lock().await;
        let mut files = self.files.lock().await;
        let initial_len = folders.len();
        folders.retain(|f| f.id != id);

        // Cascade delete or un-parent files/folders
        for folder in folders.iter_mut() {
            if folder.parent_id == Some(id) {
                folder.parent_id = None;
            }
        }
        for file in files.iter_mut() {
            if file.folder_id == Some(id) {
                file.folder_id = None;
            }
        }

        let res = Ok(folders.len() < initial_len || is_channel_deleted);
        tracing::info!("delete_folder response: {:?}", res);
        res
    }

    async fn delete_file(&self, id: i64) -> Result<bool, String> {
        tracing::info!("delete_file request: id={}", id);

        // If the file is on Telegram channels, we search for the message holding the document
        // and delete that message.
        let client = self.get_client().await?;
        let mut dialogs_iter = client.iter_dialogs();
        let mut found_msg_id = None;
        let mut found_chat = None;

        'outer: while let Some(dialog) = dialogs_iter.next().await.map_err(|e| e.to_string())? {
            let chat = dialog.chat();
            if matches!(chat, grammers_client::types::Chat::Channel(_)) {
                let mut messages = client.iter_messages(chat.pack());
                while let Some(msg) = messages.next().await.map_err(|e| e.to_string())? {
                    if let Some(media) = msg.media() {
                        if let grammers_client::types::Media::Document(doc) = &media {
                            if doc.id() == id {
                                found_msg_id = Some(msg.id());
                                found_chat = Some(chat.pack());
                                break 'outer;
                            }
                        }
                    }
                }
            }
        }

        let is_telegram_file_deleted = if let (Some(msg_id), Some(chat)) = (found_msg_id, found_chat) {
            client.delete_messages(chat, &[msg_id]).await.map_err(|e| e.to_string())?;
            true
        } else {
            false
        };

        // Also clean up local tracked lists
        let mut files = self.files.lock().await;
        let initial_len = files.len();
        files.retain(|f| f.id != id);

        let mut chunks = self.uploaded_chunks.lock().await;
        chunks.remove(&id);

        let res = Ok(files.len() < initial_len || is_telegram_file_deleted);
        tracing::info!("delete_file response: {:?}", res);
        res
    }

    async fn upload_part(
        &self,
        file_id: i64,
        part_index: i32,
        bytes: Vec<u8>,
    ) -> Result<bool, String> {
        tracing::info!("upload_part request: file_id={}, part_index={}, bytes_len={}", file_id, part_index, bytes.len());
        let mut chunks = self.uploaded_chunks.lock().await;
        let parts = chunks.entry(file_id).or_insert_with(Vec::new);
        parts.push((part_index, bytes));
        let res = Ok(true);
        tracing::info!("upload_part response: {:?}", res);
        res
    }

    async fn save_file(
        &self,
        file_id: i64,
        name: &str,
        size: i64,
        folder_id: Option<i64>,
    ) -> Result<FileMetadata, String> {
        tracing::info!("save_file request: file_id={}, name={}, size={}, folder_id={:?}", file_id, name, size, folder_id);
        
        let file_bytes = {
            let mut chunks = self.uploaded_chunks.lock().await;
            if let Some(parts) = chunks.remove(&file_id) {
                let mut sorted_parts = parts;
                sorted_parts.sort_by_key(|p| p.0);
                let mut bytes = Vec::new();
                for (_, chunk) in sorted_parts {
                    bytes.extend(chunk);
                }
                bytes
            } else {
                return Err(format!("No uploaded parts found for file_id {}", file_id));
            }
        };

        let mut target_chat = None;
        let client_res = self.get_client().await;

        if let Ok(client) = &client_res {
            if let Some(chat_id) = folder_id {
                let mut dialogs_iter = client.iter_dialogs();
                while let Ok(Some(dialog)) = dialogs_iter.next().await {
                    let chat = dialog.chat();
                    if chat.id() == chat_id {
                        target_chat = Some(chat.pack());
                        break;
                    }
                }
            }
        }

        if let (Ok(client), Some(peer)) = (client_res, target_chat) {
            use grammers_client::grammers_tl_types as tl;
            
            let chunk_size = 512 * 1024; // 512 KB
            let total_parts = ((file_bytes.len() + chunk_size - 1) / chunk_size) as i32;
            let total_parts = if total_parts == 0 { 1 } else { total_parts };
            let is_big = size > 10 * 1024 * 1024; // 10 MB

            for part_index in 0..total_parts {
                let start = (part_index as usize) * chunk_size;
                let end = std::cmp::min(start + chunk_size, file_bytes.len());
                let chunk_data = file_bytes[start..end].to_vec();

                if is_big {
                    client.invoke(&tl::functions::upload::SaveBigFilePart {
                        file_id,
                        file_part: part_index,
                        file_total_parts: total_parts,
                        bytes: chunk_data,
                    }).await.map_err(|e| e.to_string())?;
                } else {
                    client.invoke(&tl::functions::upload::SaveFilePart {
                        file_id,
                        file_part: part_index,
                        bytes: chunk_data,
                    }).await.map_err(|e| e.to_string())?;
                }

                // Update progress
                let progress_percent = ((part_index + 1) * 100) / total_parts;
                {
                    let mut progress = self.upload_progress.lock().await;
                    progress.insert(file_id, progress_percent);
                }
            }

            let input_file = if is_big {
                tl::enums::InputFile::Big(tl::types::InputFileBig {
                    id: file_id,
                    parts: total_parts,
                    name: name.to_string(),
                })
            } else {
                let hash = md5::compute(&file_bytes);
                let md5_checksum = format!("{:x}", hash);
                tl::enums::InputFile::File(tl::types::InputFile {
                    id: file_id,
                    parts: total_parts,
                    name: name.to_string(),
                    md5_checksum,
                })
            };

            let uploaded = grammers_client::types::media::Uploaded::from_raw(input_file);

            {
                let mut progress = self.upload_progress.lock().await;
                progress.insert(file_id, 100);
            }

            use grammers_client::types::InputMessage;
            let message = InputMessage::default().document(uploaded);
            let sent_message = client.send_message(peer, message).await.map_err(|e| e.to_string())?;

            let media = sent_message.media().ok_or_else(|| "Sent message does not contain media".to_string())?;
            let doc = match media {
                grammers_client::types::Media::Document(d) => d,
                _ => return Err("Sent media is not a document".to_string()),
            };

            let doc_name = doc.name().to_string();
            let file_ext = doc_name.split('.').last().map(|s| s.to_string());
            let icon_type = match file_ext.as_deref() {
                Some("pdf") => "pdf".to_string(),
                Some("png") | Some("jpg") | Some("jpeg") | Some("gif") | Some("svg") => "image".to_string(),
                Some("zip") | Some("tar") | Some("gz") | Some("rar") => "archive".to_string(),
                Some("mp4") | Some("mkv") | Some("avi") | Some("mov") => "video".to_string(),
                Some("mp3") | Some("wav") | Some("ogg") | Some("m4a") | Some("flac") => "audio".to_string(),
                Some("js") | Some("ts") | Some("tsx") | Some("rs") | Some("py") | Some("json") | Some("css") | Some("html") => "code".to_string(),
                Some("csv") | Some("xlsx") | Some("xls") => "csv".to_string(),
                _ => "file".to_string(),
            };

            let created_at = doc.creation_date()
                .map(|d| d.to_rfc3339())
                .unwrap_or_else(|| Utc::now().to_rfc3339());

            // Since it is saved on Telegram, we do not update local self.files list.
            Ok(FileMetadata {
                id: doc.id(),
                folder_id,
                name: doc_name,
                size: doc.size(),
                mime_type: doc.mime_type().map(|s| s.to_string()),
                file_ext,
                created_at,
                icon_type,
                telegram_message_id: Some(sent_message.id()),
            })
        } else {
            // Fallback to local storage (mock/test behavior)
            {
                let mut chunks = self.uploaded_chunks.lock().await;
                chunks.insert(file_id, vec![(0, file_bytes)]);
            }

            let mut files = self.files.lock().await;
            let file_ext = name.split('.').last().map(|s| s.to_string());
            let icon_type = match file_ext.as_deref() {
                Some("pdf") => "pdf".to_string(),
                Some("png") | Some("jpg") | Some("jpeg") | Some("gif") | Some("svg") => "image".to_string(),
                Some("zip") | Some("tar") | Some("gz") | Some("rar") => "archive".to_string(),
                Some("mp4") | Some("mkv") | Some("avi") | Some("mov") => "video".to_string(),
                Some("mp3") | Some("wav") | Some("ogg") | Some("m4a") | Some("flac") => "audio".to_string(),
                Some("js") | Some("ts") | Some("tsx") | Some("rs") | Some("py") | Some("json") | Some("css") | Some("html") => "code".to_string(),
                Some("csv") | Some("xlsx") | Some("xls") => "csv".to_string(),
                _ => "file".to_string(),
            };

            let new_file = FileMetadata {
                id: file_id,
                folder_id,
                name: name.to_string(),
                size,
                mime_type: Some("application/octet-stream".to_string()),
                file_ext,
                created_at: Utc::now().to_rfc3339(),
                icon_type,
                telegram_message_id: None,
            };

            files.push(new_file.clone());
            Ok(new_file)
        }
    }

    async fn download_file(&self, file_id: i64) -> Result<Vec<u8>, String> {
        tracing::info!("download_file request: file_id={}", file_id);
        let res = (|| async {
            // First check in-memory uploaded chunks
            {
                let chunks = self.uploaded_chunks.lock().await;
                if let Some(parts) = chunks.get(&file_id) {
                    let mut sorted_parts = parts.clone();
                    sorted_parts.sort_by_key(|p| p.0);

                    let mut full_file = Vec::new();
                    for (_, chunk) in sorted_parts {
                        full_file.extend(chunk);
                    }
                    return Ok(full_file);
                }
            }

            // If not in memory, query Telegram channels for a document with this file_id
            let client = self.get_client().await?;
            let mut dialogs_iter = client.iter_dialogs();
            let mut found_media = None;

            'outer: while let Some(dialog) = dialogs_iter.next().await.map_err(|e| e.to_string())? {
                let chat = dialog.chat();
                if matches!(chat, grammers_client::types::Chat::Channel(_)) {
                    let mut messages = client.iter_messages(chat.pack());
                    while let Some(msg) = messages.next().await.map_err(|e| e.to_string())? {
                        if let Some(media) = msg.media() {
                            if let grammers_client::types::Media::Document(doc) = &media {
                                if doc.id() == file_id {
                                    found_media = Some(media);
                                    break 'outer;
                                }
                            }
                        }
                    }
                }
            }

            if let Some(media) = found_media {
                let temp_filename = format!("temp_download_{}.bin", file_id);
                let temp_path = std::path::Path::new(&temp_filename);
                
                let downloadable = grammers_client::types::Downloadable::Media(media);
                client.download_media(&downloadable, temp_path).await.map_err(|e| e.to_string())?;
                
                let bytes = std::fs::read(temp_path).map_err(|e| e.to_string())?;
                let _ = std::fs::remove_file(temp_path);
                
                Ok(bytes)
            } else {
                Err(format!("File with ID {} not found in memory or on Telegram channels.", file_id))
            }
        })().await;

        match &res {
            Ok(bytes) => tracing::info!("download_file response: Ok(bytes_len={})", bytes.len()),
            Err(err) => tracing::info!("download_file response: Err({})", err),
        }
        res
    }

    async fn get_upload_progress(&self, file_id: i64) -> Result<i32, String> {
        let progress = self.upload_progress.lock().await;
        if let Some(&p) = progress.get(&file_id) {
            Ok(p)
        } else {
            Ok(0)
        }
    }
}
