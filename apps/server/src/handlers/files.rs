use crate::services::{
    deserialize_i64_from_string_or_number, serde_option_i64_string, DynTelegramService,
};
use axum::{
    body::Bytes,
    extract::{Query, State},
    http::{header, HeaderMap, StatusCode},
    response::{
        sse::{Event, Sse},
        IntoResponse,
    },
    Json,
};
use futures_util::stream::Stream;
use serde::Deserialize;
use std::convert::Infallible;

#[derive(Debug, Deserialize)]
pub struct UploadPartQuery {
    #[serde(deserialize_with = "deserialize_i64_from_string_or_number")]
    pub file_id: i64,
    pub part_index: i32,
    pub file_size: i64,
    pub total_parts: i32,
    #[serde(default)]
    pub byte_offset: i64,
}

#[derive(Debug, Deserialize)]
pub struct SaveFilePayload {
    #[serde(deserialize_with = "deserialize_i64_from_string_or_number")]
    pub file_id: i64,
    pub name: String,
    pub size: i64,
    #[serde(default, deserialize_with = "serde_option_i64_string::deserialize")]
    pub folder_id: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct FileDownloadQuery {
    #[serde(deserialize_with = "deserialize_i64_from_string_or_number")]
    pub file_id: i64,
}

#[derive(Debug, Deserialize)]
pub struct DriveFilesQuery {
    #[serde(default, deserialize_with = "serde_option_i64_string::deserialize")]
    pub folder_id: Option<i64>,
    pub q: Option<String>,
    pub all: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct DriveFoldersQuery {
    #[serde(default, deserialize_with = "serde_option_i64_string::deserialize")]
    pub parent_id: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct CreateFolderPayload {
    pub name: String,
    #[serde(default, deserialize_with = "serde_option_i64_string::deserialize")]
    pub parent_id: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct DeleteFolderPayload {
    #[serde(deserialize_with = "deserialize_i64_from_string_or_number")]
    pub id: i64,
}

#[derive(Debug, Deserialize)]
pub struct DeleteFilePayload {
    #[serde(deserialize_with = "deserialize_i64_from_string_or_number")]
    pub id: i64,
}

pub async fn upload_part(
    State(service): State<DynTelegramService>,
    Query(query): Query<UploadPartQuery>,
    body: Bytes,
) -> impl IntoResponse {
    match service
        .upload_part(
            query.file_id,
            query.part_index,
            query.file_size,
            query.total_parts,
            query.byte_offset,
            body.to_vec(),
        )
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
    match service
        .get_files(query.folder_id, query.q.as_deref(), query.all)
        .await
    {
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

pub async fn delete_file(
    State(service): State<DynTelegramService>,
    Json(payload): Json<DeleteFilePayload>,
) -> impl IntoResponse {
    match service.delete_file(payload.id).await {
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
pub struct UploadProgressQuery {
    #[serde(deserialize_with = "deserialize_i64_from_string_or_number")]
    pub file_id: i64,
}

pub async fn get_upload_progress(
    State(service): State<DynTelegramService>,
    Query(query): Query<UploadProgressQuery>,
) -> impl IntoResponse {
    match service.get_upload_progress(query.file_id).await {
        Ok(percent) => (
            StatusCode::OK,
            Json(serde_json::json!({ "progress": percent })),
        )
            .into_response(),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": err })),
        )
            .into_response(),
    }
}

pub async fn get_upload_progress_stream(
    State(service): State<DynTelegramService>,
    Query(query): Query<UploadProgressQuery>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let file_id = query.file_id;
    let stream = futures_util::stream::unfold(
        (service.clone(), file_id, -1, false),
        |(service, file_id, mut last_percent, mut finished)| async move {
            if finished {
                return None;
            }
            loop {
                let percent = match service.get_upload_progress(file_id).await {
                    Ok(p) => p,
                    Err(_) => 0,
                };
                if percent != last_percent {
                    last_percent = percent;
                    let event = Event::default().data(percent.to_string());
                    if percent >= 100 {
                        finished = true;
                    }
                    return Some((
                        Ok::<Event, Infallible>(event),
                        (service, file_id, last_percent, finished),
                    ));
                }
                tokio::time::sleep(std::time::Duration::from_millis(50)).await;
            }
        },
    );

    Sse::new(stream).keep_alive(
        axum::response::sse::KeepAlive::new()
            .interval(std::time::Duration::from_secs(1))
            .text("keep-alive-text"),
    )
}
