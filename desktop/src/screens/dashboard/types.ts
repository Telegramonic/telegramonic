/**
 * Shared types for the Dashboard screen.
 */

export interface DashboardItem {
  id: string; // "file-101" or "folder-1"
  dbId: number; // 101 or 1
  name: string;
  type: 'folder' | 'presentation' | 'code' | 'zip' | 'document' | 'video' | 'csv' | 'file';
  owner: string;
  ownerAvatar?: string;
  lastModified: string;
  size: string;
  sizeBytes: number;
  starred: boolean;
  inTrash: boolean;
  isFolder: boolean;
}

export type ActiveTab = 'all' | 'recent' | 'starred' | 'trash';

export type ToastType = 'success' | 'info' | 'error';
