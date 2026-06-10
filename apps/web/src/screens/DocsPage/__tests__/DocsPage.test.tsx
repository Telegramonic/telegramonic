import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { system } from '@components';
import DocsPage from '../DocsPage';

jest.mock('@components/MdPreview', () => ({
  MdPreview: ({ mdString }: { mdString: string }) => (
    <div data-testid="markdown-preview">{mdString}</div>
  ),
  getMdFileDataInString: (path: string, callback: (data: string) => void) => {
    // Provide standard markdown headings to test the TOC parser
    callback(
      '# Introduction\n## Installation Guide\n### API Credentials\n## Storing Data',
    );
  },
}));

const renderDocsPage = (docId = 'introduction') => {
  return render(
    <ChakraProvider value={system}>
      <MemoryRouter initialEntries={[`/docs/${docId}`]}>
        <Routes>
          <Route path="/docs/:docId" element={<DocsPage />} />
        </Routes>
      </MemoryRouter>
    </ChakraProvider>,
  );
};

describe('DocsPage', () => {
  it('should render the documentation layout with sidebar and TOC', () => {
    const { container } = renderDocsPage('introduction');

    // Renders the main title
    expect(screen.getByText('Docs - Introduction')).toBeInTheDocument();

    // Renders sidebar categories
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getAllByText('Version History')[0]).toBeInTheDocument();

    // Renders sidebar items
    expect(screen.getAllByText('Introduction')[0]).toBeInTheDocument();
    expect(screen.getByText('Quick Start')).toBeInTheDocument();
    expect(screen.getByText('Setup Guide')).toBeInTheDocument();
    expect(screen.getByText('Desktop')).toBeInTheDocument();
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('MTProto Protocol')).toBeInTheDocument();
    expect(screen.getByText('Direct Storage')).toBeInTheDocument();

    // Verification of right-column "In this Page" TOC headings
    expect(screen.getByText('In this Page')).toBeInTheDocument();
    expect(screen.getByText('Installation Guide')).toBeInTheDocument();
    expect(screen.getByText('API Credentials')).toBeInTheDocument();
    expect(screen.getByText('Storing Data')).toBeInTheDocument();

    // Verify snapshot
    expect(container).toMatchSnapshot();
  });

  it('should switch active document and scroll to heading on TOC click', () => {
    renderDocsPage('introduction');

    // Click on Quick Start link
    const quickStartLink = screen.getByText('Quick Start');
    fireEvent.click(quickStartLink);

    // Verify heading click scroll trigger
    const tocHeading = screen.getByText('Installation Guide');

    // Mock scrollIntoView
    const scrollIntoViewMock = jest.fn();
    const mockElement = document.createElement('div');
    mockElement.id = 'installation-guide';
    mockElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(mockElement);

    fireEvent.click(tocHeading);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });

    // Clean up
    document.body.removeChild(mockElement);
  });
});
