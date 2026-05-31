import { Flex, Spinner } from '@chakra-ui/react';

const LoadingComponent = () => {
  return (
    <Flex height={'100vh'} justifyContent={'center'} alignItems={'center'}>
      <Spinner
        borderWidth="4px"
        animationDuration="0.65s"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
};

export default LoadingComponent;
