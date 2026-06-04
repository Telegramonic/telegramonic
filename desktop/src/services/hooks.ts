import { useQuery } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { TelegramUser, DriveStats, FolderMetadata, FileMetadata, ServerHealthResponse } from './types';

export const useServerHealth = () => {
  return useQuery<ServerHealthResponse>({
    queryKey: ['serverHealth'],
    queryFn: async () => {
      const startTime = Date.now();
      try {
        const res = await apiClient.checkHealth();
        const latency = Date.now() - startTime;
        if (res && res.status === 'ok') {
          return {
            status: 'connected',
            latency,
          };
        }
        return {
          status: 'error',
          latency: null,
        };
      } catch (err) {
        return {
          status: 'error',
          latency: null,
        };
      }
    },
    refetchInterval: 5000,
    retry: false,
    refetchOnWindowFocus: true,
  });
};

export const useCurrentUser = () => {
  return useQuery<TelegramUser | null>({
    queryKey: ['currentUser'],
    queryFn: () => apiClient.getMe().catch(() => null),
    staleTime: 60000, // cache for 1 minute
  });
};

export const useStats = () => {
  return useQuery<DriveStats | null>({
    queryKey: ['stats'],
    queryFn: () => apiClient.getStats().catch(() => null),
    staleTime: 10000, // cache for 10 seconds
  });
};

export const useFolders = (parentId?: number) => {
  return useQuery<FolderMetadata[]>({
    queryKey: ['folders', parentId],
    queryFn: () => apiClient.getFolders(parentId).catch(() => []),
    staleTime: 5000, // cache for 5 seconds
  });
};

export const useFiles = (folderId?: number, q?: string) => {
  return useQuery<FileMetadata[]>({
    queryKey: ['files', folderId, q],
    queryFn: () => apiClient.getFiles(folderId, q).catch(() => []),
    staleTime: 5000, // cache for 5 seconds
  });
};
