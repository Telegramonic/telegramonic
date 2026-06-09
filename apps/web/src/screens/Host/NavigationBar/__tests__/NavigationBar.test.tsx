import { act, screen } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { renderWithRouter } from '@testUtils';
import { appStore } from '@appStore';
import NavigationBar from '../NavigationBar';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('NavigationBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/' });
    act(() => {
      appStore.getState().clearApiCredentials();
    });
  });

  it('should render standard navigation bar correctly', () => {
    const { container } = renderWithRouter(<NavigationBar />);
    expect(container).toMatchSnapshot();
  });

  it('should show page title text for about-us path', () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/about-us' });
    renderWithRouter(<NavigationBar />);
    expect(screen.getByTestId('nav-page-title')).toBeInTheDocument();
    expect(screen.getByTestId('nav-page-title')).toHaveTextContent('About Us');
  });
});
