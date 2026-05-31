use std::net::SocketAddr;
use std::sync::Arc;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod handlers;
mod services;

use config::AppConfig;
use handlers::create_router;
use services::{mock::MockTelegramService, telegram::RealTelegramService, TelegramService};

#[tokio::main]
async fn main() {
    // Initialize logging / tracing subscriber
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "telegramonic_server=info,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = AppConfig::from_env();
    tracing::info!("Loaded server configuration: {:?}", config);

    // Initialize Telegram Client service based on mode
    let service: Arc<dyn TelegramService> = if config.mock_mode {
        tracing::info!("Starting server in MOCK mode (in-memory simulation)");
        Arc::new(MockTelegramService::new())
    } else {
        // In real mode both TELEGRAM_API_ID and TELEGRAM_API_HASH must be present.
        // If either is missing, warn and fall back to mock mode so the server
        // remains usable for local development without credentials.
        match (config.api_id, config.api_hash) {
            (Some(api_id), Some(api_hash)) => {
                tracing::info!("Starting server in REAL mode (connecting to Telegram MTProto API)");
                Arc::new(RealTelegramService::new(api_id, api_hash))
            }
            (missing_id, missing_hash) => {
                if missing_id.is_none() {
                    tracing::warn!(
                        "TELEGRAM_API_ID is not set — cannot start in real mode."
                    );
                }
                if missing_hash.is_none() {
                    tracing::warn!(
                        "TELEGRAM_API_HASH is not set — cannot start in real mode."
                    );
                }
                tracing::warn!(
                    "\n\n  ⚠  Falling back to MOCK MODE.\
                     \n     To use real Telegram, restart with:\
                     \n       TELEGRAM_API_ID=<id> TELEGRAM_API_HASH=<hash> cargo run\
                     \n     Get credentials at: https://my.telegram.org/apps\n"
                );
                Arc::new(MockTelegramService::new())
            }
        }
    };

    // Create Axum Router
    let app = create_router(service);

    // Bind to address and start server
    let addr_str = format!("{}:{}", config.host, config.port);
    let addr: SocketAddr = addr_str.parse().expect("Failed to parse socket address");
    
    tracing::info!("Telegramonic Rust backend server listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap_or_else(|err| panic!("Failed to bind to {}: {}", addr, err));
        
    axum::serve(listener, app)
        .await
        .unwrap_or_else(|err| panic!("Server error: {}", err));
}
