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
  searchQuery: '',
  setSearchQuery: jest.fn(),
  onUploadClick: jest.fn(),
  onCreateFolderClick: jest.fn(),
};

describe('TopNavBar', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the Telegramonic brand name', () => {
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} />);
    expect(screen.getByText('Telegramonic')).toBeInTheDocument();
  });

  it('renders the search input with placeholder', () => {
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search files, folders...')).toBeInTheDocument();
  });

  it('calls setSearchQuery when user types in the search input', () => {
    const setSearchQuery = jest.fn();
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} setSearchQuery={setSearchQuery} />);
    const input = screen.getByPlaceholderText('Search files, folders...');
    fireEvent.change(input, { target: { value: 'my-file' } });
    expect(setSearchQuery).toHaveBeenCalledWith('my-file');
  });

  it('reflects the current search query as the input value', () => {
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} searchQuery="hello" />);
    const input = screen.getByPlaceholderText('Search files, folders...');
    expect(input).toHaveValue('hello');
  });

  it('renders the Upload and New Folder buttons', () => {
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
    expect(screen.getByText('+ New Folder')).toBeInTheDocument();
  });

  it('calls onUploadClick when Upload File button is clicked', () => {
    const onUploadClick = jest.fn();
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} onUploadClick={onUploadClick} />);
    fireEvent.click(screen.getByText('Upload File'));
    expect(onUploadClick).toHaveBeenCalledTimes(1);
  });

  it('calls onCreateFolderClick when + New Folder button is clicked', () => {
    const onCreateFolderClick = jest.fn();
    renderWithProvidersAndRouter(
      <TopNavBar {...defaultProps} onCreateFolderClick={onCreateFolderClick} />,
    );
    fireEvent.click(screen.getByText('+ New Folder'));
    expect(onCreateFolderClick).toHaveBeenCalledTimes(1);
  });

  it('displays the logged-in user initials (JD) when user data resolves', async () => {
    renderWithProvidersAndRouter(<TopNavBar {...defaultProps} />);
    // Initials derived from first_name[0] + last_name[0] → "JD"
    expect(await screen.findByText('JD')).toBeInTheDocument();
  });
});
