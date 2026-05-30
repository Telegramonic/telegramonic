import { renderWithProviders } from '@testUtils';
import SearchModal from '../SearchModal';

describe('Search modal', () => {
  it('Should render correctly', () => {
    const { container } = renderWithProviders(<SearchModal />);

    expect(container).toMatchSnapshot();
  });
});
