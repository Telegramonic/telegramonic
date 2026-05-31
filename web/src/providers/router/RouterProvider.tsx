import { RouterProvider as RouterProviderReactDom } from 'react-router-dom';
import { getAppRouter } from '@routes';

const RouterProvider = () => {
  // Get the auth token from the context
  return <RouterProviderReactDom router={getAppRouter(true)} />;
};

export default RouterProvider;
