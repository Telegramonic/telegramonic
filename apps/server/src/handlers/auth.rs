use crate::services::DynTelegramService;
use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct SendCodePayload {
    pub phone: String,
    pub api_id: String,
    pub api_hash: String,
}

#[derive(Debug, Deserialize)]
pub struct SignInPayload {
    pub phone: String,
    pub phone_code_hash: Option<String>,
    pub code: String,
}

#[derive(Debug, Deserialize)]
pub struct CheckPasswordPayload {
    pub password: String,
}

pub async fn get_auth_state(State(service): State<DynTelegramService>) -> impl IntoResponse {
    let state = service.get_auth_state().await;
    Json(state)
}

pub async fn send_code(
    State(service): State<DynTelegramService>,
    Json(payload): Json<SendCodePayload>,
) -> impl IntoResponse {
    // Parse api_id as integer
    let api_id_parsed = match payload.api_id.parse::<i32>() {
        Ok(val) => val,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(serde_json::json!({
                    "success": false,
                    "error": "Invalid API ID format. Must be a valid integer."
                })),
            )
                .into_response();
        }
    };

    match service
        .send_code(&payload.phone, api_id_parsed, &payload.api_hash)
        .await
    {
        Ok(result) => (StatusCode::OK, Json(result)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "success": false, "error": err })),
        )
            .into_response(),
    }
}

pub async fn sign_in(
    State(service): State<DynTelegramService>,
    Json(payload): Json<SignInPayload>,
) -> impl IntoResponse {
    let hash = payload.phone_code_hash.unwrap_or_default();
    match service.sign_in(&payload.phone, &hash, &payload.code).await {
        Ok(result) => (StatusCode::OK, Json(result)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "success": false, "error": err })),
        )
            .into_response(),
    }
}

pub async fn check_password(
    State(service): State<DynTelegramService>,
    Json(payload): Json<CheckPasswordPayload>,
) -> impl IntoResponse {
    match service.check_password(&payload.password).await {
        Ok(result) => (StatusCode::OK, Json(result)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "success": false, "error": err })),
        )
            .into_response(),
    }
}

pub async fn log_out(State(service): State<DynTelegramService>) -> impl IntoResponse {
    match service.log_out().await {
        Ok(success) => (
            StatusCode::OK,
            Json(serde_json::json!({ "success": success })),
        )
            .into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "success": false, "error": err })),
        )
            .into_response(),
    }
}

pub async fn reset_authorization(State(service): State<DynTelegramService>) -> impl IntoResponse {
    match service.reset_authorization().await {
        Ok(success) => (
            StatusCode::OK,
            Json(serde_json::json!({ "success": success })),
        )
            .into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "success": false, "error": err })),
        )
            .into_response(),
    }
}

#[derive(Debug, Deserialize)]
pub struct UpdateCredentialsPayload {
    pub api_id: String,
    pub api_hash: String,
}

pub async fn update_credentials(
    State(service): State<DynTelegramService>,
    Json(payload): Json<UpdateCredentialsPayload>,
) -> impl IntoResponse {
    let api_id_parsed = match payload.api_id.parse::<i32>() {
        Ok(val) => val,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(serde_json::json!({
                    "success": false,
                    "error": "Invalid API ID format. Must be a valid integer."
                })),
            )
                .into_response();
        }
    };

    match service
        .update_credentials(api_id_parsed, &payload.api_hash)
        .await
    {
        Ok(success) => (
            StatusCode::OK,
            Json(serde_json::json!({ "success": success })),
        )
            .into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "success": false, "error": err })),
        )
            .into_response(),
    }
}
