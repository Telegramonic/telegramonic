export type AuthState =
  | { status: 'LoggedOut' }
  | { status: 'AwaitingCode'; data: { phone: string; phone_code_hash: string } }
  | { status: 'AwaitingPassword'; data: { phone: string } }
  | { status: 'LoggedIn' };

export interface AuthResult {
  success: boolean;
  next_step?: 'code' | 'password' | 'dashboard' | null;
  error?: string | null;
}

export interface FileMetadata {
  id: string;
  folder_id?: string | null;
  name: string;
  size: number;
  mime_type?: string | null;
  file_ext?: string | null;
  created_at: string;
  icon_type: string;
  telegram_message_id?: number | null;
}

export interface FolderMetadata {
  id: string;
  parent_id?: string | null;
  name: string;
}

export interface Drive {
  chat_id: string;
  name: string;
  icon?: string | null;
}

export interface DriveStats {
  total_space: number;
  used_space: number;
  file_count: number;
  folder_count: number;
}

export interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string | null;
  username?: string | null;
  phone?: string | null;
}

export interface ServerHealthResponse {
  status: 'connected' | 'error';
  latency: number | null;
}
