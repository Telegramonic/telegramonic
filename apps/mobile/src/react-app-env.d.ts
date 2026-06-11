/// <reference types="react-scripts" />
declare module '@fontsource/*';
declare module '*.css';

interface ElectronAPI {
  platform: string;
  minimize: () => void;
  close: () => void;
  checkConnection: () => Promise<{ status: string; latency: number | null }>;
  setDockIcon?: (dataUrl: string) => void;
  downloadFileDirectly?: (
    url: string,
    filename: string,
  ) => Promise<{ success: boolean; error?: string }>;
  openExternal?: (url: string) => void;
}

interface Window {
  electronAPI?: ElectronAPI;
}
