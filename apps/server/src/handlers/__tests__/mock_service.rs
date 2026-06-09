use crate::services::{
    AuthResult, AuthState, Drive, DriveStats, FileMetadata, FolderMetadata, TelegramService,
    TelegramUser,
};
use chrono::Utc;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug)]
struct MockDb {
    auth_state: AuthState,
    folders: Vec<FolderMetadata>,
    files: Vec<FileMetadata>,
    drives: Vec<Drive>,
    uploaded_chunks: HashMap<i64, Vec<(i32, Vec<u8>)>>, // file_id -> vector of (part_index, bytes)
}

#[derive(Clone, Debug)]
pub struct MockTelegramService {
    db: Arc<Mutex<MockDb>>,
}

impl MockTelegramService {
    pub fn new() -> Self {
        Self::new_with_state(AuthState::LoggedOut)
    }

    pub fn new_logged_in() -> Self {
        Self::new_with_state(AuthState::LoggedIn)
    }

    pub fn new_with_state(auth_state: AuthState) -> Self {
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
                telegram_message_id: None,
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
                telegram_message_id: Some(202),
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
                telegram_message_id: Some(303),
            },
        ];

        let initial_drives = vec![
            Drive {
                chat_id: -1001987654321,
                name: "Telegramonic Cloud Drive".to_string(),
                icon: None,
            },
            Drive {
                chat_id: -1001234567890,
                name: "Shared Assets Channel".to_string(),
                icon: None,
            },
        ];

        let db = MockDb {
            auth_state,
            folders: initial_folders,
            files: initial_files,
            drives: initial_drives,
            uploaded_chunks: HashMap::new(),
        };

        Self {
            db: Arc::new(Mutex::new(db)),
        }
    }
}

#[axum::async_trait]
impl TelegramService for MockTelegramService {
    async fn get_auth_state(&self) -> AuthState {
        let db = self.db.lock().await;
        db.auth_state.clone()
    }

    async fn send_code(
        &self,
        phone: &str,
        _api_id: i32,
        _api_hash: &str,
    ) -> Result<AuthResult, String> {
        let mut db = self.db.lock().await;
        if phone.is_empty() {
            return Err("Phone number cannot be empty".to_string());
        }

        db.auth_state = AuthState::AwaitingCode {
            phone: phone.to_string(),
            phone_code_hash: "mock_hash_xyz123".to_string(),
        };

        Ok(AuthResult {
            success: true,
            next_step: Some("code".to_string()),
            error: None,
        })
    }

    async fn sign_in(
        &self,
        phone: &str,
        _phone_code_hash: &str,
        code: &str,
    ) -> Result<AuthResult, String> {
        let mut db = self.db.lock().await;

        // Simulating different login outcomes based on code input
        if code == "2fa" || code == "22222" {
            db.auth_state = AuthState::AwaitingPassword {
                phone: phone.to_string(),
            };
            Ok(AuthResult {
                success: true,
                next_step: Some("password".to_string()),
                error: None,
            })
        } else if code == "12345" || code == "11111" {
            db.auth_state = AuthState::LoggedIn;
            Ok(AuthResult {
                success: true,
                next_step: Some("dashboard".to_string()),
                error: None,
            })
        } else {
            Ok(AuthResult {
                success: false,
                next_step: Some("code".to_string()),
                error: Some("Invalid authentication code. Use '12345' for direct login or '2fa' for 2FA password verification.".to_string()),
            })
        }
    }

    async fn check_password(&self, password: &str) -> Result<AuthResult, String> {
        let mut db = self.db.lock().await;

        if password == "password" || password == "admin" {
            db.auth_state = AuthState::LoggedIn;
            Ok(AuthResult {
                success: true,
                next_step: Some("dashboard".to_string()),
                error: None,
            })
        } else {
            Ok(AuthResult {
                success: false,
                next_step: Some("password".to_string()),
                error: Some("Invalid 2FA password. Try 'password'.".to_string()),
            })
        }
    }

    async fn log_out(&self) -> Result<bool, String> {
        let mut db = self.db.lock().await;
        db.auth_state = AuthState::LoggedOut;
        Ok(true)
    }

    async fn reset_authorization(&self) -> Result<bool, String> {
        let mut db = self.db.lock().await;
        db.auth_state = AuthState::LoggedOut;
        Ok(true)
    }

