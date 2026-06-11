# Generating Telegram API ID and API Hash

To connect Telegramonic to your custom Telegram API instance, you need to obtain your unique `api_id` and `api_hash` credentials from Telegram. Follow the step-by-step instructions below.

## Steps to Obtain Telegram API Credentials

1. **Log in to Telegram Core Applications Portal**:

   - Go to [my.telegram.org](https://my.telegram.org/).
   - Enter your phone number in international format (e.g., `+1234567890`) associated with your Telegram account.
   - Click **Next**.
   - You will receive a confirmation code via the official Telegram application. Paste this code into the **Confirmation code** box on the webpage and click **Sign In**.

2. **Access API Development Tools**:

   - Once logged in, select the **API development tools** option.

3. **Register Your Application**:

   - If this is your first time, a **Create new application** form will be displayed.
   - Fill in the required fields:
     - **App title**: Enter a name for your application (e.g., `Telegramonic App`).
     - **Short name**: Enter a short identifier (e.g., `telegramonic`).
     - **URL**: You can leave this blank or input a local address like `http://localhost`.
     - **Platform**: Choose your platform (e.g., `Desktop` or `Web`).
     - **Description**: Add a brief description (e.g., `Telegramonic private file manager`).
   - Click **Create application**.

4. **Copy Your Credentials**:
   - After creation, you will see a screen showing your **App configuration**:
     - **App api_id**: A numeric value (e.g., `1234567`).
     - **App api_hash**: An alphanumeric string (e.g., `0123456789abcdef0123456789abcdef`).
   - Copy these two values. Do not share them; they are secret keys associated with your Telegram account.

## Using the Credentials in Telegramonic

During the login process of Telegramonic:

1. Paste your **API ID** and **API Hash** into the corresponding credential fields.
2. Complete authentication via your Telegram account's OTP / Two-Factor Authentication (2FA) if enabled.

> [!WARNING]
> Keep your **API Hash** completely secure. Anyone with access to your `api_id` and `api_hash` can authenticate and interface as your user client.
