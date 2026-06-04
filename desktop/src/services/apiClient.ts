import { TELEGRAM_API_ROUTES } from './const';
import {
  AuthState,
  AuthResult,
  FileMetadata,
  FolderMetadata,
  DriveStats,
  Drive,
  TelegramUser,
} from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:50065';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
}

export const apiClient = {
  // Auth API
  getAuthState: () => request<AuthState>('/auth/state'),

  checkHealth: () => request<{ status: string }>('/health'),

  sendCode: (phone: string, apiId: string, apiHash: string) =>
    request<AuthResult>(TELEGRAM_API_ROUTES.AUTH.SEND_CODE, {
      method: 'POST',
      body: JSON.stringify({ phone, api_id: apiId, api_hash: apiHash }),
    }),

  signIn: (phone: string, code: string, phoneCodeHash?: string) =>
    request<AuthResult>(TELEGRAM_API_ROUTES.AUTH.SIGN_IN, {
      method: 'POST',
      body: JSON.stringify({ phone, code, phone_code_hash: phoneCodeHash }),
    }),

  checkPassword: (password: string) =>
    request<AuthResult>(TELEGRAM_API_ROUTES.AUTH.CHECK_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  logOut: () =>
    request<{ success: boolean }>(TELEGRAM_API_ROUTES.AUTH.LOG_OUT, {
      method: 'POST',
    }),

  // Drive API
  getStats: () => request<DriveStats>(TELEGRAM_API_ROUTES.DRIVE.GET_STATS),

  getDrives: () => request<Drive[]>(TELEGRAM_API_ROUTES.DRIVE.GET_DRIVES),

  getFolders: (parentId?: number) => {
    const query = parentId ? `?parent_id=${parentId}` : '';
    return request<FolderMetadata[]>(
      `${TELEGRAM_API_ROUTES.DRIVE.GET_FOLDERS}${query}`,
    );
  },

  getFiles: (folderId?: number, q?: string) => {
    const params = new URLSearchParams();
    if (folderId !== undefined && folderId !== null)
      params.append('folder_id', folderId.toString());
    if (q) params.append('q', q);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<FileMetadata[]>(
      `${TELEGRAM_API_ROUTES.DRIVE.GET_FILES}${query}`,
    );
  },

  createFolder: (name: string, parentId?: number) =>
    request<FolderMetadata>(TELEGRAM_API_ROUTES.DRIVE.CREATE_FOLDER, {
      method: 'POST',
      body: JSON.stringify({ name, parent_id: parentId }),
    }),

  deleteFolder: (id: number) =>
    request<{ success: boolean }>(TELEGRAM_API_ROUTES.DRIVE.DELETE_FOLDER, {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  // Sign Up & Reset Auth
  signUp: (phone: string, code: string, phoneCodeHash?: string) =>
    request<AuthResult>(TELEGRAM_API_ROUTES.AUTH.SIGN_UP, {
      method: 'POST',
      body: JSON.stringify({ phone, code, phone_code_hash: phoneCodeHash }),
    }),

  resetAuthorization: () =>
    request<{ success: boolean }>(TELEGRAM_API_ROUTES.AUTH.RESET_AUTHORIZATION, {
      method: 'POST',
    }),

  // Users API
  getMe: () => request<TelegramUser>(TELEGRAM_API_ROUTES.USERS.GET_ME),

  getUsers: () => request<TelegramUser[]>(TELEGRAM_API_ROUTES.USERS.GET_USERS),

  getFullUser: (id: number) =>
    request<TelegramUser>(`${TELEGRAM_API_ROUTES.USERS.GET_FULL_USER}?id=${id}`),

  // Account Settings API
  updateProfile: (firstName: string, lastName?: string) =>
    request<{ success: boolean }>(TELEGRAM_API_ROUTES.ACCOUNT.UPDATE_PROFILE, {
      method: 'POST',
      body: JSON.stringify({ first_name: firstName, last_name: lastName }),
    }),

  updateStatus: (offline: boolean) =>
    request<{ success: boolean }>(TELEGRAM_API_ROUTES.ACCOUNT.UPDATE_STATUS, {
      method: 'POST',
      body: JSON.stringify({ offline }),
    }),

  updateUsername: (username: string) =>
    request<{ success: boolean }>(TELEGRAM_API_ROUTES.ACCOUNT.UPDATE_USERNAME, {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  getPassword: () =>
    request<{ has_password: boolean; hint?: string }>(
      TELEGRAM_API_ROUTES.ACCOUNT.GET_PASSWORD,
    ),

  // Contacts API
  getContacts: () =>
    request<TelegramUser[]>(TELEGRAM_API_ROUTES.CONTACTS.GET_CONTACTS),

  searchContacts: (q: string) =>
    request<TelegramUser[]>(`${TELEGRAM_API_ROUTES.CONTACTS.SEARCH}?q=${q}`),

  importContacts: (contacts: any[]) =>
    request<{ success: boolean }>(TELEGRAM_API_ROUTES.CONTACTS.IMPORT_CONTACTS, {
      method: 'POST',
      body: JSON.stringify({ contacts }),
    }),

  // Files API
  uploadPart: (
    fileId: number,
    partIndex: number,
    bytes: ArrayBuffer | Uint8Array | Blob,
  ) => {
    // Binary transfer uses raw body
    return request<{ success: boolean }>(
      `${TELEGRAM_API_ROUTES.FILES.UPLOAD_PART}?file_id=${fileId}&part_index=${partIndex}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: bytes as BodyInit,
      },
    );
  },

  saveFile: (
    fileId: number,
    name: string,
    size: number,
    folderId?: number | null,
  ) =>
    request<FileMetadata>(TELEGRAM_API_ROUTES.FILES.SAVE_FILE, {
      method: 'POST',
      body: JSON.stringify({
        file_id: fileId,
        name,
        size,
        folder_id: folderId,
      }),
    }),

  downloadFile: (fileId: number) =>
    fetch(`${API_BASE_URL}${TELEGRAM_API_ROUTES.FILES.DOWNLOAD}?file_id=${fileId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
        return res.blob();
      }),
};
export type ApiClient = typeof apiClient;
