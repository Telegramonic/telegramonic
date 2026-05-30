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
  id: number;
  folder_id?: number | null;
  name: string;
  size: number;
  mime_type?: string | null;
  file_ext?: string | null;
  created_at: string;
  icon_type: string;
}

export interface FolderMetadata {
  id: number;
  parent_id?: number | null;
  name: string;
}

export interface Drive {
  chat_id: number;
  name: string;
  icon?: string | null;
}
