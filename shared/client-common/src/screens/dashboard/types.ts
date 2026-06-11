/**
 * Shared types for the Dashboard screen.
 */

export interface DashboardItem {
  id: string; // "file-101" or "folder-1"
  dbId: string;
  name: string;
  type:
    | 'folder'
    | 'presentation'
    | 'code'
    | 'zip'
    | 'document'
    | 'video'
    | 'csv'
    | 'audio'
    | 'file';
  owner: string;
  ownerAvatar?: string;
  lastModified: string;
  size: string;
  sizeBytes: number;
  starred: boolean;
  inTrash: boolean;
  isFolder: boolean;
  telegramMessageId?: number | null;
  folderId?: string | null;
}

export type ActiveTab = 'all' | 'pinned' | 'profile';

export type ToastType = 'success' | 'info' | 'error';
