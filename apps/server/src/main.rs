use std::net::SocketAddr;
use std::sync::Arc;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod handlers;
mod services;

use config::AppConfig;
use handlers::create_router;
use services::{telegram::RealTelegramService, TelegramService};

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

    // Initialize Telegram Client service (Real mode only)
    tracing::info!("Starting server in REAL mode (connecting to Telegram MTProto API)");
    let service: Arc<dyn TelegramService> = Arc::new(RealTelegramService::new());

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
