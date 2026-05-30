import { Box, Button, Text } from '@chakra-ui/react';

export const CTASection = () => {
  return (
    <Box width="100%" maxW="1200px" mx="auto" px={6} py={16}>
      <Box
        bg="neutral.900"
        borderRadius="3xl"
        p={{ base: 8, md: 16 }}
        textAlign="center"
        color="white"
        position="relative"
        overflow="hidden"
        boxShadow="xl"
      >
        {/* Decorative blurred background blobs inside the card */}
        <Box
          position="absolute"
          top="-4rem"
          right="-4rem"
          width="16rem"
          height="16rem"
          bg="primary"
          opacity={0.25}
          borderRadius="full"
          filter="blur(60px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-4rem"
          left="-4rem"
          width="16rem"
          height="16rem"
          bg="success.300"
          opacity={0.2}
          borderRadius="full"
          filter="blur(60px)"
          pointerEvents="none"
        />

        <Box
          position="relative"
          zIndex={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={6}
        >
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="extrabold"
            lineHeight="tight"
          >
            Ready to upgrade your storage?
          </Text>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="neutral.300"
            maxW="2xl"
            mx="auto"
            lineHeight="relaxed"
          >
            Join thousands of users who have moved their entire digital life to
            the cloud without paying a dime.
          </Text>
          <Button
            size="lg"
            bg="primary"
            color="white"
            borderRadius="lg"
            px={8}
            py={6}
            fontWeight="bold"
            shadow="md"
            mt={4}
            _hover={{ bg: 'primary/90' }}
          >
            Create Your Drive
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
