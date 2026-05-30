import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

import { CopyrightFooter } from './CopyrightFooter';
import { NavigationBar } from './NavigationBar';

const Host = () => {
  return (
    <Box minH={'100vh'} display="flex" flexDirection="column">
      <NavigationBar />
      <Box flex={1} display="flex" flexDirection="column">
        <Outlet />
      </Box>
      <CopyrightFooter />
    </Box>
  );
};

export default Host;
