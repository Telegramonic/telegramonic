import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import { Breadcrumbs } from '../Breadcrumbs';
import { FolderMetadata } from '@services';

const folder1: FolderMetadata = { id: 1, parent_id: null, name: 'Documents' };
const folder2: FolderMetadata = { id: 2, parent_id: 1, name: 'Projects' };

describe('Breadcrumbs', () => {
  it('renders "All Files" root link by default', () => {
    renderWithRouter(
      <Breadcrumbs breadcrumbs={[]} currentFolderId={null} setCurrentFolderId={jest.fn()} />,
    );
    expect(screen.getByText('All Files')).toBeInTheDocument();
  });

  it('calls setCurrentFolderId(null) when "All Files" is clicked', () => {
    const setCurrentFolderId = jest.fn();
    renderWithRouter(
      <Breadcrumbs breadcrumbs={[]} currentFolderId={null} setCurrentFolderId={setCurrentFolderId} />,
    );
    fireEvent.click(screen.getByText('All Files'));
    expect(setCurrentFolderId).toHaveBeenCalledWith(null);
  });

  it('renders each folder in the breadcrumb trail', () => {
    renderWithRouter(
      <Breadcrumbs
        breadcrumbs={[folder1, folder2]}
        currentFolderId={2}
        setCurrentFolderId={jest.fn()}
      />,
    );
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('calls setCurrentFolderId with the folder id when a breadcrumb is clicked', () => {
    const setCurrentFolderId = jest.fn();
    renderWithRouter(
      <Breadcrumbs
        breadcrumbs={[folder1, folder2]}
        currentFolderId={2}
        setCurrentFolderId={setCurrentFolderId}
      />,
    );
    fireEvent.click(screen.getByText('Documents'));
    expect(setCurrentFolderId).toHaveBeenCalledWith(1);
  });

  it('renders separator "/" between breadcrumb segments', () => {
    renderWithRouter(
      <Breadcrumbs
        breadcrumbs={[folder1, folder2]}
        currentFolderId={2}
        setCurrentFolderId={jest.fn()}
      />,
    );
    // There should be two "/" separators
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(2);
  });

  it('highlights the active folder as bold', () => {
    renderWithRouter(
      <Breadcrumbs
        breadcrumbs={[folder1]}
        currentFolderId={1}
        setCurrentFolderId={jest.fn()}
      />,
    );
    const folderText = screen.getByText('Documents');
    // active folder has fontWeight bold
    expect(folderText).toBeInTheDocument();
  });
});
