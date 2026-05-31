import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@components';
import ProductPage from '../ProductPage';

const renderProductPage = () => {
  return render(
    <ChakraProvider value={system}>
      <ProductPage />
    </ChakraProvider>,
  );
};

describe('ProductPage', () => {
  let originalUserAgent: string;

  beforeAll(() => {
    originalUserAgent = window.navigator.userAgent;
  });

  afterEach(() => {
    // Reset userAgent mock
    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
  });

  it('should render all platform cards and download options by default', () => {
    const { container } = renderProductPage();

    // Renders hero section
    expect(screen.getByText('Get Telegramonic')).toBeInTheDocument();
    expect(
      screen.getByText(/Run Telegramonic on all your devices/i),
    ).toBeInTheDocument();

    // Renders desktop category
    expect(screen.getByText('Desktop Applications')).toBeInTheDocument();
    expect(screen.getByText('macOS')).toBeInTheDocument();
    expect(screen.getByText('Windows')).toBeInTheDocument();
    expect(screen.getByText('Linux')).toBeInTheDocument();

    // Renders mobile category
    expect(screen.getByText('Mobile Applications')).toBeInTheDocument();
    expect(screen.getByText('iOS / iPadOS')).toBeInTheDocument();
    expect(screen.getByText('Android')).toBeInTheDocument();

    // Check presence of specific download buttons/links
    expect(screen.getByText('Apple Silicon (M1/M2/M3)')).toBeInTheDocument();
    expect(screen.getByText('Intel Chip')).toBeInTheDocument();
    expect(screen.getByText('Download Installer (.exe)')).toBeInTheDocument();
    expect(screen.getByText('Portable Zip (.zip)')).toBeInTheDocument();
    expect(screen.getByText('Download AppImage')).toBeInTheDocument();
    expect(screen.getByText('Tarball (.tar.gz)')).toBeInTheDocument();
    expect(screen.getByText('Download on App Store')).toBeInTheDocument();
    expect(screen.getByText('Join TestFlight Beta')).toBeInTheDocument();
    expect(screen.getByText('Direct APK Download')).toBeInTheDocument();
    expect(screen.getByText('Get it on Google Play')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('should recommend macOS when userAgent is macOS', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      writable: true,
      configurable: true,
    });

    renderProductPage();

    // Find "Recommended" badges
    const badges = screen.getAllByText('Recommended');
    expect(badges.length).toBe(1);

    // Check macOS is recommended
    const macCard = screen.getByTestId('platform-card-macos');
    expect(macCard).toContainElement(badges[0]);
  });

  it('should recommend Windows when userAgent is Windows', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      writable: true,
      configurable: true,
    });

    renderProductPage();

    const badges = screen.getAllByText('Recommended');
    expect(badges.length).toBe(1);

    const winCard = screen.getByTestId('platform-card-windows');
    expect(winCard).toContainElement(badges[0]);
  });

  it('should recommend Linux when userAgent is Linux', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (X11; Linux x86_64)',
      writable: true,
      configurable: true,
    });

    renderProductPage();

    const badges = screen.getAllByText('Recommended');
    expect(badges.length).toBe(1);

    const linuxCard = screen.getByTestId('platform-card-linux');
    expect(linuxCard).toContainElement(badges[0]);
  });

  it('should recommend Android when userAgent is Android', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; SM-A505F)',
      writable: true,
      configurable: true,
    });

    renderProductPage();

    const badges = screen.getAllByText('Recommended');
    expect(badges.length).toBe(1);

    const androidCard = screen.getByTestId('platform-card-android');
    expect(androidCard).toContainElement(badges[0]);
  });

  it('should recommend iOS when userAgent is iPhone', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)',
      writable: true,
      configurable: true,
    });

    renderProductPage();

    const badges = screen.getAllByText('Recommended');
    expect(badges.length).toBe(1);

    const iosCard = screen.getByTestId('platform-card-ios');
    expect(iosCard).toContainElement(badges[0]);
  });
});
