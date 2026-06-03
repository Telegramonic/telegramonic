#[path = "auth.test.rs"]
mod auth_test;

#[path = "files.test.rs"]
mod files_test;

#[path = "users.test.rs"]
mod users_test;

mod mock_service;

// Common test helper imports
use crate::handlers::create_router;
use axum::{
    body::{Body, Bytes},
    http::{Request, StatusCode},
    Router,
};
use mock_service::MockTelegramService;
use serde_json::Value;
use std::sync::Arc;
use tower::ServiceExt; // for oneshot

// Helper function to create the test router
fn setup_app() -> Router {
    let service = Arc::new(MockTelegramService::new());
    create_router(service)
}

// Helper function to create the test router in logged in state
fn setup_app_logged_in() -> Router {
    let service = Arc::new(MockTelegramService::new_logged_in());
    create_router(service)
}

// Helper to send a general request to the router
async fn send_request(app: Router, method: &str, uri: &str, body: Body) -> (StatusCode, Bytes) {
    let req = Request::builder()
        .method(method)
        .uri(uri)
        .header("content-type", "application/json")
        .body(body)
        .unwrap();

    let res = app.oneshot(req).await.unwrap();
    let status = res.status();
    let body_bytes = axum::body::to_bytes(res.into_body(), 1024 * 1024)
        .await
        .unwrap();
    (status, body_bytes)
}

// Helper to send a POST request with JSON payload
async fn post_json(app: Router, uri: &str, payload: Value) -> (StatusCode, Value) {
    let body = Body::from(payload.to_string());
    let (status, bytes) = send_request(app, "POST", uri, body).await;
    let json_val: Value = serde_json::from_slice(&bytes).unwrap_or(Value::Null);
    (status, json_val)
}

// Helper to send a GET request
async fn get_json(app: Router, uri: &str) -> (StatusCode, Value) {
    let (status, bytes) = send_request(app, "GET", uri, Body::empty()).await;
    let json_val: Value = serde_json::from_slice(&bytes).unwrap_or(Value::Null);
    (status, json_val)
}
