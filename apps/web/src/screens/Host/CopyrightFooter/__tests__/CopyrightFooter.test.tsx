import { renderWithRouter } from '@testUtils';
import CopyrightFooter from '../CopyrightFooter';

describe('CopyrightFooter', () => {
  it('should render', () => {
    const { container } = renderWithRouter(<CopyrightFooter />);

    expect(container).toMatchSnapshot();
  });
});
