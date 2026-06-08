import { forwardRef } from 'react';
import { fireEvent, screen, act } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { renderWithProvidersAndRouter } from '@testUtils';
import { appStore } from '@appStore';

// Polyfill Blob.prototype.arrayBuffer for JSDOM environments if missing
if (!Blob.prototype.arrayBuffer) {
  Blob.prototype.arrayBuffer = function (this: Blob) {
    return new Promise<ArrayBuffer>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(this);
    });
  };
}

// Mock data structures
const allFilesBase = [
  // id 1 and 3 are inside the folder with ID 2 (Marketing Assets)
  { id: '1', folder_id: '2', name: 'Project_Requirements_v2.pdf', size: 2.4 * 1024 * 1024, created_at: '2024-10-24T12:00:00Z', icon_type: 'pdf', file_ext: 'pdf', telegram_message_id: 101 },
  { id: '3', folder_id: '2', name: 'Product_Demo_Final.mp4', size: 854 * 1024 * 1024, created_at: '2024-10-20T12:00:00Z', icon_type: 'video', file_ext: 'mp4', telegram_message_id: 303 },
  // id 4 is at the root level (folder_id is null)
  { id: '4', folder_id: null, name: 'User_Data_Analytics.csv', size: 12.5 * 1024 * 1024, created_at: '2024-10-19T12:00:00Z', icon_type: 'file', file_ext: 'csv', telegram_message_id: null }
];

const allFoldersBase = [
  { id: '2', parent_id: null, name: 'Marketing Assets' }
];

// Mock apiClient implementation
const mockGetMe = jest.fn().mockResolvedValue({
  id: '12345',
  first_name: 'John',
  last_name: 'Doe',
  username: 'johndoe',
  phone: '+919876543210'
});
const mockGetStats = jest.fn().mockResolvedValue({
  total_space: 100 * 1024 * 1024 * 1024,
  used_space: 45.2 * 1024 * 1024 * 1024,
  file_count: 3,
  folder_count: 1
});
const mockGetDrives = jest.fn().mockResolvedValue([]);

const mockGetFolders = jest.fn().mockImplementation((parentId?: string) => {
  if (parentId) {
    return Promise.resolve(allFoldersBase.filter((f) => f.parent_id === parentId));
  }
  return Promise.resolve(allFoldersBase);
});

const mockGetFiles = jest.fn().mockImplementation((folderId?: string | null, q?: string, all?: boolean) => {
  let filtered = allFilesBase;
  if (!all) {
    filtered = filtered.filter((f) => f.folder_id === (folderId || null));
  }
  if (q) {
    filtered = filtered.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
  }
  return Promise.resolve(filtered);
});

const mockUploadStream = jest.fn().mockImplementation((_file: File, _folderId: string | null, onProgress?: (p: number) => void) => {
  if (onProgress) onProgress(100);
  return Promise.resolve({
    id: '999',
    folder_id: null,
    name: 'Marketing_Strategy_2026.docx',
    size: 1000,
    created_at: new Date().toISOString(),
    icon_type: 'file',
    file_ext: 'docx'
  });
});

jest.mock('@services/apiClient', () => ({
  apiClient: {
    getMe: () => mockGetMe(),
    getStats: () => mockGetStats(),
    getDrives: () => mockGetDrives(),
    getFolders: (parentId?: string) => mockGetFolders(parentId),
    getFiles: (folderId?: string | null, q?: string, all?: boolean) => mockGetFiles(folderId, q, all),
    uploadStream: (file: File, folderId: string | null, onProgress?: (p: number) => void) => mockUploadStream(file, folderId, onProgress),
    deleteFile: jest.fn().mockResolvedValue({ success: true }),
    deleteFolder: jest.fn().mockResolvedValue({ success: true }),
    downloadFile: jest.fn().mockResolvedValue(new Blob(['content'], { type: 'video/mp4' })),
    logOut: jest.fn().mockResolvedValue(true),
  }
}));

