import LandingPage from '../LandingPage';
import { renderWithRouter } from '@testUtils';

describe('LandingPage', () => {
  it('should render correctly', () => {
    const { container } = renderWithRouter(<LandingPage />);

    expect(container).toMatchSnapshot();
  });
});
