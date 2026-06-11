import { IconType } from '@assets/types';
import { DashboardItem } from '../types';

/**
 * Shared helper constants and utility functions for dashboard components.
 */

// ─── File Type Derivation ──────────────────────────────────────────────────

export type FileType =
  | 'folder'
  | 'presentation'
  | 'code'
  | 'zip'
  | 'document'
  | 'video'
  | 'csv'
  | 'audio'
  | 'file';

export const getFileType = (ext: string): Exclude<FileType, 'folder'> => {
  const e = ext.toLowerCase();
  if (['pdf', 'docx', 'doc', 'txt'].includes(e)) return 'document';
  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(e)) return 'presentation';
  if (['mp4', 'mkv', 'avi', 'mov'].includes(e)) return 'video';
  if (['zip', 'tar', 'gz', 'rar'].includes(e)) return 'zip';
  if (['js', 'ts', 'tsx', 'rs', 'py', 'json', 'css', 'html'].includes(e))
    return 'code';
  if (['csv', 'xlsx', 'xls'].includes(e)) return 'csv';
  if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(e)) return 'audio';
  return 'file';
};

// ─── Icon Mapping ──────────────────────────────────────────────────────────

export const getFileIconType = (type: string): IconType => {
  switch (type) {
    case 'video':
      return IconType.VIDEO;
    case 'zip':
      return IconType.ZIP;
    case 'folder':
      return IconType.FOLDER;
    case 'code':
      return IconType.CODE;
    case 'presentation':
      return IconType.PRESENTATION;
    case 'csv':
      return IconType.CSV;
    case 'audio':
      return IconType.AUDIO;
    case 'document':
    default:
      return IconType.FILE;
  }
};

// ─── Gradient Mapping ──────────────────────────────────────────────────────

export const getGradientForType = (type: string): string => {
  switch (type) {
    case 'video':
      return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    case 'zip':
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    case 'code':
      return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
    case 'presentation':
      return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
    case 'document':
      return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)';
    case 'csv':
      return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    case 'audio':
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    default:
      return 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
  }
};

// ─── Formatting Utilities ──────────────────────────────────────────────────

export const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const formatDate = (
  isoString: string,
  t?: (key: string, options?: any) => string,
): string => {
  try {
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return t ? t('Dashboard.date.justNow') : 'Just now';
    if (diffMins < 60)
      return t
        ? t('Dashboard.date.minsAgo', { count: diffMins })
        : `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return t
        ? t('Dashboard.date.hoursAgo', { count: diffHours })
        : `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return t ? t('Dashboard.date.recent') : 'Recent';
  }
};

// ─── DashboardItem Builder ─────────────────────────────────────────────────

export const buildDashboardItemFromFile = (
  file: {
    id: string;
    name: string;
    size: number;
    file_ext?: string | null;
    created_at: string;
    telegram_message_id?: number | null;
    folder_id?: string | null;
  },
  ownerName: string,
  starredIds: string[],
  trashIds: string[],
  t?: (key: string, options?: any) => string,
): DashboardItem => {
  const id = `file-${file.id}`;
  return {
    id,
    dbId: file.id,
    name: file.name,
    type: getFileType(file.file_ext || ''),
    owner: ownerName,
    lastModified: formatDate(file.created_at, t),
    size: formatSize(file.size),
    sizeBytes: file.size,
    starred: starredIds.includes(id),
    inTrash: trashIds.includes(id),
    isFolder: false,
    telegramMessageId: file.telegram_message_id,
    folderId: file.folder_id,
  };
};

export const getTelegramShareLink = (
  folderId: string | null | undefined,
  messageId: number | null | undefined,
): string => {
  if (!folderId || !messageId) {
    return 'https://t.me';
  }

  // Clean up the folder ID to get the clean channel ID
  let cleanId = folderId.replace('-', '');
  if (cleanId.startsWith('100')) {
    cleanId = cleanId.substring(3);
  }

  return `https://t.me/c/${cleanId}/${messageId}`;
};
