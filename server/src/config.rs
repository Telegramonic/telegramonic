use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
    pub mock_mode: bool,
    pub api_id: Option<i32>,
    pub api_hash: Option<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        // Load configuration from environment variables, using sensible defaults
        let host = env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());

        let port = env::var("PORT")
            .ok()
            .and_then(|p| p.parse().ok())
            .unwrap_or(8080);

        let mock_mode = env::var("MOCK_MODE")
            .ok()
            .and_then(|m| m.parse().ok())
            .unwrap_or(false); // Default: real mode. Set MOCK_MODE=true for local development without credentials.

        let api_id = env::var("TELEGRAM_API_ID")
            .ok()
            .and_then(|id| id.parse().ok());

        let api_hash = env::var("TELEGRAM_API_HASH").ok();

        Self {
            host,
            port,
            mock_mode,
            api_id,
            api_hash,
        }
    }
}
