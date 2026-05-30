import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { CopyrightFooter } from './CopyrightFooter';
import { NavigationBar } from './NavigationBar';

const Host = () => {
  return (
    <Box minH={'100vh'}>
      <NavigationBar />
      <Outlet />
      <CopyrightFooter />
    </Box>
  );
};

export default Host;
