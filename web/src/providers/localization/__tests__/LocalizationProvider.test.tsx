import { render, renderHook } from '@testing-library/react';
import LocalizationProvider from '../LocalizationProvider';
import { useTranslation } from 'react-i18next';

describe('LocalizationProvider', () => {
  it('should render correctly', async () => {
    const { result } = renderHook(() => useTranslation());
    const { container } = render(
      <LocalizationProvider>
        <div> {result.current.t('App')} </div>
      </LocalizationProvider>,
    );

    await jest.runAllTimersAsync();

    expect(container).toMatchSnapshot();
  });
});
