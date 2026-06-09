import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import { FilesTable } from '../FilesTable';
import { DashboardItem } from '../../types';

const makeFile = (overrides: Partial<DashboardItem> = {}): DashboardItem => ({
  id: 'file-1',
  dbId: 1,
  name: 'report.pdf',
  type: 'document',
  owner: 'John Doe',
  lastModified: '2h ago',
  size: '2.4 MB',
  sizeBytes: 2516582,
  starred: false,
  inTrash: false,
  isFolder: false,
  ...overrides,
});

const makeFolder = (overrides: Partial<DashboardItem> = {}): DashboardItem => ({
  id: 'folder-10',
  dbId: 10,
  name: 'Marketing Assets',
  type: 'folder',
  owner: 'John Doe',
  lastModified: '3d ago',
  size: '—',
  sizeBytes: 0,
  starred: false,
  inTrash: false,
  isFolder: true,
  ...overrides,
});

const defaultProps = {
  activeTab: 'all' as const,
  filteredItems: [],
  onItemClick: jest.fn(),
  onToggleStar: jest.fn(),
  onShare: jest.fn(),
  onDownload: jest.fn(),
  onDeleteFolder: jest.fn(),
  onDeleteFile: jest.fn(),
  onSync: jest.fn(),
  lastSynced: new Date('2026-06-08T12:00:00Z'),
  isSyncing: false,
};

describe('FilesTable', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── Heading ────────────────────────────────────────────────────────────────

  it('does not show "In my drive" heading when activeTab is "all"', () => {
    renderWithRouter(<FilesTable {...defaultProps} activeTab="all" />);
    expect(screen.queryByText('In my drive')).not.toBeInTheDocument();
  });

  it('shows "Pinned" heading when activeTab is "pinned"', () => {
    renderWithRouter(<FilesTable {...defaultProps} activeTab="pinned" />);
    expect(screen.getByText('Pinned')).toBeInTheDocument();
  });

  // ── Empty State ────────────────────────────────────────────────────────────

  it('shows empty state message when filteredItems is empty', () => {
    renderWithRouter(<FilesTable {...defaultProps} filteredItems={[]} />);
    expect(screen.getByText('No files or folders found here.')).toBeInTheDocument();
  });

  // ── Items Rendering ────────────────────────────────────────────────────────

  it('renders file name and metadata in the table', () => {
    renderWithRouter(<FilesTable {...defaultProps} filteredItems={[makeFile()]} />);
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('2h ago')).toBeInTheDocument();
    expect(screen.getByText('2.4 MB')).toBeInTheDocument();
  });

  it('renders a folder in the table', () => {
    renderWithRouter(<FilesTable {...defaultProps} filteredItems={[makeFolder()]} />);
    expect(screen.getByText('Marketing Assets')).toBeInTheDocument();
  });

  it('renders table column headers', () => {
    renderWithRouter(<FilesTable {...defaultProps} filteredItems={[makeFile()]} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Last Modified')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  // ── Callbacks ─────────────────────────────────────────────────────────────

  it('calls onItemClick when a row is clicked', () => {
    const onItemClick = jest.fn();
    const file = makeFile();
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[file]} onItemClick={onItemClick} />,
    );
    fireEvent.click(screen.getByText('report.pdf'));
    expect(onItemClick).toHaveBeenCalledWith(file);
  });

  it('calls onToggleStar when the pin button is clicked', () => {
    const onToggleStar = jest.fn();
    const file = makeFile();
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[file]} onToggleStar={onToggleStar} />,
    );
    fireEvent.click(screen.getByTitle('Pin'));
    expect(onToggleStar).toHaveBeenCalledWith(file, expect.any(Object));
  });

  it('calls onShare when share button is clicked for a file', () => {
    const onShare = jest.fn();
    const file = makeFile();
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[file]} onShare={onShare} />,
    );
    fireEvent.click(screen.getByTitle('Share Link'));
    expect(onShare).toHaveBeenCalledWith(file, expect.any(Object));
  });

  it('calls onDeleteFile when Delete File is clicked', () => {
    const onDeleteFile = jest.fn();
    const file = makeFile();
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[file]} onDeleteFile={onDeleteFile} />,
    );
    fireEvent.click(screen.getByTitle('Delete File'));
    expect(onDeleteFile).toHaveBeenCalledWith(file, expect.any(Object));
  });

  it('calls onDownload when Download File is clicked', () => {
    const onDownload = jest.fn();
    const file = makeFile();
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[file]} onDownload={onDownload} />,
    );
    fireEvent.click(screen.getByTitle('Download File'));
    expect(onDownload).toHaveBeenCalledWith(file, expect.any(Object));
  });

  it('calls onDeleteFolder when Delete Folder is clicked for a folder', () => {
    const onDeleteFolder = jest.fn();
    const folder = makeFolder();
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[folder]} onDeleteFolder={onDeleteFolder} />,
    );
    fireEvent.click(screen.getByTitle('Delete Folder'));
    expect(onDeleteFolder).toHaveBeenCalledWith(10, expect.any(Object));
  });

  // (Trash tab removed — all items are now removed via the ✕ button)

  it('hides the share button for folders', () => {
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[makeFolder()]} />,
    );
    expect(screen.queryByTitle('Share Link')).not.toBeInTheDocument();
  });

  it('shows "Unpin" title when item is pinned', () => {
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[makeFile({ starred: true })]} />,
    );
    expect(screen.getByTitle('Unpin')).toBeInTheDocument();
  });

  it('renders sync button and shows last synced text', () => {
    const onSync = jest.fn();
    const lastSynced = new Date('2026-06-08T12:00:00Z');
    renderWithRouter(
      <FilesTable
        {...defaultProps}
        onSync={onSync}
        lastSynced={lastSynced}
        isSyncing={false}
      />,
    );
    expect(screen.getByTitle('Sync folders')).toBeInTheDocument();
    expect(screen.getByText(/Last synced:/)).toBeInTheDocument();
  });

  it('calls onSync when sync button is clicked', () => {
    const onSync = jest.fn();
    renderWithRouter(
      <FilesTable
        {...defaultProps}
        onSync={onSync}
        isSyncing={false}
      />,
    );
    fireEvent.click(screen.getByTitle('Sync folders'));
    expect(onSync).toHaveBeenCalled();
  });

  it('disables sync button when isSyncing is true', () => {
    renderWithRouter(
      <FilesTable
        {...defaultProps}
        isSyncing={true}
      />,
    );
    expect(screen.getByTitle('Sync folders')).toBeDisabled();
  });
});
