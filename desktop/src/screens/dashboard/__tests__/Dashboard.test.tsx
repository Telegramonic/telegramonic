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
  { id: 1, folder_id: null, name: 'Project_Requirements_v2.pdf', size: 2.4 * 1024 * 1024, created_at: '2024-10-24T12:00:00Z', icon_type: 'pdf', file_ext: 'pdf' },
  { id: 3, folder_id: null, name: 'Product_Demo_Final.mp4', size: 854 * 1024 * 1024, created_at: '2024-10-20T12:00:00Z', icon_type: 'video', file_ext: 'mp4' },
  { id: 4, folder_id: null, name: 'User_Data_Analytics.csv', size: 12.5 * 1024 * 1024, created_at: '2024-10-19T12:00:00Z', icon_type: 'file', file_ext: 'csv' }
];

const allFoldersBase = [
  { id: 2, parent_id: null, name: 'Marketing Assets' }
];

// Mock apiClient implementation
const mockGetMe = jest.fn().mockResolvedValue({
  id: 12345,
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

const mockGetFolders = jest.fn().mockImplementation((parentId?: number) => {
  if (parentId) {
    return Promise.resolve(allFoldersBase.filter((f) => f.parent_id === parentId));
  }
  return Promise.resolve(allFoldersBase);
});

const mockGetFiles = jest.fn().mockImplementation((folderId?: number, q?: string) => {
  let filtered = allFilesBase;
  if (folderId) {
    filtered = filtered.filter((f) => f.folder_id === folderId);
  }
  if (q) {
    filtered = filtered.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
  }
  return Promise.resolve(filtered);
});

const mockUploadPart = jest.fn().mockResolvedValue({ success: true });
const mockSaveFile = jest.fn().mockResolvedValue({
  id: 999,
  folder_id: null,
  name: 'Marketing_Strategy_2026.docx',
  size: 1000,
  created_at: new Date().toISOString(),
  icon_type: 'file',
  file_ext: 'docx'
});

jest.mock('@services/apiClient', () => ({
  apiClient: {
    getMe: () => mockGetMe(),
    getStats: () => mockGetStats(),
    getDrives: () => mockGetDrives(),
    getFolders: (parentId?: number) => mockGetFolders(parentId),
    getFiles: (folderId?: number, q?: string) => mockGetFiles(folderId, q),
    uploadPart: (fileId: number, partIndex: number, bytes: any) => mockUploadPart(fileId, partIndex, bytes),
    saveFile: (fileId: number, name: string, size: number, folderId: any) => mockSaveFile(fileId, name, size, folderId),
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
    act(() => {
      appStore.getState().clearApiCredentials();
    });
  });

  it('should render Dashboard screen successfully with default elements', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Telegramonic')).toBeInTheDocument();
    expect(screen.getByText('Suggested Files')).toBeInTheDocument();
    expect(screen.getAllByText('All Files').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('My Storage')).toBeInTheDocument();
    expect((await screen.findAllByText('Project_Requirements_v2.pdf'))[0]).toBeInTheDocument();
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
  });

  it('should filter files based on search query', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText('Search files, folders...');
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Marketing' } });
    });
    
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
    expect(screen.queryByText('Project_Requirements_v2.pdf')).not.toBeInTheDocument();
  });

  it('should toggle file star status when clicking star button', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect(await screen.findByText('Marketing Assets')).toBeInTheDocument();
    const starButtons = await screen.findAllByTitle('Star File');
    
    fireEvent.click(starButtons[0]);
    expect(await screen.findByText('Starred: Marketing Assets')).toBeInTheDocument();
  });

  it('should delete a file and move it to trash when clicking delete button', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect((await screen.findAllByText('Project_Requirements_v2.pdf'))[0]).toBeInTheDocument();
    const deleteButtons = await screen.findAllByTitle('Move to Trash');
    
    fireEvent.click(deleteButtons[0]); // delete Project_Requirements_v2.pdf
    expect(await screen.findByText('Moved to trash: Project_Requirements_v2.pdf')).toBeInTheDocument();
    expect(screen.queryByText('Project_Requirements_v2.pdf')).not.toBeInTheDocument();
  });

  it('should filter files on tab switching', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect((await screen.findAllByText('Project_Requirements_v2.pdf'))[0]).toBeInTheDocument();
    // Switch to Starred tab
    fireEvent.click(screen.getByText('Starred'));
    expect(screen.queryByText('Marketing Assets')).not.toBeInTheDocument();
  });

  it('should copy link to clipboard when clicking share button', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    renderWithProvidersAndRouter(<Dashboard />);
    expect((await screen.findAllByText('Project_Requirements_v2.pdf'))[0]).toBeInTheDocument();
    const shareButtons = await screen.findAllByRole('button', { name: 'Share Link' });
    fireEvent.click(shareButtons[0]);

    expect(await screen.findByText('Share link copied: Project_Requirements_v2.pdf')).toBeInTheDocument();
    expect(mockWriteText).toHaveBeenCalledWith('https://telegramonic.cloud/share/1');
  });

  it('should upload a file successfully', async () => {
    renderWithProvidersAndRouter(<Dashboard />);
    expect((await screen.findAllByText('Project_Requirements_v2.pdf'))[0]).toBeInTheDocument();

    const file = new File(['hello'], 'Marketing_Strategy_2026.docx', { type: 'text/plain' });
    const fileInput = screen.getByTestId('file-input');

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(await screen.findByText('Uploaded successfully: Marketing_Strategy_2026.docx')).toBeInTheDocument();
    expect(mockUploadPart).toHaveBeenCalled();
    expect(mockSaveFile).toHaveBeenCalled();
  });
});
