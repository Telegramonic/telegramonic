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
  onDeleteFolder: jest.fn(),
  onToggleTrash: jest.fn(),
};

describe('FilesTable', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── Heading ────────────────────────────────────────────────────────────────

  it('shows "All Files" heading when activeTab is "all"', () => {
    renderWithRouter(<FilesTable {...defaultProps} activeTab="all" />);
    expect(screen.getByText('All Files')).toBeInTheDocument();
  });

  it('shows "Recent Files" heading when activeTab is "recent"', () => {
    renderWithRouter(<FilesTable {...defaultProps} activeTab="recent" />);
    expect(screen.getByText('Recent Files')).toBeInTheDocument();
  });

  it('shows "Starred Files" heading when activeTab is "starred"', () => {
    renderWithRouter(<FilesTable {...defaultProps} activeTab="starred" />);
    expect(screen.getByText('Starred Files')).toBeInTheDocument();
  });

  it('shows "Trash explorer" heading when activeTab is "trash"', () => {
    renderWithRouter(<FilesTable {...defaultProps} activeTab="trash" />);
    expect(screen.getByText('Trash explorer')).toBeInTheDocument();
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

  it('calls onToggleStar when the star button is clicked', () => {
    const onToggleStar = jest.fn();
    const file = makeFile();
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[file]} onToggleStar={onToggleStar} />,
    );
    fireEvent.click(screen.getByTitle('Star File'));
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

  it('calls onToggleTrash when Move to Trash is clicked', () => {
    const onToggleTrash = jest.fn();
    const file = makeFile();
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[file]} onToggleTrash={onToggleTrash} />,
    );
    fireEvent.click(screen.getByTitle('Move to Trash'));
    expect(onToggleTrash).toHaveBeenCalledWith(file, expect.any(Object));
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

  // ── Trash Tab Behaviour ────────────────────────────────────────────────────

  it('shows "Restore File" button instead of "Move to Trash" on trash tab', () => {
    renderWithRouter(
      <FilesTable {...defaultProps} activeTab="trash" filteredItems={[makeFile({ inTrash: true })]} />,
    );
    expect(screen.getByTitle('Restore File')).toBeInTheDocument();
    expect(screen.queryByTitle('Move to Trash')).not.toBeInTheDocument();
  });

  it('hides the share button for folders', () => {
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[makeFolder()]} />,
    );
    expect(screen.queryByTitle('Share Link')).not.toBeInTheDocument();
  });

  // ── Starred State ──────────────────────────────────────────────────────────

  it('shows "Remove Star" title when item is starred', () => {
    renderWithRouter(
      <FilesTable {...defaultProps} filteredItems={[makeFile({ starred: true })]} />,
    );
    expect(screen.getByTitle('Remove Star')).toBeInTheDocument();
  });
});
