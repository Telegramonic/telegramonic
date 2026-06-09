import { screen, waitFor } from '@testing-library/react';
import MdPreview from '../MdPreview';
import { renderWithRouter } from '../../../testUtils/renderUtils';

describe('MdPreview', () => {
  it('should render empty MdPreview', () => {
    const { container } = renderWithRouter(<MdPreview mdString={''} />);
    expect(container).toBeTruthy();
  });

  it('should render MdPreview with content', () => {
    renderWithRouter(<MdPreview mdString={'# Test Content'} />);
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
    expect(screen.getByText('# Test Content')).toBeInTheDocument();
  });

  it('should add target="_blank" and noopener noreferrer to links on render', () => {
    renderWithRouter(<MdPreview mdString={'[Link](https://google.com)'} />);
    const link = screen.getByText('Link') as HTMLAnchorElement;
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
  });

  it('should render mermaid diagram when language-mermaid block is provided', async () => {
    renderWithRouter(
      <MdPreview mdString={'```mermaid\ngraph TD;\nA-->B;\n```'} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-mermaid')).toBeInTheDocument();
    });
    expect(screen.getByText('Mock Diagram')).toBeInTheDocument();
  });
});
