import { useState, useMemo, useRef, useEffect } from 'react';
import { Box, HStack, VStack, Text, Button } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { appStore, selectApiCredentials, useShallow } from '@appStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  apiClient,
  FolderMetadata,
  useCurrentUser,
  useFolders,
  useFiles,
  API_BASE_URL,
  TELEGRAM_API_ROUTES,
} from '@services';
import { DashboardItem, ActiveTab, ToastType } from './types';
// Subcomponents
import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { UploadProgressBanner } from './components/UploadProgressBanner';
import { FilesTable } from './components/FilesTable';
import { getTelegramShareLink, formatSize, formatDate, getFileType } from './components/const';

const Dashboard = () => {
  const { clearApiCredentials } = appStore(useShallow(selectApiCredentials));
  const queryClient = useQueryClient();

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Navigation & Filter States
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [lastSynced, setLastSynced] = useState<Date | null>(() => new Date());

  // Local Pinned & Trash persistence lists
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('telegramonic_pinned_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [trashIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('telegramonic_trash_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('telegramonic_pinned_ids', JSON.stringify(starredIds));
    } catch (_) {}
  }, [starredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('telegramonic_trash_ids', JSON.stringify(trashIds));
    } catch (_) {}
  }, [trashIds]);

  // Custom Toast System state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>('success');

  // Uploading state
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // TanStack Query Hooks
  const { data: currentUser } = useCurrentUser();
  const { data: folders = [], isFetching: isFetchingFolders } = useFolders(currentFolderId !== null ? currentFolderId : undefined);
  const showAllFiles = activeTab === 'pinned';
  const { data: files = [], isFetching: isFetchingFiles } = useFiles(
    currentFolderId !== null ? currentFolderId : undefined,
    searchQuery || undefined,
    showAllFiles
  );
  const { data: allFolders = [], isFetching: isFetchingAllFolders } = useFolders(undefined);

  const isSyncing = !!(isFetchingFolders || isFetchingFiles || isFetchingAllFolders);

  // Toast Helper
  const showToast = (msg: string, type: ToastType = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Breadcrumbs calculation
  const breadcrumbs = useMemo(() => {
    if (!currentFolderId) return [];
    const path: FolderMetadata[] = [];
    let currentId: string | null = currentFolderId;
    const visited = new Set<string>();
    while (currentId !== null && !visited.has(currentId)) {
      visited.add(currentId);
      const targetId: string = currentId;
      const folder = allFolders.find((f) => f.id === targetId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parent_id || null;
      } else {
        break;
      }
    }
    return path;
  }, [currentFolderId, allFolders]);

  const ownerName = useMemo(() => {
    return currentUser
      ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
      : 'Me';
  }, [currentUser]);



  // Unified list mapping files and folders together
  const dashboardItems = useMemo(() => {
    const foldersToUse = activeTab === 'pinned' ? allFolders : folders;
    const folderItems: DashboardItem[] = foldersToUse.map((f) => {
      const itemId = `folder-${f.id}`;
      return {
        id: itemId,
        dbId: f.id,
        name: f.name,
        type: 'folder',
        owner: ownerName,
        lastModified: '—',
        size: '—',
        sizeBytes: 0,
        starred: starredIds.includes(itemId),
        inTrash: trashIds.includes(itemId),
        isFolder: true,
      };
    });

    const fileItems: DashboardItem[] = files.map((f) => {
      const itemId = `file-${f.id}`;
      return {
        id: itemId,
        dbId: f.id,
        name: f.name,
        type: getFileType(f.file_ext || ''),
        owner: ownerName,
        lastModified: formatDate(f.created_at),
        size: formatSize(f.size),
        sizeBytes: f.size,
        starred: starredIds.includes(itemId),
        inTrash: trashIds.includes(itemId),
        isFolder: false,
        telegramMessageId: f.telegram_message_id,
        folderId: f.folder_id,
      };
    });

    return [...folderItems, ...fileItems];
  }, [activeTab, folders, allFolders, files, starredIds, trashIds, ownerName]);

  // Filtering based on active tab
  const filteredItems = useMemo(() => {
    return dashboardItems.filter((item) => {
      // Never show trashed items in any tab
      if (item.inTrash) return false;

      if (activeTab === 'pinned') {
        return item.starred;
      }
      
      // 'all' tab: At root of "In my drive", list ONLY folders
      if (currentFolderId === null) {
        return item.isFolder;
      }
      
      // Inside a folder, list all files/folders inside it
      return true;
    });
  }, [dashboardItems, activeTab, currentFolderId]);
  const handleSync = async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['folders'] }),
        queryClient.invalidateQueries({ queryKey: ['files'] }),
        queryClient.invalidateQueries({ queryKey: ['stats'] }),
      ]);
      setLastSynced(new Date());
      showToast('Drive synced successfully', 'success');
    } catch (err: any) {
      showToast(`Sync failed: ${err.message}`, 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.logOut();
    } catch (_) {}
    clearApiCredentials();
    showToast('Logged out successfully', 'info');
  };

  const handleShareFile = (item: DashboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = getTelegramShareLink(item.folderId, item.telegramMessageId);
    navigator.clipboard
      .writeText(link)
      .then(() => {
        showToast(`Telegram message link copied: ${item.name}`, 'success');
      })
      .catch(() => {
        showToast(`Failed to copy link`, 'error');
      });
  };

  const handleToggleStar = (item: DashboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
    showToast(
      item.starred ? `Unpinned: ${item.name}` : `Pinned: ${item.name}`,
      'success'
    );
  };

  const handleDeleteFile = async (item: DashboardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      showToast(`Deleting ${item.name}...`, 'info');
      await apiClient.deleteFile(item.dbId);
      
      // Invalidate queries to refresh files list and stats
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      
      showToast(`Deleted successfully: ${item.name}`, 'success');
    } catch (err: any) {
      showToast(`Failed to delete file: ${err.message}`, 'error');
    }
  };

  // Trigger hidden file picker
  const triggerFileUpload = () => {
    if (currentFolderId === null) {
      showToast("Cannot upload files directly to the root 'In my drive'. Please enter a folder first.", 'error');
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Streaming upload implementation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setUploadingFile(file.name);
    setUploadProgress(0);

    try {
      await apiClient.uploadStream(file, currentFolderId, (percent) => {
        setUploadProgress(percent);
      }, controller.signal);
      showToast(`Uploaded successfully: ${file.name}`, 'success');
      
      // Invalidate queries so TanStack query refetches fresh list and stats
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message === 'Upload cancelled') {
        showToast(`Upload cancelled: ${file.name}`, 'info');
      } else {
        showToast(`Upload failed: ${err.message}`, 'error');
      }
    } finally {
      setUploadingFile(null);
      abortControllerRef.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Create Folder modal states
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Create real folder on server
  const handleCreateFolder = () => {
    if (currentFolderId !== null) {
      showToast("Nested folders are not supported. Folders can only be created at the root level.", 'error');
      return;
    }
    setNewFolderName('');
    setIsCreateFolderOpen(true);
  };

  const submitCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await apiClient.createFolder(newFolderName.trim(), currentFolderId || undefined);
      showToast(`Created folder: ${newFolderName}`, 'success');
      setIsCreateFolderOpen(false);
      setNewFolderName('');
      
      // Invalidate queries to fetch new list and stats
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    } catch (err: any) {
      showToast(`Failed to create folder: ${err.message}`, 'error');
    }
  };

  // Delete folder from server
  const handleDeleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to permanently delete this folder?');
    if (!confirmed) return;
    try {
      await apiClient.deleteFolder(folderId);
      showToast(`Folder deleted successfully`, 'success');
      
      // Invalidate queries to fetch new list and stats
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    } catch (err: any) {
      showToast(`Failed to delete folder: ${err.message}`, 'error');
    }
  };

  // Real file download flow
  const handleDownloadFile = async (item: DashboardItem) => {
    if (item.isFolder) return;
    try {
      showToast(`Downloading ${item.name}...`, 'info');
      
      if (window.electronAPI && window.electronAPI.downloadFileDirectly) {
        // Use native Electron download stream flow to prevent macOS temp file leaks
        const downloadUrl = `${API_BASE_URL}${TELEGRAM_API_ROUTES.FILES.DOWNLOAD}?file_id=${item.dbId}`;
        const res = await window.electronAPI.downloadFileDirectly(downloadUrl, item.name);
        if (res.success) {
          showToast(`Downloaded successfully: ${item.name}`, 'success');
        } else if (res.error !== 'Canceled') {
          showToast(`Download failed: ${res.error}`, 'error');
        }
      } else {
        // Fallback for browser web flow
        const blob = await apiClient.downloadFile(item.dbId);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Delay revocation to ensure Chromium/Electron has completed the file save operation
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
        
        showToast(`Downloaded successfully: ${item.name}`, 'success');
      }
    } catch (err: any) {
      showToast(`Download failed: ${err.message}`, 'error');
    }
  };

  const handleItemClick = (item: DashboardItem) => {
    if (item.isFolder) {
      setCurrentFolderId(item.dbId);
    } else {
      handleDownloadFile(item);
    }
  };

  return (
    <Box bg={{ base: '#f4f6f8', _dark: '#0b141d' }} minH="calc(100vh - 38px)" color="fg" display="flex" flexDirection="column" position="relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        data-testid="file-input"
      />

      {/* 1. Header/TopNavBar */}
      <TopNavBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onUploadClick={triggerFileUpload}
        onCreateFolderClick={handleCreateFolder}
        currentFolderId={currentFolderId}
      />

      <HStack flex={1} alignItems="stretch" gap={0} overflow="hidden">
        {/* 2. SideNavBar */}
        <SideNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCurrentFolderId={setCurrentFolderId}
          onLogout={handleLogout}
        />

        {/* 3. Main content area */}
        <Box flex={1} p={8} overflowY="auto" className="custom-scrollbar">
          <VStack gap={8} align="stretch" maxW="1100px" mx="auto">
            {/* Breadcrumbs Navigation */}
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              currentFolderId={currentFolderId}
              setCurrentFolderId={setCurrentFolderId}
            />

            {/* Upload progress banner */}
            <UploadProgressBanner
              uploadingFile={uploadingFile}
              uploadProgress={uploadProgress}
              onCancelUpload={handleCancelUpload}
            />



            {/* Detailed Files Table */}
            <FilesTable
              activeTab={activeTab}
              filteredItems={filteredItems}
              onItemClick={handleItemClick}
              onToggleStar={handleToggleStar}
              onShare={handleShareFile}
              onDownload={handleDownloadFile}
              onDeleteFolder={handleDeleteFolder}
              onDeleteFile={handleDeleteFile}
              onSync={handleSync}
              lastSynced={lastSynced}
              isSyncing={isSyncing}
            />
          </VStack>
        </Box>
      </HStack>


      {/* Create Folder Dialog */}
      <AnimatePresence>
        {isCreateFolderOpen && (
          <Box
            position="fixed"
            inset={0}
            bg="black/60"
            backdropFilter="blur(4px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
            onClick={() => setIsCreateFolderOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <VStack
                w="400px"
                bg={{ base: 'white', _dark: '#131c26' }}
                borderWidth="1px"
                borderColor="border"
                borderRadius="2xl"
                p={6}
                gap={5}
                shadow="2xl"
                align="stretch"
              >
                <HStack justify="space-between">
                  <Text fontWeight="extrabold" fontSize="md" color="fg">
                    Create New Folder
                  </Text>
                  <Box
                    as="button"
                    onClick={() => setIsCreateFolderOpen(false)}
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    ✕
                  </Box>
                </HStack>

                <VStack align="stretch" gap={1.5}>
                  <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                    Folder Name
                  </Text>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name..."
                    autoFocus
                    style={{
                      width: '100%',
                      height: '40px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--chakra-colors-border)',
                      borderRadius: '12px',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: 'var(--chakra-colors-fg)',
                      outline: 'none',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitCreateFolder();
                      }
                    }}
                  />
                </VStack>

                <HStack justify="flex-end" gap={3}>
                  <Button
                    onClick={() => setIsCreateFolderOpen(false)}
                    variant="outline"
                    borderColor="border"
                    color="fg.muted"
                    h="36px"
                    borderRadius="xl"
                    fontSize="xs"
                    fontWeight="bold"
                    _hover={{ bg: 'bg.hover' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitCreateFolder}
                    bg="primary"
                    color="white"
                    h="36px"
                    borderRadius="xl"
                    fontSize="xs"
                    fontWeight="bold"
                    _hover={{ filter: 'brightness(1.1)' }}
                  >
                    Create Folder
                  </Button>
                </HStack>
              </VStack>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      {/* 5. Custom Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              zIndex: 2000,
            }}
          >
            <HStack
              bg={{ base: 'white', _dark: '#18202a' }}
              borderWidth="1px"
              borderColor={
                toastType === 'success'
                  ? 'success.400'
                  : toastType === 'error'
                    ? 'error.400'
                    : 'primary'
              }
              borderRadius="xl"
              px={5}
              py={3.5}
              shadow="2xl"
              gap={3}
            >
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg={
                  toastType === 'success'
                     ? 'success.400'
                    : toastType === 'error'
                      ? 'error.400'
                      : 'primary'
                }
              />
              <Text fontSize="sm" fontWeight="bold" color="fg">
                {toastMessage}
              </Text>
            </HStack>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        .pulse-anim {
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--chakra-colors-border);
          border-radius: 10px;
        }
      `}</style>
    </Box>
  );
};

// Helpers are imported from './components/const'

export default Dashboard;
