import { screen } from '@testing-library/react';
import { renderWithRouter } from '@testUtils';
import { UploadProgressBanner } from '../UploadProgressBanner';

describe('UploadProgressBanner', () => {
  it('renders nothing when uploadingFile is null', () => {
    const { container } = renderWithRouter(
      <UploadProgressBanner uploadingFile={null} uploadProgress={0} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the file name when uploading', () => {
    renderWithRouter(
      <UploadProgressBanner uploadingFile="report.pdf" uploadProgress={42} />,
    );
    expect(screen.getByText(/Uploading report\.pdf\.\.\./)).toBeInTheDocument();
  });

  it('displays the upload percentage', () => {
    renderWithRouter(
      <UploadProgressBanner uploadingFile="video.mp4" uploadProgress={75} />,
    );
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders at 0% progress without crashing', () => {
    renderWithRouter(
      <UploadProgressBanner uploadingFile="file.zip" uploadProgress={0} />,
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders at 100% progress without crashing', () => {
    renderWithRouter(
      <UploadProgressBanner uploadingFile="final.docx" uploadProgress={100} />,
    );
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
