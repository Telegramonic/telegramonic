import { renderWithProviders } from '@testUtils';
import LoadingComponent from '../LoadingComponent';

describe('Loading Component', () => {
  it('should render correctly', () => {
    const { container } = renderWithProviders(<LoadingComponent />);

    expect(container).toMatchSnapshot();
  });
});
