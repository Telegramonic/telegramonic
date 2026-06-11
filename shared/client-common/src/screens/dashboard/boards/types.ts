import { DashboardItem, ActiveTab } from '../types';

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
  /** Called when the user presses the back button (only shown when inside a folder) */
  onBack?: () => void;
  /** Whether we are currently inside a folder (not at root) */
  isInsideFolder?: boolean;
  onDropFiles?: (files: File[]) => void;
  onUploadClick?: () => void;
}
