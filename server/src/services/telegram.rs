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
}

impl std::fmt::Debug for RealTelegramService {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("RealTelegramService")
            .field("session_file", &self.session_file)
            .finish()
    }
}

impl RealTelegramService {
    pub fn new() -> Self {
        let (api_id, api_hash) = match Self::load_credentials_file() {
            Ok(creds) => (Some(creds.0), Some(creds.1)),
            Err(_) => (None, None),
        };

        let initial_folders = vec![
            FolderMetadata {
                id: 1,
                parent_id: None,
                name: "Documents".to_string(),
            },
            FolderMetadata {
                id: 2,
                parent_id: None,
                name: "Images".to_string(),
            },
            FolderMetadata {
                id: 3,
                parent_id: None,
                name: "Backups".to_string(),
            },
            FolderMetadata {
                id: 4,
                parent_id: Some(1),
                name: "Invoices".to_string(),
            },
        ];

        let initial_files = vec![
            FileMetadata {
                id: 101,
                folder_id: None,
                name: "resume.pdf".to_string(),
                size: 358400,
                mime_type: Some("application/pdf".to_string()),
                file_ext: Some("pdf".to_string()),
                created_at: Utc::now().to_rfc3339(),
                icon_type: "pdf".to_string(),
            },
            FileMetadata {
                id: 102,
                folder_id: Some(2),
                name: "profile_pic.jpg".to_string(),
                size: 870400,
                mime_type: Some("image/jpeg".to_string()),
                file_ext: Some("jpg".to_string()),
                created_at: Utc::now().to_rfc3339(),
                icon_type: "image".to_string(),
            },
            FileMetadata {
                id: 103,
                folder_id: Some(3),
                name: "database_dump.sql.gz".to_string(),
                size: 47185920,
                mime_type: Some("application/gzip".to_string()),
                file_ext: Some("gz".to_string()),
                created_at: Utc::now().to_rfc3339(),
                icon_type: "archive".to_string(),
            },
        ];

        Self {
            client: Arc::new(Mutex::new(None)),
            api_id: Arc::new(Mutex::new(api_id)),
            api_hash: Arc::new(Mutex::new(api_hash)),
            session_file: "telegram.session".to_string(),
            login_token: Arc::new(Mutex::new(None)),
            password_token: Arc::new(Mutex::new(None)),
            folders: Arc::new(Mutex::new(initial_folders)),
            files: Arc::new(Mutex::new(initial_files)),
            uploaded_chunks: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    fn load_credentials_file() -> Result<(i32, String), String> {
        let content = std::fs::read_to_string("telegram.credentials").map_err(|e| e.to_string())?;
        let lines: Vec<&str> = content.lines().collect();
        if lines.len() < 2 {
            return Err("Invalid credentials file format".to_string());
        }
        let api_id = lines[0].trim().parse::<i32>().map_err(|e| e.to_string())?;
        let api_hash = lines[1].trim().to_string();
        Ok((api_id, api_hash))
    }

    fn save_credentials_file(api_id: i32, api_hash: &str) -> Result<(), String> {
        let content = format!("{}\n{}", api_id, api_hash);
        std::fs::write("telegram.credentials", content).map_err(|e| e.to_string())
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
        match self.get_client().await {
            Ok(client) => match client.is_authorized().await {
                Ok(true) => AuthState::LoggedIn,
                _ => AuthState::LoggedOut,
            },
            Err(_) => AuthState::LoggedOut,
        }
    }

    async fn send_code(
        &self,
        phone: &str,
        api_id: i32,
        api_hash: &str,
    ) -> Result<AuthResult, String> {
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

        Ok(AuthResult {
            success: true,
            next_step: Some("code".to_string()),
            error: None,
        })
    }

    async fn sign_in(
        &self,
        _phone: &str,
        _phone_code_hash: &str,
        code: &str,
    ) -> Result<AuthResult, String> {
        let client = self.get_client().await?;
        let token_lock = self.login_token.lock().await;
        let token = token_lock
            .as_ref()
            .ok_or("Login token not found. Call send-code first.")?;

        match client.sign_in(token, code).await {
            Ok(_user) => {
                // Save credentials to local configuration file
                let api_id = *self.api_id.lock().await;
                let api_hash = self.api_hash.lock().await.clone();
                if let (Some(id), Some(hash)) = (api_id, api_hash) {
                    let _ = Self::save_credentials_file(id, &hash);
                }

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
        }
    }

    async fn check_password(&self, password: &str) -> Result<AuthResult, String> {
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

        Ok(AuthResult {
            success: true,
            next_step: Some("dashboard".to_string()),
            error: None,
        })
    }

    async fn log_out(&self) -> Result<bool, String> {
        let client = self.get_client().await?;
        let _ = client.sign_out().await;

        {
            *self.api_id.lock().await = None;
            *self.api_hash.lock().await = None;
            *self.client.lock().await = None;
        }

        let _ = std::fs::remove_file(&self.session_file);
        let _ = std::fs::remove_file("telegram.credentials");
        Ok(true)
    }

    async fn reset_authorization(&self) -> Result<bool, String> {
        {
            *self.api_id.lock().await = None;
            *self.api_hash.lock().await = None;
            *self.client.lock().await = None;
        }
        let _ = std::fs::remove_file(&self.session_file);
        let _ = std::fs::remove_file("telegram.credentials");
        Ok(true)
    }

    async fn get_me(&self) -> Result<TelegramUser, String> {
        let client = self.get_client().await?;
        let me = client.get_me().await.map_err(|e| e.to_string())?;
        Ok(TelegramUser {
            id: me.id(),
            first_name: me.first_name().to_string(),
            last_name: me.last_name().map(|s| s.to_string()),
            username: me.username().map(|s| s.to_string()),
            phone: me.phone().map(|s| s.to_string()),
        })
    }

    async fn get_users(&self) -> Result<Vec<TelegramUser>, String> {
        let me = self.get_me().await?;
        Ok(vec![me])
    }

    async fn get_full_user(&self, user_id: i64) -> Result<TelegramUser, String> {
        Ok(TelegramUser {
            id: user_id,
            first_name: "Telegram".to_string(),
            last_name: Some("User".to_string()),
            username: None,
            phone: None,
        })
    }

    async fn update_profile(
        &self,
        _first_name: &str,
        _last_name: Option<&str>,
    ) -> Result<bool, String> {
        Ok(true)
    }

    async fn update_status(&self, _offline: bool) -> Result<bool, String> {
        Ok(true)
    }

    async fn update_username(&self, _username: &str) -> Result<bool, String> {
        Ok(true)
    }

    async fn get_drives(&self) -> Result<Vec<Drive>, String> {
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
    }

    async fn get_stats(&self) -> Result<DriveStats, String> {
        let files = self.files.lock().await;
        let folders = self.folders.lock().await;
        let total_size: i64 = files.iter().map(|f| f.size).sum();

        Ok(DriveStats {
            total_space: 10995116277760, // 10 TB simulated capacity
            used_space: total_size,
            file_count: files.len() as i64,
            folder_count: folders.len() as i64,
        })
    }

    async fn get_folders(&self, parent_id: Option<i64>) -> Result<Vec<FolderMetadata>, String> {
        let folders = self.folders.lock().await;
        let filtered = folders
            .iter()
            .filter(|f| f.parent_id == parent_id)
            .cloned()
            .collect();
        Ok(filtered)
    }

    async fn get_files(
        &self,
        folder_id: Option<i64>,
        search_query: Option<&str>,
    ) -> Result<Vec<FileMetadata>, String> {
        let files = self.files.lock().await;
        let mut filtered: Vec<FileMetadata> = files
            .iter()
            .filter(|f| f.folder_id == folder_id)
            .cloned()
            .collect();

        if let Some(query) = search_query {
            let query_lower = query.to_lowercase();
            filtered.retain(|f| f.name.to_lowercase().contains(&query_lower));
        }

        Ok(filtered)
    }

    async fn create_folder(
        &self,
        name: &str,
        parent_id: Option<i64>,
    ) -> Result<FolderMetadata, String> {
        let mut folders = self.folders.lock().await;
        if name.is_empty() {
            return Err("Folder name cannot be empty".to_string());
        }

        let new_id = (folders.len() + 1) as i64;
        let new_folder = FolderMetadata {
            id: new_id,
            parent_id,
            name: name.to_string(),
        };

        folders.push(new_folder.clone());
        Ok(new_folder)
    }

    async fn delete_folder(&self, id: i64) -> Result<bool, String> {
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

        Ok(folders.len() < initial_len)
    }

    async fn upload_part(
        &self,
        file_id: i64,
        part_index: i32,
        bytes: Vec<u8>,
    ) -> Result<bool, String> {
        let mut chunks = self.uploaded_chunks.lock().await;
        let parts = chunks.entry(file_id).or_insert_with(Vec::new);
        parts.push((part_index, bytes));
        Ok(true)
    }

    async fn save_file(
        &self,
        file_id: i64,
        name: &str,
        size: i64,
        folder_id: Option<i64>,
    ) -> Result<FileMetadata, String> {
        let mut files = self.files.lock().await;

        // Deduce file extension
        let file_ext = name.split('.').last().map(|s| s.to_string());

        // Determine icon_type
        let icon_type = match file_ext.as_deref() {
            Some("pdf") => "pdf".to_string(),
            Some("png") | Some("jpg") | Some("jpeg") | Some("gif") => "image".to_string(),
            Some("zip") | Some("tar") | Some("gz") | Some("rar") => "archive".to_string(),
            Some("mp4") | Some("mkv") | Some("avi") => "video".to_string(),
            Some("mp3") | Some("wav") | Some("ogg") => "audio".to_string(),
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
        };

        files.push(new_file.clone());
        Ok(new_file)
    }

    async fn download_file(&self, file_id: i64) -> Result<Vec<u8>, String> {
        let chunks = self.uploaded_chunks.lock().await;

        // Reassemble file parts
        if let Some(parts) = chunks.get(&file_id) {
            let mut sorted_parts = parts.clone();
            sorted_parts.sort_by_key(|p| p.0);

            let mut full_file = Vec::new();
            for (_, chunk) in sorted_parts {
                full_file.extend(chunk);
            }
            Ok(full_file)
        } else {
            // Return some dummy payload for initial mock files
            Ok(format!("This is the content of mock file ID: {}", file_id).into_bytes())
        }
    }
}
