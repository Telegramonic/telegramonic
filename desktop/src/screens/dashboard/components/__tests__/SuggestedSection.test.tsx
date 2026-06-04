import { forwardRef } from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import { SuggestedSection } from '../SuggestedSection';
import { FileMetadata } from '@services';

// SuggestedSection uses Icon which may trigger asset imports — mock framer-motion if needed
jest.mock('framer-motion', () => {
  const React = require('react');
  const MockDiv = forwardRef(({ children, ...props }: any, ref: any) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));
  MockDiv.displayName = 'MockDiv';
  return {
    motion: { div: MockDiv },
    AnimatePresence: ({ children }: any) => children,
  };
});

const makeFile = (overrides: Partial<FileMetadata> = {}): FileMetadata => ({
  id: 1,
  name: 'design.pdf',
  size: 1024 * 1024,
  mime_type: 'application/pdf',
  file_ext: 'pdf',
  created_at: new Date().toISOString(),
  icon_type: 'pdf',
  ...overrides,
});

const defaultProps = {
  activeTab: 'all' as const,
  currentFolderId: null,
  suggestedFiles: [],
  ownerName: 'John Doe',
  starredIds: [],
  trashIds: [],
  onItemClick: jest.fn(),
  onShare: jest.fn(),
  onUploadTrigger: jest.fn(),
  onCreateFolderTrigger: jest.fn(),
  onShowToast: jest.fn(),
};

describe('SuggestedSection', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── Visibility Guard ───────────────────────────────────────────────────────

  it('renders nothing when activeTab is not "all"', () => {
    const { container } = renderWithRouter(
      <SuggestedSection {...defaultProps} activeTab="recent" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when inside a folder (currentFolderId is set)', () => {
    const { container } = renderWithRouter(
      <SuggestedSection {...defaultProps} currentFolderId={5} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the "Suggested Files" heading on the all-files root view', () => {
    renderWithRouter(<SuggestedSection {...defaultProps} />);
    expect(screen.getByText('Suggested Files')).toBeInTheDocument();
  });

  // ── Empty State CTAs ───────────────────────────────────────────────────────

  it('shows Upload File CTA card when no files exist', () => {
    renderWithRouter(<SuggestedSection {...defaultProps} suggestedFiles={[]} />);
    expect(screen.getByText('Upload your first document or media')).toBeInTheDocument();
  });

  it('shows Create Folder CTA card when no files exist', () => {
    renderWithRouter(<SuggestedSection {...defaultProps} suggestedFiles={[]} />);
    expect(screen.getByText('Organize your files in subdirectories')).toBeInTheDocument();
  });

  it('calls onUploadTrigger when the Upload File card is clicked', () => {
    const onUploadTrigger = jest.fn();
    renderWithRouter(
      <SuggestedSection {...defaultProps} onUploadTrigger={onUploadTrigger} />,
    );
    // Click the card containing "Upload File" text
    fireEvent.click(screen.getByText('Upload File'));
    expect(onUploadTrigger).toHaveBeenCalledTimes(1);
  });

  it('calls onCreateFolderTrigger when the New Folder card is clicked', () => {
    const onCreateFolderTrigger = jest.fn();
    renderWithRouter(
      <SuggestedSection {...defaultProps} onCreateFolderTrigger={onCreateFolderTrigger} />,
    );
    fireEvent.click(screen.getByText('New Folder'));
    expect(onCreateFolderTrigger).toHaveBeenCalledTimes(1);
  });

  // ── File Cards ─────────────────────────────────────────────────────────────

  it('renders a suggested file card with the file name', () => {
    renderWithRouter(
      <SuggestedSection {...defaultProps} suggestedFiles={[makeFile()]} />,
    );
    expect(screen.getByText('design.pdf')).toBeInTheDocument();
  });

  it('renders multiple suggested file cards', () => {
    const files = [makeFile({ id: 1, name: 'a.pdf' }), makeFile({ id: 2, name: 'b.mp4', file_ext: 'mp4' })];
    renderWithRouter(<SuggestedSection {...defaultProps} suggestedFiles={files} />);
    expect(screen.getByText('a.pdf')).toBeInTheDocument();
    expect(screen.getByText('b.mp4')).toBeInTheDocument();
  });

  it('calls onItemClick when a file card is clicked', () => {
    const onItemClick = jest.fn();
    renderWithRouter(
      <SuggestedSection
        {...defaultProps}
        suggestedFiles={[makeFile()]}
        onItemClick={onItemClick}
      />,
    );
    // Click on the file card (by its name text)
    fireEvent.click(screen.getByText('design.pdf'));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });
});
