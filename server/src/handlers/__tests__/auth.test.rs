#[cfg(test)]
mod tests {
    use super::super::{get_json, post_json, setup_app};
    use axum::http::StatusCode;
    use serde_json::json;

    #[tokio::test]
    async fn test_auth_flow() {
        let app = setup_app();

        // 1. Initial State: LoggedOut
        let (status, state) = get_json(app.clone(), "/auth/state").await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(state["status"], "LoggedOut");

        // 2. Send Code: Invalid API ID format
        let payload_bad_api_id = json!({
            "phone": "+15551234567",
            "api_id": "not_an_int",
            "api_hash": "abc123def456"
        });
        let (status_bad, body_bad) =
            post_json(app.clone(), "/auth/send-code", payload_bad_api_id).await;
        assert_eq!(status_bad, StatusCode::BAD_REQUEST);
        assert_eq!(body_bad["success"], false);
        assert!(body_bad["error"]
            .as_str()
            .unwrap()
            .contains("Invalid API ID"));

        // 3. Send Code: Happy Path
        let payload_send_code = json!({
            "phone": "+15551234567",
            "api_id": "12345",
            "api_hash": "abc123def456"
        });
        let (status_code, body_code) =
            post_json(app.clone(), "/auth/send-code", payload_send_code).await;
        assert_eq!(status_code, StatusCode::OK);
        assert_eq!(body_code["success"], true);
        assert_eq!(body_code["next_step"], "code");

        // State check after send-code
        let (_, state_after_code) = get_json(app.clone(), "/auth/state").await;
        assert_eq!(state_after_code["status"], "AwaitingCode");
        assert_eq!(state_after_code["data"]["phone"], "+15551234567");

        // 4. Sign In: Invalid Code
        let payload_sign_in_invalid = json!({
            "phone": "+15551234567",
            "phone_code_hash": "mock_hash_xyz123",
            "code": "00000"
        });
        let (status_sign_in_bad, body_sign_in_bad) =
            post_json(app.clone(), "/auth/sign-in", payload_sign_in_invalid).await;
        assert_eq!(status_sign_in_bad, StatusCode::OK);
        assert_eq!(body_sign_in_bad["success"], false);
        assert_eq!(body_sign_in_bad["next_step"], "code");
        assert!(body_sign_in_bad["error"].is_string());

        // 5. Sign In: Valid Code (12345)
        let payload_sign_in_valid = json!({
            "phone": "+15551234567",
            "phone_code_hash": "mock_hash_xyz123",
            "code": "12345"
        });
        let (status_sign_in_ok, body_sign_in_ok) =
            post_json(app.clone(), "/auth/sign-in", payload_sign_in_valid).await;
        assert_eq!(status_sign_in_ok, StatusCode::OK);
        assert_eq!(body_sign_in_ok["success"], true);
        assert_eq!(body_sign_in_ok["next_step"], "dashboard");

        // State check after sign-in
        let (_, state_after_signin) = get_json(app.clone(), "/auth/state").await;
        assert_eq!(state_after_signin["status"], "LoggedIn");

        // 6. Log Out
        let (status_logout, body_logout) = post_json(app.clone(), "/auth/log-out", json!({})).await;
        assert_eq!(status_logout, StatusCode::OK);
        assert_eq!(body_logout["success"], true);

        // State check after log-out
        let (_, state_after_logout) = get_json(app.clone(), "/auth/state").await;
        assert_eq!(state_after_logout["status"], "LoggedOut");
    }

    #[tokio::test]
    async fn test_sign_up_and_reset_auth() {
        let app = setup_app();

        // 1. Sign Up (should map to sign-in handler and work similarly)
        let payload_send_code = json!({
            "phone": "+15559876543",
            "api_id": "99999",
            "api_hash": "xyz987"
        });
        post_json(app.clone(), "/auth/send-code", payload_send_code).await;

        let payload_signup = json!({
            "phone": "+15559876543",
            "phone_code_hash": "mock_hash_xyz123",
            "code": "11111"
        });
        let (status_signup, body_signup) =
            post_json(app.clone(), "/auth/sign-up", payload_signup).await;
        assert_eq!(status_signup, StatusCode::OK);
        assert_eq!(body_signup["success"], true);
        assert_eq!(body_signup["next_step"], "dashboard");

        // 2. Reset authorization mid-flow (let's trigger reset)
        let (status_reset, body_reset) =
            post_json(app.clone(), "/auth/reset-authorization", json!({})).await;
        assert_eq!(status_reset, StatusCode::OK);
        assert_eq!(body_reset["success"], true);

        let (_, state_after_reset) = get_json(app.clone(), "/auth/state").await;
        assert_eq!(state_after_reset["status"], "LoggedOut");
    }

    #[tokio::test]
    async fn test_2fa_authentication() {
        let app = setup_app();

        // Send code
        let payload_send_code = json!({
            "phone": "+15551234567",
            "api_id": "12345",
            "api_hash": "abc123def456"
        });
        post_json(app.clone(), "/auth/send-code", payload_send_code).await;

        // Sign in with 2FA code ("2fa" or "22222")
        let payload_2fa_code = json!({
            "phone": "+15551234567",
            "phone_code_hash": "mock_hash_xyz123",
            "code": "2fa"
        });
        let (status_2fa_code, body_2fa_code) =
            post_json(app.clone(), "/auth/sign-in", payload_2fa_code).await;
        assert_eq!(status_2fa_code, StatusCode::OK);
        assert_eq!(body_2fa_code["success"], true);
        assert_eq!(body_2fa_code["next_step"], "password");

        // Check state is AwaitingPassword
        let (_, state_2fa) = get_json(app.clone(), "/auth/state").await;
        assert_eq!(state_2fa["status"], "AwaitingPassword");

        // Check password: bad password
        let (status_pw_bad, body_pw_bad) = post_json(
            app.clone(),
            "/auth/check-password",
            json!({ "password": "wrongpassword" }),
        )
        .await;
        assert_eq!(status_pw_bad, StatusCode::OK);
        assert_eq!(body_pw_bad["success"], false);
        assert_eq!(body_pw_bad["next_step"], "password");
        assert!(body_pw_bad["error"].is_string());

        // Check password: correct password
        let (status_pw_ok, body_pw_ok) = post_json(
            app.clone(),
            "/auth/check-password",
            json!({ "password": "password" }),
        )
        .await;
        assert_eq!(status_pw_ok, StatusCode::OK);
        assert_eq!(body_pw_ok["success"], true);
        assert_eq!(body_pw_ok["next_step"], "dashboard");

        // Final state: LoggedIn
        let (_, state_logged_in) = get_json(app.clone(), "/auth/state").await;
        assert_eq!(state_logged_in["status"], "LoggedIn");
    }

    #[tokio::test]
    async fn test_unauthorized_endpoints() {
        let app = setup_app(); // Starts LoggedOut by default

        // Query protected endpoint
        let (status, body) = get_json(app.clone(), "/users/me").await;
        assert_eq!(status, StatusCode::UNAUTHORIZED);
        assert_eq!(body["error"], "Unauthorized. Please log in first.");
    }
}
