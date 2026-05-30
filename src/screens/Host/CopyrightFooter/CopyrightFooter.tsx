import { Box, Button, HStack, Text, VStack, Stack, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '@assets';

const FOOTER_LINK = [
  {
    title: 'Privacy policy',
    path: '/privacy',
  },
  {
    title: 'Terms of service',
    path: '/terms',
  },
  {
    title: 'Contact us',
    path: '/contact-us',
  },
  {
    title: 'About us',
    path: '/about-us',
  },
  {
    title: 'FAQs',
    path: '/faq',
  },
];

const CopyrightFooter = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <Box
      as="footer"
      width="100%"
      bg="bg.panel"
      borderTopWidth="1px"
      borderTopColor="border"
      py={10}
      px={{ base: 6, md: 16 }}
    >
      <VStack gap={8} align="stretch" maxW="1200px" mx="auto">
        {/* Top Section */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ base: 'center', md: 'flex-start' }}
          gap={6}
        >
          {/* Brand Info */}
          <VStack align={{ base: 'center', md: 'flex-start' }} gap={2}>
            <HStack gap={2} alignItems="center">
              <Box w={7} h={7}>
                <Logo size="100%" />
              </Box>
              <Heading size="sm" color="primary" fontWeight="bold">
                Telegramonic
              </Heading>
            </HStack>
            <Text fontSize="xs" color="fg.muted" maxW="xs" textAlign={{ base: 'center', md: 'left' }}>
              {t('Footer.tagline')}
            </Text>
          </VStack>

          {/* Links */}
          <HStack gap={2} wrap="wrap" justify={{ base: 'center', md: 'flex-end' }} maxW="xl">
            {FOOTER_LINK.map(({ path, title }) => (
              <Button
                key={title}
                fontSize="xs"
                fontWeight="medium"
                variant="ghost"
                color="fg.muted"
                _hover={{ color: 'primary', bg: 'bg.hover' }}
                px={3}
                py={1.5}
                borderRadius="md"
                height="auto"
                asChild
              >
                <Link to={path}>{title}</Link>
              </Button>
            ))}
          </HStack>
        </Stack>

        {/* Divider */}
        <Box borderTopWidth="1px" borderTopColor="border" />

        {/* Bottom Section */}
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={4}
        >
          <Text fontSize="xs" color="fg.muted" textAlign={{ base: 'center', sm: 'left' }}>
            {t('Footer.copyrightText', { year: currentYear })}
          </Text>
          <Text fontSize="xs" color="fg.muted">
            {t('Footer.madeWith')}
          </Text>
        </Stack>
      </VStack>
    </Box>
  );
};

export default CopyrightFooter;
