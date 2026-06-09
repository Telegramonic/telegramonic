/**
 * Telegram HTTP API routes mapping MTProto namespaces to HTTP endpoints.
 * These endpoints are utilized by the HTTP client to bridge requests to the MTProto backend.
 */
export const TELEGRAM_API_ROUTES = {
  AUTH: {
    SEND_CODE: '/auth/send-code',
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    CHECK_PASSWORD: '/auth/check-password',
    LOG_OUT: '/auth/log-out',
    RESET_AUTHORIZATION: '/auth/reset-authorization',
  },
  USERS: {
    GET_ME: '/users/me',
    GET_USERS: '/users/get-users',
    GET_FULL_USER: '/users/get-full-user',
  },
  ACCOUNT: {
    UPDATE_PROFILE: '/account/update-profile',
    UPDATE_STATUS: '/account/update-status',
    UPDATE_USERNAME: '/account/update-username',
    GET_PASSWORD: '/account/get-password',
  },
  CONTACTS: {
    GET_CONTACTS: '/contacts/get-contacts',
    SEARCH: '/contacts/search',
    IMPORT_CONTACTS: '/contacts/import-contacts',
  },

  FILES: {
    UPLOAD_STREAM: '/files/upload-stream',
    GET_FILE: '/files/get-file',
    DOWNLOAD: '/files/download',
    DELETE: '/files/delete',
    SAVE_FILE: '/files/save-file',
    UPLOAD_PART: '/files/upload-part',
    UPLOAD_PROGRESS: '/files/upload-progress',
    UPLOAD_PROGRESS_STREAM: '/files/upload-progress/stream',
  },
  DRIVE: {
    GET_DRIVES: '/drive/list',
    GET_STATS: '/drive/stats',
    GET_FOLDERS: '/drive/folders',
    GET_FILES: '/drive/files',
    CREATE_FOLDER: '/drive/folders/create',
    DELETE_FOLDER: '/drive/folders/delete',
  },
} as const;

export type TelegramApiRoutes = typeof TELEGRAM_API_ROUTES;