    async fn get_me(&self) -> Result<TelegramUser, String> {
        Ok(TelegramUser {
            id: 123456789,
            first_name: "Mock".to_string(),
            last_name: Some("User".to_string()),
            username: Some("mock_telegram_user".to_string()),
            phone: Some("+15555555555".to_string()),
        })
    }

    async fn get_users(&self) -> Result<Vec<TelegramUser>, String> {
        Ok(vec![
            TelegramUser {
                id: 123456789,
                first_name: "Mock".to_string(),
                last_name: Some("User".to_string()),
                username: Some("mock_telegram_user".to_string()),
                phone: Some("+15555555555".to_string()),
            },
            TelegramUser {
                id: 987654321,
                first_name: "John".to_string(),
                last_name: Some("Doe".to_string()),
                username: Some("johndoe".to_string()),
                phone: None,
            },
        ])
    }

    async fn get_full_user(&self, user_id: i64) -> Result<TelegramUser, String> {
        if user_id == 123456789 {
            self.get_me().await
        } else {
            Ok(TelegramUser {
                id: user_id,
                first_name: "External".to_string(),
                last_name: Some("User".to_string()),
                username: Some("external_user".to_string()),
                phone: None,
            })
        }
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
        let db = self.db.lock().await;
        Ok(db.drives.clone())
    }

    async fn get_stats(&self) -> Result<DriveStats, String> {
        let db = self.db.lock().await;
        let total_size: i64 = db.files.iter().map(|f| f.size).sum();
        Ok(DriveStats {
            total_space: 10995116277760, // 10 TB simulated capacity
            used_space: total_size,
            file_count: db.files.len() as i64,
            folder_count: db.folders.len() as i64,
        })
    }

    async fn get_folders(&self, parent_id: Option<i64>) -> Result<Vec<FolderMetadata>, String> {
        let db = self.db.lock().await;
        let filtered = db
            .folders
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
        all: Option<bool>,
    ) -> Result<Vec<FileMetadata>, String> {
        let db = self.db.lock().await;
        let mut filtered: Vec<FileMetadata> = db
            .files
            .iter()
            .filter(|f| all == Some(true) || f.folder_id == folder_id)
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
        let mut db = self.db.lock().await;
        if name.is_empty() {
            return Err("Folder name cannot be empty".to_string());
        }

        let new_id = (db.folders.len() + 1) as i64;
        let new_folder = FolderMetadata {
            id: new_id,
            parent_id,
            name: name.to_string(),
        };

        db.folders.push(new_folder.clone());
        Ok(new_folder)
    }

    async fn delete_folder(&self, id: i64) -> Result<bool, String> {
        let mut db = self.db.lock().await;
        let initial_len = db.folders.len();
        db.folders.retain(|f| f.id != id);

        // Cascade delete or un-parent files/folders
        for folder in db.folders.iter_mut() {
            if folder.parent_id == Some(id) {
                folder.parent_id = None;
            }
        }
        for file in db.files.iter_mut() {
            if file.folder_id == Some(id) {
                file.folder_id = None;
            }
        }

        Ok(db.folders.len() < initial_len)
    }

    async fn delete_file(&self, id: i64) -> Result<bool, String> {
        let mut db = self.db.lock().await;
        let initial_len = db.files.len();
        db.files.retain(|f| f.id != id);
        db.uploaded_chunks.remove(&id);
        Ok(db.files.len() < initial_len)
    }

    async fn upload_part(
        &self,
        file_id: i64,
        part_index: i32,
        bytes: Vec<u8>,
    ) -> Result<bool, String> {
        let mut db = self.db.lock().await;
        let parts = db.uploaded_chunks.entry(file_id).or_insert_with(Vec::new);
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
        let mut db = self.db.lock().await;

        // Deduce file extension
        let file_ext = name.split('.').last().map(|s| s.to_string());

        // Determine icon_type
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
            telegram_message_id: Some(12345),
        };

        db.files.push(new_file.clone());
        Ok(new_file)
    }

    async fn download_file(&self, file_id: i64) -> Result<Vec<u8>, String> {
        let db = self.db.lock().await;

        // Reassemble file parts
        if let Some(parts) = db.uploaded_chunks.get(&file_id) {
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

    async fn get_upload_progress(&self, _file_id: i64) -> Result<i32, String> {
        Ok(100)
    }
}
