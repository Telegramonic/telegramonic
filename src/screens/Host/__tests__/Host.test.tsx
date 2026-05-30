import Host from '../Host';
import { renderWithRouter } from '@testUtils';

describe('Host', () => {
  it('should render correctly', () => {
    const { container } = renderWithRouter(<Host />);

    expect(container).toMatchSnapshot();
  });
});
