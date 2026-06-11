import { screen } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import { Pinned } from '../Pinned';
import { DashboardItem } from '../../types';

const makeFile = (overrides: Partial<DashboardItem> = {}): DashboardItem => ({
  id: 'file-1',
  dbId: '1',
  name: 'report.pdf',
  type: 'document',
  owner: 'John Doe',
  lastModified: '2h ago',
  size: '2.4 MB',
  sizeBytes: 2516582,
  starred: true,
  inTrash: false,
  isFolder: false,
  ...overrides,
});

const defaultProps = {
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

describe('Pinned Board Screen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders Pinned heading and empty state message when no items', () => {
    renderWithRouter(<Pinned {...defaultProps} filteredItems={[]} />);
    expect(screen.getByText('Pinned')).toBeInTheDocument();
    expect(screen.getByText('No files or folders found here.')).toBeInTheDocument();
  });

  it('renders pinned item names correctly', () => {
    const items = [makeFile({ name: 'important_doc.docx' })];
    renderWithRouter(<Pinned {...defaultProps} filteredItems={items} />);
    expect(screen.getByText('important_doc.docx')).toBeInTheDocument();
  });
});
