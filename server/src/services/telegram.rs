use super::{
    AuthResult, AuthState, Drive, DriveStats, FileMetadata, FolderMetadata, TelegramService,
    TelegramUser,
};
use chrono::Utc;
use grammers_client::{Client, Config, InitParams};
use grammers_session::Session;
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

        Self {
            client: Arc::new(Mutex::new(None)),
            api_id: Arc::new(Mutex::new(api_id)),
            api_hash: Arc::new(Mutex::new(api_hash)),
            session_file: "telegram.session".to_string(),
            login_token: Arc::new(Mutex::new(None)),
            password_token: Arc::new(Mutex::new(None)),
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
        Ok(DriveStats {
            total_space: 1024 * 1024 * 1024 * 1024 * 10,
            used_space: 0,
            file_count: 0,
            folder_count: 0,
        })
    }

    async fn get_folders(&self, _parent_id: Option<i64>) -> Result<Vec<FolderMetadata>, String> {
        Ok(vec![])
    }

    async fn get_files(
        &self,
        _folder_id: Option<i64>,
        _search_query: Option<&str>,
    ) -> Result<Vec<FileMetadata>, String> {
        Ok(vec![])
    }

    async fn create_folder(
        &self,
        name: &str,
        _parent_id: Option<i64>,
    ) -> Result<FolderMetadata, String> {
        Ok(FolderMetadata {
            id: 999,
            parent_id: None,
            name: name.to_string(),
        })
    }

    async fn delete_folder(&self, _id: i64) -> Result<bool, String> {
        Ok(true)
    }

    async fn upload_part(
        &self,
        _file_id: i64,
        _part_index: i32,
        _bytes: Vec<u8>,
    ) -> Result<bool, String> {
        Ok(true)
    }

    async fn save_file(
        &self,
        file_id: i64,
        name: &str,
        size: i64,
        folder_id: Option<i64>,
    ) -> Result<FileMetadata, String> {
        Ok(FileMetadata {
            id: file_id,
            folder_id,
            name: name.to_string(),
            size,
            mime_type: None,
            file_ext: None,
            created_at: Utc::now().to_rfc3339(),
            icon_type: "file".to_string(),
        })
    }

    async fn download_file(&self, _file_id: i64) -> Result<Vec<u8>, String> {
        Ok(vec![])
    }
}
