import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

// Custom SVG Icons mapping to design system
const CloudIcon = ({ w, h, ...props }: any) => (
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
    <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.54-1.92-2.18-3.5-4.5-3.5C8 7.5 5 10 5 13.5c-1.5.5-2.5 2-2.5 3.5A3.5 3.5 0 0 0 6 20.5h11.5" />
    <path d="m9 13 2 2 4-4" />
  </svg>
);

const ShieldIcon = ({ w, h, ...props }: any) => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
    <path d="M10 11V9a2 2 0 0 1 4 0v2" />
  </svg>
);

const BoltIcon = ({ w, h, ...props }: any) => (
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
    <path d="M13 2 L3 14 h9 l-1 8 L21 10 h-9 Z" />
  </svg>
);

const SyncIcon = ({ w, h, ...props }: any) => (
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
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

export const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <Box id="features" width="100%" maxW="1200px" mx="auto" px={6} py={16}>
      <Box textAlign="center" mb={12}>
        <Text
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="bold"
          color="fg"
          mb={3}
        >
          {t('LandingPage.features.title')}
        </Text>
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="fg.muted"
          maxW="2xl"
          mx="auto"
        >
          {t('LandingPage.features.subtitle')}
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {/* Feature 1: Infinite Storage (2/3 columns) */}
        <Box
          gridColumn={{ base: 'span 1', md: 'span 2' }}
          bg="bg.panel"
          borderRadius="xl"
          p={8}
          borderWidth="1px"
          borderColor="border"
          boxShadow="sm"
          _hover={{ boxShadow: 'md' }}
          transition="all 0.2s"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w={12}
              h={12}
              bg="primary/15"
              color="primary"
              borderRadius="lg"
              mb={6}
            >
              <CloudIcon w={6} h={6} />
            </Box>
            <Text fontSize="lg" fontWeight="bold" color="fg" mb={3}>
              {t('LandingPage.features.infinite.title')}
            </Text>
            <Text fontSize="sm" color="fg.muted" lineHeight="tall">
              {t('LandingPage.features.infinite.description')}
            </Text>
          </Box>
        </Box>

        {/* Feature 2: Bank-Grade Security (1/3 column) */}
        <Box
          id="security"
          bg="bg.panel"
          borderRadius="xl"
          p={8}
          borderWidth="1px"
          borderColor="border"
          boxShadow="sm"
          _hover={{ boxShadow: 'md' }}
          transition="all 0.2s"
        >
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg="bg.muted"
            color="fg"
            borderRadius="lg"
            mb={6}
          >
            <ShieldIcon w={6} h={6} />
          </Box>
          <Text fontSize="lg" fontWeight="bold" color="fg" mb={3}>
            {t('LandingPage.features.security.title')}
          </Text>
          <Text fontSize="sm" color="fg.muted" lineHeight="tall">
            {t('LandingPage.features.security.description')}
          </Text>
        </Box>

        {/* Feature 3: Turbocharged Transfers (1/3 column) */}
        <Box
          bg="bg.panel"
          borderRadius="xl"
          p={8}
          borderWidth="1px"
          borderColor="border"
          boxShadow="sm"
          _hover={{ boxShadow: 'md' }}
          transition="all 0.2s"
        >
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg="success.100"
            color="success.400"
            borderRadius="lg"
            mb={6}
          >
            <BoltIcon w={6} h={6} />
          </Box>
          <Text fontSize="lg" fontWeight="bold" color="fg" mb={3}>
            {t('LandingPage.features.transfers.title')}
          </Text>
          <Text fontSize="sm" color="fg.muted" lineHeight="tall">
            {t('LandingPage.features.transfers.description')}
          </Text>
        </Box>

        {/* Feature 4: Seamless Sync (2/3 columns) */}
        <Box
          gridColumn={{ base: 'span 1', md: 'span 2' }}
          bg="bg.panel"
          borderRadius="xl"
          p={8}
          borderWidth="1px"
          borderColor="border"
          boxShadow="sm"
          _hover={{ boxShadow: 'md' }}
          transition="all 0.2s"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={6}
        >
          <Box maxW="lg">
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w={12}
              h={12}
              bg="warning.100"
              color="warning.400"
              borderRadius="lg"
              mb={6}
            >
              <SyncIcon w={6} h={6} />
            </Box>
            <Text fontSize="lg" fontWeight="bold" color="fg" mb={3}>
              {t('LandingPage.features.sync.title')}
            </Text>
            <Text fontSize="sm" color="fg.muted" lineHeight="tall">
              {t('LandingPage.features.sync.description')}
            </Text>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
