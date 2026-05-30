import { Box, SimpleGrid, Text } from '@chakra-ui/react';

export const StatsSection = () => {
  return (
    <Box
      width="100%"
      bg="bg.muted"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor="border"
      py={12}
      px={6}
    >
      <Box width="100%" maxW="1200px" mx="auto">
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={8} textAlign="center">
          <Box display="flex" flexDirection="column" gap={1}>
            <Text
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="extrabold"
              color="primary"
            >
              800M+
            </Text>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="fg.muted"
              letterSpacing="widest"
              textTransform="uppercase"
            >
              Telegram Users
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Text
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="extrabold"
              color="primary"
            >
              2GB+
            </Text>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="fg.muted"
              letterSpacing="widest"
              textTransform="uppercase"
            >
              Single File Limit
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Text
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="extrabold"
              color="primary"
            >
              0$
            </Text>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="fg.muted"
              letterSpacing="widest"
              textTransform="uppercase"
            >
              Monthly Cost
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Text
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="extrabold"
              color="primary"
            >
              99.9%
            </Text>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="fg.muted"
              letterSpacing="widest"
              textTransform="uppercase"
            >
              Uptime Record
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
