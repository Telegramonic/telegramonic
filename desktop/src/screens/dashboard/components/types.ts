import { DashboardItem, ActiveTab, ToastType } from '../types';
import { FolderMetadata, FileMetadata } from '@services';

/**
 * Prop types for all dashboard subcomponents.
 */

export interface TopNavBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onUploadClick: () => void;
  onCreateFolderClick: () => void;
}

export interface SideNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setCurrentFolderId: (id: number | null) => void;
  onUpgradeStorage: () => void;
  onLogout: () => void;
}

export interface BreadcrumbsProps {
  breadcrumbs: FolderMetadata[];
  currentFolderId: number | null;
  setCurrentFolderId: (id: number | null) => void;
}

export interface SuggestedSectionProps {
  activeTab: ActiveTab;
  currentFolderId: number | null;
  suggestedFiles: FileMetadata[];
  ownerName: string;
  starredIds: string[];
  trashIds: string[];
  onItemClick: (item: DashboardItem) => void;
  onShare: (item: DashboardItem, e: React.MouseEvent) => void;
  onUploadTrigger: () => void;
  onCreateFolderTrigger: () => void;
  onShowToast: (msg: string, type?: ToastType) => void;
}

export interface FilesTableProps {
  activeTab: ActiveTab;
  filteredItems: DashboardItem[];
  onItemClick: (item: DashboardItem) => void;
  onToggleStar: (item: DashboardItem, e: React.MouseEvent) => void;
  onShare: (item: DashboardItem, e: React.MouseEvent) => void;
  onDeleteFolder: (folderId: number, e: React.MouseEvent) => void;
  onToggleTrash: (item: DashboardItem, e: React.MouseEvent) => void;
}

export interface UploadProgressBannerProps {
  uploadingFile: string | null;
  uploadProgress: number;
}
