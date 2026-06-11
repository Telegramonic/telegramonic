#[cfg(test)]
mod tests {
    use super::super::{get_json, post_json, send_request, setup_app_logged_in};
    use axum::{
        body::Body,
        http::{Request, StatusCode},
    };
    use serde_json::{json, Value};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_drives_and_stats() {
        let app = setup_app_logged_in();

        // 1. Get Drives (/drive/list)
        let (status_drives, body_drives) = get_json(app.clone(), "/drive/list").await;
        assert_eq!(status_drives, StatusCode::OK);
        assert!(body_drives.is_array());
        assert_eq!(body_drives.as_array().unwrap().len(), 2);

        // 2. Get Stats (/drive/stats)
        let (status_stats, body_stats) = get_json(app.clone(), "/drive/stats").await;
        assert_eq!(status_stats, StatusCode::OK);
        assert!(body_stats["total_space"].is_number());
        assert!(body_stats["used_space"].is_number());
        assert!(body_stats["file_count"].is_number());
    }

    #[tokio::test]
    async fn test_folders_lifecycle() {
        let app = setup_app_logged_in();

        // 1. List initial folders (parent_id = None)
        let (status_folders, body_folders) = get_json(app.clone(), "/drive/folders").await;
        assert_eq!(status_folders, StatusCode::OK);
        assert!(body_folders.is_array());
        let initial_len = body_folders.as_array().unwrap().len();

        // 2. Create Folder
        let payload_create = json!({
            "name": "TestFolder",
            "parent_id": null
        });
        let (status_create, body_create) =
            post_json(app.clone(), "/drive/folders/create", payload_create).await;
        assert_eq!(status_create, StatusCode::OK);
        assert_eq!(body_create["name"], "TestFolder");
        let created_id = body_create["id"].as_str().unwrap();

        // Verify folder count increased
        let (_, body_folders_new) = get_json(app.clone(), "/drive/folders").await;
        assert_eq!(body_folders_new.as_array().unwrap().len(), initial_len + 1);

        // 3. Delete Folder
        let (status_delete, body_delete) = post_json(
            app.clone(),
            "/drive/folders/delete",
            json!({ "id": created_id }),
        )
        .await;
        assert_eq!(status_delete, StatusCode::OK);
        assert_eq!(body_delete["success"], true);

        // Verify folder count restored
        let (_, body_folders_final) = get_json(app.clone(), "/drive/folders").await;
        assert_eq!(body_folders_final.as_array().unwrap().len(), initial_len);
    }

    #[tokio::test]
    async fn test_files_lifecycle() {
        let app = setup_app_logged_in();

        // 1. List initial files
        let (status_files, body_files) = get_json(app.clone(), "/drive/files").await;
        assert_eq!(status_files, StatusCode::OK);
        assert!(body_files.is_array());
        let initial_files_len = body_files.as_array().unwrap().len();

        // 2. Upload part
        let file_id = 9999i64;
        let part_data = b"Hello from chunk data".to_vec();
        let uri_upload = format!(
            "/files/upload-part?file_id={}&part_index=0&file_size=21&total_parts=1",
            file_id
        );

        let req = Request::builder()
            .method("POST")
            .uri(uri_upload)
            .header("content-type", "application/octet-stream")
            .body(Body::from(part_data))
            .unwrap();

        let res = app.clone().oneshot(req).await.unwrap();
        assert_eq!(res.status(), StatusCode::OK);
        let res_bytes = axum::body::to_bytes(res.into_body(), 1024 * 1024)
            .await
            .unwrap();
        let res_json: Value = serde_json::from_slice(&res_bytes).unwrap();
        assert_eq!(res_json["success"], true);

        // 3. Save File
        let payload_save = json!({
            "file_id": file_id,
            "name": "saved_test_file.txt",
            "size": 21i64,
            "folder_id": null
        });
        let (status_save, body_save) =
            post_json(app.clone(), "/files/save-file", payload_save).await;
        assert_eq!(status_save, StatusCode::OK);
        assert_eq!(body_save["id"], file_id.to_string());
        assert_eq!(body_save["name"], "saved_test_file.txt");
        assert_eq!(body_save["icon_type"], "file");

        // Verify file count increased
        let (_, body_files_new) = get_json(app.clone(), "/drive/files").await;
        assert_eq!(
            body_files_new.as_array().unwrap().len(),
            initial_files_len + 1
        );

        // 4. Download/Get File
        let (status_dl, dl_bytes) = send_request(
            app.clone(),
            "GET",
            &format!("/files/download?file_id={}", file_id),
            Body::empty(),
        )
        .await;
        assert_eq!(status_dl, StatusCode::OK);
        assert_eq!(dl_bytes.to_vec(), b"Hello from chunk data".to_vec());

        // 5. Delete File
        let payload_delete = json!({
            "id": file_id
        });
        let (status_delete, body_delete) =
            post_json(app.clone(), "/files/delete", payload_delete).await;
        assert_eq!(status_delete, StatusCode::OK);
        assert_eq!(body_delete["success"], true);

        // Verify file count decreased
        let (_, body_files_final) = get_json(app.clone(), "/drive/files").await;
        assert_eq!(
            body_files_final.as_array().unwrap().len(),
            initial_files_len
        );
    }
}
