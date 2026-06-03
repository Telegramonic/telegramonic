use crate::services::DynTelegramService;
use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct UserQuery {
    pub id: i64,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProfilePayload {
    pub first_name: String,
    pub last_name: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateStatusPayload {
    pub offline: bool,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUsernamePayload {
    pub username: String,
}

pub async fn get_me(State(service): State<DynTelegramService>) -> impl IntoResponse {
    match service.get_me().await {
        Ok(user) => (StatusCode::OK, Json(user)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn get_users(State(service): State<DynTelegramService>) -> impl IntoResponse {
    match service.get_users().await {
        Ok(users) => (StatusCode::OK, Json(users)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn get_full_user(
    State(service): State<DynTelegramService>,
    Query(query): Query<UserQuery>,
) -> impl IntoResponse {
    match service.get_full_user(query.id).await {
        Ok(user) => (StatusCode::OK, Json(user)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn update_profile(
    State(service): State<DynTelegramService>,
    Json(payload): Json<UpdateProfilePayload>,
) -> impl IntoResponse {
    match service
        .update_profile(&payload.first_name, payload.last_name.as_deref())
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

pub async fn update_status(
    State(service): State<DynTelegramService>,
    Json(payload): Json<UpdateStatusPayload>,
) -> impl IntoResponse {
    match service.update_status(payload.offline).await {
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

pub async fn update_username(
    State(service): State<DynTelegramService>,
    Json(payload): Json<UpdateUsernamePayload>,
) -> impl IntoResponse {
    match service.update_username(&payload.username).await {
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

pub async fn get_password_settings() -> impl IntoResponse {
    // Stubbed response for 2FA settings info
    Json(serde_json::json!({
        "has_password": true,
        "hint": "Default development password hint"
    }))
}
