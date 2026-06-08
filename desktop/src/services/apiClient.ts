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

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:50065';

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
    if (response.status === 401) {
      const { appStore } = await import('@appStore');
      appStore.getState().clearApiCredentials();
      appStore.getState().setAuthError('Session expired. Please log in again.');
    }
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

  getFolders: (parentId?: string) => {
    const query = parentId ? `?parent_id=${parentId}` : '';
    return request<FolderMetadata[]>(
      `${TELEGRAM_API_ROUTES.DRIVE.GET_FOLDERS}${query}`,
    );
  },

  getFiles: (folderId?: string | null, q?: string, all?: boolean) => {
    const params = new URLSearchParams();
    if (folderId !== undefined && folderId !== null && !all)
      params.append('folder_id', folderId);
    if (q) params.append('q', q);
    if (all) params.append('all', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<FileMetadata[]>(
      `${TELEGRAM_API_ROUTES.DRIVE.GET_FILES}${query}`,
    );
  },

  createFolder: (name: string, parentId?: string) =>
    request<FolderMetadata>(TELEGRAM_API_ROUTES.DRIVE.CREATE_FOLDER, {
      method: 'POST',
      body: JSON.stringify({ name, parent_id: parentId }),
    }),

  deleteFolder: (id: string) =>
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
    onProgress?: (loaded: number) => void,
  ) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `${API_BASE_URL}${TELEGRAM_API_ROUTES.FILES.UPLOAD_PART}?file_id=${fileId}&part_index=${partIndex}`;
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(event.loaded);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            resolve(res);
          } catch (e) {
            resolve({ success: true });
          }
        } else {
          reject(new Error(`Upload part failed: status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload part'));
      };

      xhr.send(bytes as any);
    });
  },

  saveFile: (
    fileId: number,
    name: string,
    size: number,
    folderId?: string | null,
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

  deleteFile: (id: number | string) =>
    request<{ success: boolean }>(TELEGRAM_API_ROUTES.FILES.DELETE, {
      method: 'POST',
      body: JSON.stringify({ id }),
    }),

  uploadStream: async (
    file: File,
    folderId: string | null,
    onProgress?: (percent: number) => void,
  ): Promise<FileMetadata> => {
    const fileId = Math.floor(Math.random() * 100000000);
    const chunkSize = 512 * 1024; // 512 KB chunks
    const totalParts = Math.ceil(file.size / chunkSize) || 1;

    for (let partIndex = 0; partIndex < totalParts; partIndex++) {
      const start = partIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(chunk);
      });

      await apiClient.uploadPart(fileId, partIndex, arrayBuffer, (loaded) => {
        if (onProgress) {
          const totalUploadedBytes = partIndex * chunkSize + loaded;
          // Local upload is very fast. Represent it as 0 to 10% of total upload.
          const percent = Math.min(10, Math.round((totalUploadedBytes / file.size) * 10));
          onProgress(percent);
        }
      });
    }

    // Connect to the Server-Sent Events stream for real-time Telegram upload progress
    let eventSource: EventSource | null = null;
    if (onProgress) {
      const sseUrl = `${API_BASE_URL}${TELEGRAM_API_ROUTES.FILES.UPLOAD_PROGRESS_STREAM}?file_id=${fileId}`;
      eventSource = new EventSource(sseUrl);
      eventSource.onmessage = (event) => {
        const percent = parseInt(event.data, 10);
        if (!isNaN(percent)) {
          // Scale Telegram upload progress (0-100) to map from 10% to 99% of total progress
          const scaledPercent = Math.min(99, 10 + Math.round(percent * 0.89));
          onProgress(scaledPercent);
        }
      };
      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
        }
      };
    }

    try {
      const result = await apiClient.saveFile(fileId, file.name, file.size, folderId);
      if (eventSource) {
        eventSource.close();
      }
      if (onProgress) {
        onProgress(100);
      }
      return result;
    } catch (error) {
      if (eventSource) {
        eventSource.close();
      }
      throw error;
    }
  },

  downloadFile: (fileId: number | string) =>
    fetch(`${API_BASE_URL}${TELEGRAM_API_ROUTES.FILES.DOWNLOAD}?file_id=${fileId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
        return res.blob();
      }),
};
export type ApiClient = typeof apiClient;
