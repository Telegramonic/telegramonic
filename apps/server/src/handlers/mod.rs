use crate::services::{AuthState, DynTelegramService};
use axum::{
    extract::{Request, State},
    http::StatusCode,
    middleware::Next,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use tower_http::cors::{Any, CorsLayer};

pub mod auth;
pub mod files;
pub mod users;

#[cfg(test)]
mod __tests__;

async fn require_login(
    State(service): State<DynTelegramService>,
    request: Request,
    next: Next,
) -> Result<Response, Response> {
    match service.get_auth_state().await {
        AuthState::LoggedIn => Ok(next.run(request).await),
        _ => Err((
            StatusCode::UNAUTHORIZED,
            Json(serde_json::json!({
                "error": "Unauthorized. Please log in first."
            })),
        )
            .into_response()),
    }
}

async fn health_check() -> impl IntoResponse {
    (StatusCode::OK, Json(serde_json::json!({ "status": "ok" })))
}

pub fn create_router(service: DynTelegramService) -> Router {
    // Setup CORS layer allowing local development requests
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Protected routes requiring authorization
    let protected_routes = Router::new()
        .route("/auth/log-out", post(auth::log_out))
        .route("/auth/update-credentials", post(auth::update_credentials))
        // Users namespace
        .route("/users/me", get(users::get_me))
        .route("/users/get-users", get(users::get_users))
        .route("/users/get-full-user", get(users::get_full_user))
        // Account namespace
        .route("/account/update-profile", post(users::update_profile))
        .route("/account/update-status", post(users::update_status))
        .route("/account/update-username", post(users::update_username))
        .route("/account/get-password", get(users::get_password_settings))
        // Contacts namespace (Stubs)
        .route(
            "/contacts/get-contacts",
            get(axum::Json(serde_json::json!([]))),
        )
        .route("/contacts/search", get(axum::Json(serde_json::json!([]))))
        .route(
            "/contacts/import-contacts",
            post(axum::Json(serde_json::json!({ "success": true }))),
        )
        // Files namespace
        .route("/files/upload-part", post(files::upload_part))
        .route("/files/save-file", post(files::save_file))
        .route("/files/upload-progress", get(files::get_upload_progress))
        .route(
            "/files/upload-progress/stream",
            get(files::get_upload_progress_stream),
        )
        .route("/files/download", get(files::download_file))
        .route("/files/get-file", get(files::download_file)) // Map get-file to download handler
        .route("/files/delete", post(files::delete_file))
        // Drive namespace
        .route("/drive/list", get(files::get_drives))
        .route("/drive/stats", get(files::get_stats))
        .route("/drive/folders", get(files::get_folders))
        .route("/drive/files", get(files::get_files))
        .route("/drive/folders/create", post(files::create_folder))
        .route("/drive/folders/delete", post(files::delete_folder))
        .route_layer(axum::middleware::from_fn_with_state(
            service.clone(),
            require_login,
        ));

    Router::new()
        // Health check endpoint
        .route("/health", get(health_check))
        // Public Auth routes
        .route("/auth/state", get(auth::get_auth_state))
        .route("/auth/send-code", post(auth::send_code))
        .route("/auth/sign-in", post(auth::sign_in))
        .route("/auth/sign-up", post(auth::sign_in)) // Map sign-up to same sign-in handler for mock
        .route("/auth/check-password", post(auth::check_password))
        .route("/auth/reset-authorization", post(auth::reset_authorization))
        .merge(protected_routes)
        // Share client service state globally
        .with_state(service)
        .layer(cors)
        .layer(axum::extract::DefaultBodyLimit::max(20 * 1024 * 1024))
}
