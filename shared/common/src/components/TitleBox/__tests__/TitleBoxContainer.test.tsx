import { renderWithProviders } from '@testUtils';

import TitleBoxContainer from '../TitleBoxContainer';

const title = 'Test Title';
const icon = 'test-icon';
const props = {
  title,
  icon,
  children: 'Test Children',
};

describe('TitleBoxContainer', () => {
  it('should set the document title', () => {
    // Act
    const { container } = renderWithProviders(<TitleBoxContainer {...props} />);

    expect(container).toMatchSnapshot();
  });
});
