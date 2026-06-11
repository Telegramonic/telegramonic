use std::net::SocketAddr;
use telegramonic_server::{config::AppConfig, run_server};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

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

    let addr_str = format!("{}:{}", config.host, config.port);
    let addr: SocketAddr = addr_str.parse().expect("Failed to parse socket address");

    if let Err(err) = run_server(addr).await {
        tracing::error!("Server error: {}", err);
        std::process::exit(1);
    }
}