// Mock framer-motion to render plain HTML elements in tests to avoid animation lag/timing issues
jest.mock('framer-motion', () => {
  const React = require('react');
  const MockDiv = forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockDiv.displayName = 'MockDiv';
  return {
    motion: {
      div: MockDiv,
    },
    AnimatePresence: ({ children }: any) => children,
  };
});

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    act(() => {
      appStore.setState({
        currentAccount: null,
        savedAccounts: [],
      });
    });
  });

  it('should render Dashboard screen successfully with default elements', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Telegramonic')).toBeInTheDocument();
    expect(screen.getAllByText('In my drive').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('My Storage')).toBeInTheDocument();
    // Main list should show Marketing Assets folder
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
  });

  it('should filter files/folders based on search query', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText('Search files, folders...');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Marketing' } });
    });
    
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
  });

  it('should toggle folder pin status when clicking pin button', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
    const pinButtons = await screen.findAllByTitle('Pin');
    
    fireEvent.click(pinButtons[0]);
    expect(await screen.findByText('Pinned: Marketing Assets')).toBeInTheDocument();
  });

  it('should remove a file when clicking remove button inside a folder', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
    
    // Navigate inside Marketing Assets
    fireEvent.click(screen.getByText('Marketing Assets'));
    
    expect((await screen.findAllByText('Product_Demo_Final.mp4'))[0]).toBeInTheDocument();
    const deleteButtons = await screen.findAllByTitle('Delete File');
    
    fireEvent.click(deleteButtons[0]); // remove Product_Demo_Final.mp4 (index 0)
    expect(await screen.findByText('Deleted successfully: Product_Demo_Final.mp4')).toBeInTheDocument();
  });

  it('should filter files on tab switching', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
    
    // Navigate inside Marketing Assets
    fireEvent.click(screen.getByText('Marketing Assets'));
    expect((await screen.findAllByText('Product_Demo_Final.mp4'))[0]).toBeInTheDocument();
    
    // Pin it
    const pinButtons = await screen.findAllByTitle('Pin');
    fireEvent.click(pinButtons[0]); // pin Product_Demo_Final.mp4 (index 0)
    expect(await screen.findByText('Pinned: Product_Demo_Final.mp4')).toBeInTheDocument();

    // Switch to Pinned tab
    fireEvent.click(screen.getByText('Pinned'));
    
    // Pinned tab should show pinned file Product_Demo_Final.mp4
    expect((await screen.findAllByText('Product_Demo_Final.mp4'))[0]).toBeInTheDocument();
    // But should not show Marketing Assets (which is not pinned)
    expect(screen.queryByText('Marketing Assets')).not.toBeInTheDocument();
  });

  it('should copy link to clipboard when clicking share button inside folder', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
    
    // Navigate inside Marketing Assets
    fireEvent.click(screen.getByText('Marketing Assets'));
    expect((await screen.findAllByText('Product_Demo_Final.mp4'))[0]).toBeInTheDocument();
    
    const shareButtons = await screen.findAllByRole('button', { name: 'Share Link' });
    fireEvent.click(shareButtons[0]); // share Product_Demo_Final.mp4 (index 0)

    expect(await screen.findByText('Telegram message link copied: Product_Demo_Final.mp4')).toBeInTheDocument();
    expect(mockWriteText).toHaveBeenCalledWith('https://t.me/c/2/303');
  });

  it('should upload a file successfully', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();

    const file = new File(['hello'], 'Marketing_Strategy_2026.docx', { type: 'text/plain' });
    const fileInput = screen.getByTestId('file-input');

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(await screen.findByText('Uploaded successfully: Marketing_Strategy_2026.docx')).toBeInTheDocument();
    expect(mockUploadStream).toHaveBeenCalled();
  });

  it('should remove a folder when clicking remove button', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();

    const deleteButtons = await screen.findAllByTitle('Delete Folder');

    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

    fireEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to permanently delete this folder?');
    expect(await screen.findByText('Folder deleted successfully')).toBeInTheDocument();

    confirmSpy.mockRestore();
  });
});
