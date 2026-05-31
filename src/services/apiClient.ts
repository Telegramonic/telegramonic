import { TELEGRAM_API_ROUTES } from './const';
import { AuthState, AuthResult, FileMetadata, FolderMetadata, DriveStats, Drive } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080';

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
    throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  // Auth API
  getAuthState: () => request<AuthState>('/auth/state'),
  
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
    return request<FolderMetadata[]>(`${TELEGRAM_API_ROUTES.DRIVE.GET_FOLDERS}${query}`);
  },

  getFiles: (folderId?: number, q?: string) => {
    const params = new URLSearchParams();
    if (folderId !== undefined && folderId !== null) params.append('folder_id', folderId.toString());
    if (q) params.append('q', q);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<FileMetadata[]>(`${TELEGRAM_API_ROUTES.DRIVE.GET_FILES}${query}`);
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
};
export type ApiClient = typeof apiClient;
