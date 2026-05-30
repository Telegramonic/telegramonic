import { render } from '@testing-library/react';

import { IconDay, IconTelegramonic, IconNight } from '../IconsAssets';

describe('Icons', () => {
  it('should render IconDay icon', () => {
    const { container } = render(<IconDay />);
    expect(container).toMatchSnapshot();
  });

  it('should render IconTelegramonic icon', () => {
    const { container } = render(<IconTelegramonic />);
    expect(container).toMatchSnapshot();
  });

  it('should render IconNight icon', () => {
    const { container } = render(<IconNight />);
    expect(container).toMatchSnapshot();
  });
});
