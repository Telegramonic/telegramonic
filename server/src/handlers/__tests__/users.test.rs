#[cfg(test)]
mod tests {
    use super::super::{get_json, post_json, setup_app_logged_in};
    use axum::http::StatusCode;
    use serde_json::json;

    #[tokio::test]
    async fn test_users_endpoints() {
        let app = setup_app_logged_in();

        // 1. Get Me (/users/me)
        let (status_me, body_me) = get_json(app.clone(), "/users/me").await;
        assert_eq!(status_me, StatusCode::OK);
        assert_eq!(body_me["id"], "123456789");
        assert_eq!(body_me["first_name"], "Mock");
        assert_eq!(body_me["username"], "mock_telegram_user");

        // 2. Get Users (/users/get-users)
        let (status_users, body_users) = get_json(app.clone(), "/users/get-users").await;
        assert_eq!(status_users, StatusCode::OK);
        assert!(body_users.is_array());
        let users_arr = body_users.as_array().unwrap();
        assert_eq!(users_arr.len(), 2);
        assert_eq!(users_arr[0]["id"], "123456789");
        assert_eq!(users_arr[1]["id"], "987654321");

        // 3. Get Full User (/users/get-full-user?id=123456789)
        let (status_full1, body_full1) =
            get_json(app.clone(), "/users/get-full-user?id=123456789").await;
        assert_eq!(status_full1, StatusCode::OK);
        assert_eq!(body_full1["id"], "123456789");

        let (status_full2, body_full2) = get_json(app.clone(), "/users/get-full-user?id=999").await;
        assert_eq!(status_full2, StatusCode::OK);
        assert_eq!(body_full2["id"], "999");
        assert_eq!(body_full2["first_name"], "External");
    }

    #[tokio::test]
    async fn test_account_endpoints() {
        let app = setup_app_logged_in();

        // 1. Update Profile (/account/update-profile)
        let payload_profile = json!({
            "first_name": "NewFirstName",
            "last_name": "NewLastName"
        });
        let (status_prof, body_prof) =
            post_json(app.clone(), "/account/update-profile", payload_profile).await;
        assert_eq!(status_prof, StatusCode::OK);
        assert_eq!(body_prof["success"], true);

        // 2. Update Status (/account/update-status)
        let (status_stat, body_stat) = post_json(
            app.clone(),
            "/account/update-status",
            json!({ "offline": true }),
        )
        .await;
        assert_eq!(status_stat, StatusCode::OK);
        assert_eq!(body_stat["success"], true);

        // 3. Update Username (/account/update-username)
        let (status_user, body_user) = post_json(
            app.clone(),
            "/account/update-username",
            json!({ "username": "new_username" }),
        )
        .await;
        assert_eq!(status_user, StatusCode::OK);
        assert_eq!(body_user["success"], true);

        // 4. Get Password settings (/account/get-password)
        let (status_pw, body_pw) = get_json(app.clone(), "/account/get-password").await;
        assert_eq!(status_pw, StatusCode::OK);
        assert_eq!(body_pw["has_password"], true);
    }
}
