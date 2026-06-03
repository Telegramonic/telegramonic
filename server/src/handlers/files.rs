use crate::services::DynTelegramService;
use axum::{
    body::Bytes,
    extract::{Query, State},
    http::{header, HeaderMap, StatusCode},
    response::IntoResponse,
    Json,
};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct UploadPartQuery {
    pub file_id: i64,
    pub part_index: i32,
}

#[derive(Debug, Deserialize)]
pub struct SaveFilePayload {
    pub file_id: i64,
    pub name: String,
    pub size: i64,
    pub folder_id: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct FileDownloadQuery {
    pub file_id: i64,
}

#[derive(Debug, Deserialize)]
pub struct DriveFilesQuery {
    pub folder_id: Option<i64>,
    pub q: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct DriveFoldersQuery {
    pub parent_id: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct CreateFolderPayload {
    pub name: String,
    pub parent_id: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct DeleteFolderPayload {
    pub id: i64,
}

pub async fn upload_part(
    State(service): State<DynTelegramService>,
    Query(query): Query<UploadPartQuery>,
    body: Bytes,
) -> impl IntoResponse {
    match service
        .upload_part(query.file_id, query.part_index, body.to_vec())
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

pub async fn save_file(
    State(service): State<DynTelegramService>,
    Json(payload): Json<SaveFilePayload>,
) -> impl IntoResponse {
    match service
        .save_file(
            payload.file_id,
            &payload.name,
            payload.size,
            payload.folder_id,
        )
        .await
    {
        Ok(file) => (StatusCode::OK, Json(file)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn download_file(
    State(service): State<DynTelegramService>,
    Query(query): Query<FileDownloadQuery>,
) -> impl IntoResponse {
    match service.download_file(query.file_id).await {
        Ok(bytes) => {
            let mut headers = HeaderMap::new();
            headers.insert(
                header::CONTENT_TYPE,
                "application/octet-stream".parse().unwrap(),
            );
            headers.insert(
                header::CONTENT_DISPOSITION,
                format!("attachment; filename=\"file_{}\"", query.file_id)
                    .parse()
                    .unwrap(),
            );
            (StatusCode::OK, headers, bytes).into_response()
        }
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn get_drives(State(service): State<DynTelegramService>) -> impl IntoResponse {
    match service.get_drives().await {
        Ok(drives) => (StatusCode::OK, Json(drives)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn get_stats(State(service): State<DynTelegramService>) -> impl IntoResponse {
    match service.get_stats().await {
        Ok(stats) => (StatusCode::OK, Json(stats)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn get_folders(
    State(service): State<DynTelegramService>,
    Query(query): Query<DriveFoldersQuery>,
) -> impl IntoResponse {
    match service.get_folders(query.parent_id).await {
        Ok(folders) => (StatusCode::OK, Json(folders)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn get_files(
    State(service): State<DynTelegramService>,
    Query(query): Query<DriveFilesQuery>,
) -> impl IntoResponse {
    match service.get_files(query.folder_id, query.q.as_deref()).await {
        Ok(files) => (StatusCode::OK, Json(files)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn create_folder(
    State(service): State<DynTelegramService>,
    Json(payload): Json<CreateFolderPayload>,
) -> impl IntoResponse {
    match service
        .create_folder(&payload.name, payload.parent_id)
        .await
    {
        Ok(folder) => (StatusCode::OK, Json(folder)).into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn delete_folder(
    State(service): State<DynTelegramService>,
    Json(payload): Json<DeleteFolderPayload>,
) -> impl IntoResponse {
    match service.delete_folder(payload.id).await {
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
