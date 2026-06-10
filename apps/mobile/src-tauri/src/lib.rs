use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Start the local Axum server
      let app_handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
        if let Ok(app_data_dir) = app_handle.path().app_data_dir() {
          let _ = std::fs::create_dir_all(&app_data_dir);
          std::env::set_var("TELEGRAMONIC_DATA_DIR", app_data_dir.to_string_lossy().into_owned());
        }

        let addr: std::net::SocketAddr = "127.0.0.1:50065".parse().unwrap();
        if let Err(e) = telegramonic_server::run_server(addr).await {
          log::error!("Failed to start local Axum server: {:?}", e);
        }
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
