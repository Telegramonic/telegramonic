import { renderWithRouter } from '@testUtils';
import NavigationBar from '../NavigationBar';

describe('NavigationBar', () => {
  it('should render', () => {
    const { container } = renderWithRouter(<NavigationBar />);

    expect(container).toMatchSnapshot();
  });
});
