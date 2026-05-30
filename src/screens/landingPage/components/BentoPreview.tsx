import { Box, SimpleGrid, Text, Image } from '@chakra-ui/react';

const SpeedIcon = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="24"
    height="24"
    {...props}
  >
    <path d="M22 12A10 10 0 1 1 12 2v4a6 6 0 1 0 6 6z" />
    <path d="m19 5.07-4.3 4.29" />
  </svg>
);

export const BentoPreview = () => {
  return (
    <Box width="100%" maxW="1200px" mx="auto" px={6} py={8} mt={8}>
      <SimpleGrid columns={{ base: 1, md: 12 }} gap={6}>
        {/* Dashboard Image Card (8/12 cols) */}
        <Box
          gridColumn={{ base: 'span 1', md: 'span 8' }}
          height="320px"
          borderRadius="xl"
          overflow="hidden"
          borderWidth="1px"
          borderColor="border"
          boxShadow="lg"
          position="relative"
          _hover={{ transform: 'scale(1.01)' }}
          transition="all 0.2s"
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmZcBkur3CsmMPaGhR0W13Slx0eJNohmGuC665cYbAt1uhiUXbdcjXZIhGABzcAmkr0eheScF3RS0k1fz8qmq7YP1EKEnnUR3nUcEWV9oZwQEev9xIkGmrdc-_eT0U9Qn-aN6y0MXegEDf7pgUHxVAdKXVXTN3b5dnPd_A18yCa6ndpbxFFxvdi2ze0yLV3uFML1in12s_rlK-mrIiJpfj0n0WvRfOLEnN5HfgytBqzpFQh3TJIOJvLuAem85WaRuUAkwtn6CyIwg"
            alt="Telegramonic Dashboard Preview"
            width="100%"
            height="100%"
            objectFit="cover"
          />
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, blackAlpha.200, transparent)"
            pointerEvents="none"
          />
        </Box>

        {/* Feature description card (4/12 cols) */}
        <Box
          gridColumn={{ base: 'span 1', md: 'span 4' }}
          height="320px"
          bg="bg.panel"
          borderRadius="xl"
          p={8}
          borderWidth="1px"
          borderColor="border"
          boxShadow="sm"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          gap={4}
        >
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg="primary/15"
            color="primary"
            borderRadius="lg"
          >
            <SpeedIcon />
          </Box>
          <Text fontSize="lg" fontWeight="bold" color="fg">
            Turbocharged Transfers
          </Text>
          <Text fontSize="sm" color="fg.muted" lineHeight="tall">
            Utilizing Telegram&apos;s MTProto for encrypted, multi-threaded data
            streams that saturate your bandwidth.
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
