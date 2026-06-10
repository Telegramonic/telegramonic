pub mod config;
pub mod handlers;
pub mod services;

use std::net::SocketAddr;
use std::sync::Arc;
use handlers::create_router;
use services::{telegram::RealTelegramService, TelegramService};

pub async fn run_server(addr: SocketAddr) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Initialize Telegram Client service (Real mode only)
    tracing::info!("Starting server in REAL mode (connecting to Telegram MTProto API)");
    let service: Arc<dyn TelegramService> = Arc::new(RealTelegramService::new());

    // Create Axum Router
    let app = create_router(service);

    tracing::info!("Telegramonic Rust backend server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await?;

    axum::serve(listener, app)
        .await?;

    Ok(())
}
