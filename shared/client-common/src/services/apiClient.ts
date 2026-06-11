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

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://127.0.0.1:50065';

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

  updateCredentials: (apiId: string, apiHash: string) =>
    request<{ success: boolean }>('/auth/update-credentials', {
      method: 'POST',
      body: JSON.stringify({ api_id: apiId, api_hash: apiHash }),
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
    request<{ success: boolean }>(
      TELEGRAM_API_ROUTES.AUTH.RESET_AUTHORIZATION,
      {
        method: 'POST',
      },
    ),

  // Users API
  getMe: () => request<TelegramUser>(TELEGRAM_API_ROUTES.USERS.GET_ME),

  getUsers: () => request<TelegramUser[]>(TELEGRAM_API_ROUTES.USERS.GET_USERS),

  getFullUser: (id: number) =>
    request<TelegramUser>(
      `${TELEGRAM_API_ROUTES.USERS.GET_FULL_USER}?id=${id}`,
    ),

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
    request<{ success: boolean }>(
      TELEGRAM_API_ROUTES.CONTACTS.IMPORT_CONTACTS,
      {
        method: 'POST',
        body: JSON.stringify({ contacts }),
      },
    ),

  // Files API
  uploadPart: (
    fileId: number,
    partIndex: number,
    bytes: ArrayBuffer | Uint8Array | Blob,
    fileSize: number,
    totalParts: number,
    byteOffset: number,
    onProgress?: (loaded: number) => void,
    signal?: AbortSignal,
  ) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      if (signal?.aborted) {
        return reject(new Error('Upload cancelled'));
      }
      const xhr = new XMLHttpRequest();
      const url = `${API_BASE_URL}${TELEGRAM_API_ROUTES.FILES.UPLOAD_PART}?file_id=${fileId}&part_index=${partIndex}&file_size=${fileSize}&total_parts=${totalParts}&byte_offset=${byteOffset}`;
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');

      const onAbort = () => {
        xhr.abort();
        reject(new Error('Upload cancelled'));
      };

      if (signal) {
        signal.addEventListener('abort', onAbort);
      }

      const cleanup = () => {
        if (signal) {
          signal.removeEventListener('abort', onAbort);
        }
      };

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(event.loaded);
          }
        };
      }

      xhr.onload = () => {
        cleanup();
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
        cleanup();
        reject(new Error('Network error during upload part'));
      };

      xhr.onabort = () => {
        cleanup();
        reject(new Error('Upload cancelled'));
      };

      xhr.send(bytes as any);
    });
  },

  saveFile: (
    fileId: number,
    name: string,
    size: number,
    folderId?: string | null,
    signal?: AbortSignal,
  ) =>
    request<FileMetadata>(TELEGRAM_API_ROUTES.FILES.SAVE_FILE, {
      method: 'POST',
      body: JSON.stringify({
        file_id: fileId,
        name,
        size,
        folder_id: folderId,
      }),
      signal,
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
    signal?: AbortSignal,
  ): Promise<FileMetadata> => {
    const fileId = Math.floor(Math.random() * 100000000);
    const chunkSize = 8 * 1024 * 1024; // 8 MB chunks
    const totalParts = Math.ceil(file.size / chunkSize) || 1;
    const concurrencyLimit = 4; // Upload up to 4 parts in parallel

    // ─── Open SSE stream BEFORE uploading any parts ──────────────────────
    // This ensures we receive every incremental tick from the server as
    // parts are acknowledged, covering the full 0→99% window.
    let eventSource: EventSource | null = null;
    const sseUrl = `${API_BASE_URL}${TELEGRAM_API_ROUTES.FILES.UPLOAD_PROGRESS_STREAM}?file_id=${fileId}`;

    const closeSSE = () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };

    if (signal) {
      signal.addEventListener('abort', closeSSE);
    }

    if (onProgress) {
      eventSource = new EventSource(sseUrl);
      eventSource.onmessage = (event) => {
        const percent = parseInt(event.data, 10);
        if (!isNaN(percent) && percent >= 0) {
          // Server reports 0-99 during upload_part, 100 on save_file.
          // Cap at 99 here; we emit 100 ourselves after saveFile resolves.
          onProgress(Math.min(99, percent));
        }
      };
      eventSource.onerror = () => {
        // Non-fatal: SSE can reconnect automatically; just close on error.
        closeSSE();
      };
    }

    // ─── Upload parts ─────────────────────────────────────────────────────
    const uploadPartWithProgress = async (partIndex: number) => {
      if (signal?.aborted) {
        throw new Error('Upload cancelled');
      }
      const start = partIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        if (signal) {
          const onReaderAbort = () => {
            reader.abort();
            reject(new Error('Upload cancelled'));
          };
          signal.addEventListener('abort', onReaderAbort);
          const origOnload = reader.onload;
          reader.onload = (e) => {
            signal.removeEventListener('abort', onReaderAbort);
            if (origOnload) origOnload.call(reader, e);
          };
          const origOnerror = reader.onerror;
          reader.onerror = (e) => {
            signal.removeEventListener('abort', onReaderAbort);
            if (origOnerror) origOnerror.call(reader, e);
          };
        }
        reader.readAsArrayBuffer(chunk);
      });

      await apiClient.uploadPart(
        fileId,
        partIndex,
        arrayBuffer,
        file.size,
        totalParts,
        start,
        undefined, // no client-side XHR progress needed; SSE handles it
        signal,
      );
    };

    const partIndices = Array.from({ length: totalParts }, (_, i) => i);
    const executeQueue = async () => {
      const workers = [];
      const getNextPart = () => {
        if (partIndices.length === 0) return null;
        return partIndices.shift()!;
      };

      const worker = async () => {
        let partIndex = getNextPart();
        while (partIndex !== null) {
          await uploadPartWithProgress(partIndex);
          partIndex = getNextPart();
        }
      };

      for (let i = 0; i < Math.min(concurrencyLimit, totalParts); i++) {
        workers.push(worker());
      }
      await Promise.all(workers);
    };

    try {
      await executeQueue();

      if (signal?.aborted) {
        throw new Error('Upload cancelled');
      }

      // ─── Finalise ───────────────────────────────────────────────────────
      const result = await apiClient.saveFile(
        fileId,
        file.name,
        file.size,
        folderId,
        signal,
      );
      if (onProgress) {
        onProgress(100);
      }
      return result;
    } finally {
      closeSSE();
      if (signal) {
        signal.removeEventListener('abort', closeSSE);
      }
    }
  },

  downloadFile: (fileId: number | string) =>
    fetch(
      `${API_BASE_URL}${TELEGRAM_API_ROUTES.FILES.DOWNLOAD}?file_id=${fileId}`,
    ).then((res) => {
      if (!res.ok) throw new Error(`Download failed: ${res.statusText}`);
      return res.blob();
    }),
};
export type ApiClient = typeof apiClient;
