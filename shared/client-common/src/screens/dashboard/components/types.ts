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
}

export interface BreadcrumbsProps {
  breadcrumbs: FolderMetadata[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
}

export interface UploadProgressBannerProps {
  uploadingFile?: string | null;
  uploadProgress?: number;
  onCancelUpload?: () => void;
  activeUploads?: Array<{
    id: string;
    name: string;
    progress: number;
    onCancel?: () => void;
  }>;
}
