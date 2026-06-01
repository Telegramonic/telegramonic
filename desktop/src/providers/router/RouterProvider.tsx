import { RouterProvider as RouterProviderReactDom } from 'react-router-dom';
import { getAppRouter } from '@routes';
import { appStore, selectIsAuthenticated } from '@appStore';

const RouterProvider = () => {
  const isAuthenticated = appStore(selectIsAuthenticated);
  return <RouterProviderReactDom router={getAppRouter(isAuthenticated)} />;
};

export default RouterProvider;
