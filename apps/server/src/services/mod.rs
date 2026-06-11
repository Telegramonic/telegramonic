use serde::{Deserialize, Serialize};
use std::sync::Arc;

pub mod telegram;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "status", content = "data")]
pub enum AuthState {
    LoggedOut,
    AwaitingCode {
        phone: String,
        phone_code_hash: String,
    },
    AwaitingPassword {
        phone: String,
    },
    LoggedIn,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AuthResult {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next_step: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct FileMetadata {
    #[serde(
        serialize_with = "serialize_i64_as_string",
        deserialize_with = "deserialize_i64_from_string_or_number"
    )]
    pub id: i64,
    #[serde(with = "serde_option_i64_string")]
    pub folder_id: Option<i64>,
    pub name: String,
    pub size: i64,
    pub mime_type: Option<String>,
    pub file_ext: Option<String>,
    pub created_at: String,
    pub icon_type: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub telegram_message_id: Option<i32>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct FolderMetadata {
    #[serde(
        serialize_with = "serialize_i64_as_string",
        deserialize_with = "deserialize_i64_from_string_or_number"
    )]
    pub id: i64,
    #[serde(with = "serde_option_i64_string")]
    pub parent_id: Option<i64>,
    pub name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Drive {
    #[serde(
        serialize_with = "serialize_i64_as_string",
        deserialize_with = "deserialize_i64_from_string_or_number"
    )]
    pub chat_id: i64,
    pub name: String,
    pub icon: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DriveStats {
    pub total_space: i64,
    pub used_space: i64,
    pub file_count: i64,
    pub folder_count: i64,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TelegramUser {
    #[serde(
        serialize_with = "serialize_i64_as_string",
        deserialize_with = "deserialize_i64_from_string_or_number"
    )]
    pub id: i64,
    pub first_name: String,
    pub last_name: Option<String>,
    pub username: Option<String>,
    pub phone: Option<String>,
}

// Global thread-safe service trait
#[axum::async_trait]
pub trait TelegramService: Send + Sync {
    // Auth operations
    async fn send_code(
        &self,
        phone: &str,
        api_id: i32,
        api_hash: &str,
    ) -> Result<AuthResult, String>;
    async fn sign_in(
        &self,
        phone: &str,
        phone_code_hash: &str,
        code: &str,
    ) -> Result<AuthResult, String>;
    async fn check_password(&self, password: &str) -> Result<AuthResult, String>;
    async fn log_out(&self) -> Result<bool, String>;
    async fn reset_authorization(&self) -> Result<bool, String>;
    async fn update_credentials(&self, api_id: i32, api_hash: &str) -> Result<bool, String>;
    async fn get_auth_state(&self) -> AuthState;

    // User/Account operations
    async fn get_me(&self) -> Result<TelegramUser, String>;
    async fn get_users(&self) -> Result<Vec<TelegramUser>, String>;
    async fn get_full_user(&self, user_id: i64) -> Result<TelegramUser, String>;
    async fn update_profile(
        &self,
        first_name: &str,
        last_name: Option<&str>,
    ) -> Result<bool, String>;
    async fn update_status(&self, offline: bool) -> Result<bool, String>;
    async fn update_username(&self, username: &str) -> Result<bool, String>;

    // Drive & Files operations
    async fn get_drives(&self) -> Result<Vec<Drive>, String>;
    async fn get_stats(&self) -> Result<DriveStats, String>;
    async fn get_folders(&self, parent_id: Option<i64>) -> Result<Vec<FolderMetadata>, String>;
    async fn get_files(
        &self,
        folder_id: Option<i64>,
        search_query: Option<&str>,
        all: Option<bool>,
    ) -> Result<Vec<FileMetadata>, String>;
    async fn create_folder(
        &self,
        name: &str,
        parent_id: Option<i64>,
    ) -> Result<FolderMetadata, String>;
    async fn delete_folder(&self, id: i64) -> Result<bool, String>;
    async fn delete_file(&self, id: i64) -> Result<bool, String>;

    // File upload/download
    async fn upload_part(
        &self,
        file_id: i64,
        part_index: i32,
        file_size: i64,
        total_parts: i32,
        byte_offset: i64,
        bytes: Vec<u8>,
    ) -> Result<bool, String>;
    async fn save_file(
        &self,
        file_id: i64,
        name: &str,
        size: i64,
        folder_id: Option<i64>,
    ) -> Result<FileMetadata, String>;
    async fn download_file(&self, file_id: i64) -> Result<Vec<u8>, String>;
    async fn get_upload_progress(&self, file_id: i64) -> Result<i32, String>;
}

pub type DynTelegramService = Arc<dyn TelegramService>;

pub fn serialize_i64_as_string<S>(val: &i64, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    serializer.serialize_str(&val.to_string())
}

pub fn deserialize_i64_from_string_or_number<'de, D>(deserializer: D) -> Result<i64, D::Error>
where
    D: serde::Deserializer<'de>,
{
    #[derive(serde::Deserialize)]
    #[serde(untagged)]
    enum StringOrNumber {
        String(String),
        Number(i64),
    }

    match StringOrNumber::deserialize(deserializer)? {
        StringOrNumber::String(s) => s.parse::<i64>().map_err(serde::de::Error::custom),
        StringOrNumber::Number(n) => Ok(n),
    }
}

pub mod serde_option_i64_string {
    use serde::{Deserialize, Deserializer, Serializer};

    pub fn serialize<S>(value: &Option<i64>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match value {
            Some(v) => serializer.serialize_some(&v.to_string()),
            None => serializer.serialize_none(),
        }
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Option<i64>, D::Error>
    where
        D: Deserializer<'de>,
    {
        #[derive(Deserialize)]
        #[serde(untagged)]
        enum OptionStringOrNumber {
            SomeString(String),
            SomeNumber(i64),
            None,
        }

        match OptionStringOrNumber::deserialize(deserializer)? {
            OptionStringOrNumber::SomeString(s) => {
                s.parse::<i64>().map(Some).map_err(serde::de::Error::custom)
            }
            OptionStringOrNumber::SomeNumber(n) => Ok(Some(n)),
            OptionStringOrNumber::None => Ok(None),
        }
    }
}
