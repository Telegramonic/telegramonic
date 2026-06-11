import { screen, fireEvent } from '@testing-library/react';
import { renderWithProvidersAndRouter } from '@testUtils';
import { TopNavBar } from '../TopNavBar';

// TopNavBar uses useCurrentUser() hook — mock the apiClient
jest.mock('@services/apiClient', () => ({
  apiClient: {
    getMe: jest.fn().mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      username: 'johndoe',
      phone: '+91123456789',
    }),
  },
}));

const defaultProps = {
  onUploadClick: jest.fn(),
  onCreateFolderClick: jest.fn(),
  currentFolderId: null as string | null,
};

describe('TopNavBar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the Telegramonic brand name', () => {
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} />);
    expect(screen.getByText('Telegramonic')).toBeInTheDocument();
  });

  it('renders the Upload and New Folder buttons', () => {
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
    expect(screen.getByText('+ New Folder')).toBeInTheDocument();
  });

  it('disables Upload File and enables New Folder at root level', () => {
    renderWithProvidersAndRouter(
      <TopNavBar {...defaultProps} currentFolderId={null} />,
    );
    expect(screen.getByText('Upload File').closest('button')).toBeDisabled();
    expect(
      screen.getByText('+ New Folder').closest('button'),
    ).not.toBeDisabled();
  });

  it('enables Upload File and disables New Folder inside a folder', () => {
    renderWithProvidersAndRouter(
      <TopNavBar {...defaultProps} currentFolderId="123" />,
    );
    expect(
      screen.getByText('Upload File').closest('button'),
    ).not.toBeDisabled();
    expect(screen.getByText('+ New Folder').closest('button')).toBeDisabled();
  });

  it('calls onUploadClick when Upload File button is clicked inside a folder', () => {
    const onUploadClick = jest.fn();
    renderWithProvidersAndRouter(
      <TopNavBar
        {...defaultProps}
        currentFolderId="123"
        onUploadClick={onUploadClick}
      />,
    );
    fireEvent.click(screen.getByText('Upload File'));
    expect(onUploadClick).toHaveBeenCalledTimes(1);
  });

  it('calls onCreateFolderClick when + New Folder button is clicked at root', () => {
    const onCreateFolderClick = jest.fn();
    renderWithProvidersAndRouter(
      <TopNavBar
        {...defaultProps}
        currentFolderId={null}
        onCreateFolderClick={onCreateFolderClick}
      />,
    );
    fireEvent.click(screen.getByText('+ New Folder'));
    expect(onCreateFolderClick).toHaveBeenCalledTimes(1);
  });
});
