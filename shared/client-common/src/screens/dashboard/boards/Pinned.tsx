import React from 'react';
import { FilesTable } from './FilesTable';
import { DashboardItem } from '../types';

interface PinnedProps {
  filteredItems: DashboardItem[];
  onItemClick: (item: DashboardItem) => void;
  onToggleStar: (item: DashboardItem, e: React.MouseEvent) => void;
  onShare: (item: DashboardItem, e: React.MouseEvent) => void;
  onDownload: (item: DashboardItem, e: React.MouseEvent) => void;
  onDeleteFolder: (id: string, e: React.MouseEvent) => void;
  onDeleteFile: (item: DashboardItem, e: React.MouseEvent) => void;
  onSync: () => Promise<void>;
  lastSynced: Date | null;
  isSyncing: boolean;
  onDropFiles?: (files: File[]) => void;
  onUploadClick?: () => void;
}

export const Pinned = ({
  filteredItems,
  onItemClick,
  onToggleStar,
  onShare,
  onDownload,
  onDeleteFolder,
  onDeleteFile,
  onSync,
  lastSynced,
  isSyncing,
  onDropFiles,
  onUploadClick,
}: PinnedProps) => {
  return (
    <FilesTable
      activeTab="pinned"
      filteredItems={filteredItems}
      onItemClick={onItemClick}
      onToggleStar={onToggleStar}
      onShare={onShare}
      onDownload={onDownload}
      onDeleteFolder={onDeleteFolder}
      onDeleteFile={onDeleteFile}
      onSync={onSync}
      lastSynced={lastSynced}
      isSyncing={isSyncing}
      isInsideFolder={false}
      onDropFiles={onDropFiles}
      onUploadClick={onUploadClick}
    />
  );
};
