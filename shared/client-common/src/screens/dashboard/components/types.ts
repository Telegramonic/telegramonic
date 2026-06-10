import { DashboardItem, ActiveTab } from '../types';
import { FolderMetadata } from '@services';

/**
 * Prop types for all dashboard subcomponents.
 */

export interface TopNavBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onUploadClick: () => void;
  onCreateFolderClick: () => void;
  currentFolderId: string | null;
  onMenuClick?: () => void;
}

export interface SideNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setCurrentFolderId: (id: string | null) => void;
  onLogout: () => void;
}

export interface BreadcrumbsProps {
  breadcrumbs: FolderMetadata[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
}



export interface FilesTableProps {
  activeTab: ActiveTab;
  filteredItems: DashboardItem[];
  onItemClick: (item: DashboardItem) => void;
  onToggleStar: (item: DashboardItem, e: React.MouseEvent) => void;
  onShare: (item: DashboardItem, e: React.MouseEvent) => void;
  onDownload: (item: DashboardItem, e: React.MouseEvent) => void;
  onDeleteFolder: (folderId: string, e: React.MouseEvent) => void;
  onDeleteFile: (item: DashboardItem, e: React.MouseEvent) => void;
  onSync: () => void;
  lastSynced: Date | null;
  isSyncing: boolean;
}

export interface UploadProgressBannerProps {
  uploadingFile: string | null;
  uploadProgress: number;
  onCancelUpload?: () => void;
}
