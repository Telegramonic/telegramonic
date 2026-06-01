import { fireEvent, screen, act } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { renderWithRouter } from '@testUtils';
import { appStore } from '@appStore';

// Mock framer-motion to render plain HTML elements in tests to avoid animation lag/timing issues
jest.mock('framer-motion', () => {
  const React = require('react');
  const MockDiv = React.forwardRef(({ children, ...props }: any, ref: any) => (
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

  it('should render Dashboard screen successfully with default elements', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Telegramonic')).toBeInTheDocument();
    expect(screen.getByText('Suggested Files')).toBeInTheDocument();
    expect(screen.getAllByText('All Files').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('My Storage')).toBeInTheDocument();
    expect(screen.getByText('Project_Requirements_v2.pdf')).toBeInTheDocument();
    expect(screen.getByText('Marketing Assets')).toBeInTheDocument();
  });

  it('should filter files based on search query', () => {
    renderWithRouter(<Dashboard />);
    const searchInput = screen.getByPlaceholderText('Search files, folders...');
    fireEvent.change(searchInput, { target: { value: 'Marketing' } });
    expect(screen.getByText('Marketing Assets')).toBeInTheDocument();
    expect(screen.queryByText('Project_Requirements_v2.pdf')).not.toBeInTheDocument();
  });

  it('should toggle file star status when clicking star button', () => {
    renderWithRouter(<Dashboard />);
    const starButtons = screen.getAllByTitle('Star File');
    // First unstarred file is Marketing Assets at index 0 of unstarred buttons
    fireEvent.click(starButtons[0]);
    expect(screen.getByText('Starred: Marketing Assets')).toBeInTheDocument();
  });

  it('should delete a file and move it to trash when clicking delete button', () => {
    renderWithRouter(<Dashboard />);
    const deleteButtons = screen.getAllByTitle('Move to Trash');
    fireEvent.click(deleteButtons[0]); // delete Project_Requirements_v2.pdf
    expect(screen.getByText('Moved to trash: Project_Requirements_v2.pdf')).toBeInTheDocument();
    expect(screen.queryByText('Project_Requirements_v2.pdf')).not.toBeInTheDocument();
  });

  it('should filter files on tab switching', () => {
    renderWithRouter(<Dashboard />);
    // Switch to Starred tab
    fireEvent.click(screen.getByText('Starred'));
    expect(screen.getByText('Project_Requirements_v2.pdf')).toBeInTheDocument();
    expect(screen.queryByText('Marketing Assets')).not.toBeInTheDocument();
  });

  it('should copy link to clipboard when clicking share button', () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    renderWithRouter(<Dashboard />);
    const shareButtons = screen.getAllByRole('button', { name: 'Share Link' });
    fireEvent.click(shareButtons[0]);

    expect(mockWriteText).toHaveBeenCalledWith('https://telegramonic.cloud/share/1');
  });

  it('should simulate uploading a file successfully using fake timers', () => {
    jest.useFakeTimers();
    renderWithRouter(<Dashboard />);

    // Click upload
    fireEvent.click(screen.getByRole('button', { name: 'Upload File' }));

    // Run timer to complete 100% progress and final creation delay
    act(() => {
      for (let i = 0; i < 11; i++) {
        jest.advanceTimersByTime(100);
      }
    });
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Check if new file is in documents
    expect(screen.getByText(/Uploaded successfully:/)).toBeInTheDocument();

    jest.useRealTimers();
  });
});
