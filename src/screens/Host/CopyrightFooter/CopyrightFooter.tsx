import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '@assets';
import { ThemeSelector } from '@components';

const LEGAL_LINKS = [
  {
    title: 'Privacy policy',
    path: '/privacy',
  },
  {
    title: 'Terms of service',
    path: '/terms',
  },
  {
    title: 'Disclaimer',
    path: '/disclaimer',
  },
];

const TEAM_LINKS = [
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
              <Box w={10} h={10}>
                <Logo size="100%" />
              </Box>
              <Heading size="sm" color="primary" fontWeight="bold">
                Telegramonic
              </Heading>
            </HStack>
            <Text
              fontSize="xs"
              color="fg.muted"
              maxW="xs"
              textAlign={{ base: 'center', md: 'left' }}
            >
              {t('Footer.tagline')}
            </Text>
          </VStack>

          {/* Links Columns */}
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 8, sm: 16 }}
            align={{ base: 'center', sm: 'flex-start' }}
            justify={{ base: 'center', sm: 'flex-end' }}
            width={{ base: '100%', md: 'auto' }}
          >
            {/* Legal Column */}
            <VStack align={{ base: 'center', sm: 'flex-start' }} gap={1.5}>
              <Text
                fontSize="10px"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="widest"
                color="fg.muted"
                opacity={0.8}
                mb={1}
              >
                Legal
              </Text>
              {LEGAL_LINKS.map(({ path, title }) => (
                <Button
                  key={title}
                  fontSize="xs"
                  fontWeight="medium"
                  variant="ghost"
                  color="fg.muted"
                  _hover={{ color: 'primary', bg: 'bg.hover' }}
                  px={3}
                  py={1}
                  borderRadius="md"
                  height="auto"
                  asChild
                >
                  <Link to={path}>{title}</Link>
                </Button>
              ))}
            </VStack>

            {/* Team Column */}
            <VStack align={{ base: 'center', sm: 'flex-start' }} gap={1.5}>
              <Text
                fontSize="10px"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="widest"
                color="fg.muted"
                opacity={0.8}
                mb={1}
              >
                Team
              </Text>
              {TEAM_LINKS.map(({ path, title }) => (
                <Button
                  key={title}
                  fontSize="xs"
                  fontWeight="medium"
                  variant="ghost"
                  color="fg.muted"
                  _hover={{ color: 'primary', bg: 'bg.hover' }}
                  px={3}
                  py={1}
                  borderRadius="md"
                  height="auto"
                  asChild
                >
                  <Link to={path}>{title}</Link>
                </Button>
              ))}
            </VStack>
          </Stack>
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
          <Text
            fontSize="xs"
            color="fg.muted"
            textAlign={{ base: 'center', sm: 'left' }}
          >
            {t('Footer.copyrightText', { year: currentYear })}
          </Text>
          {/* Theme selector — bottom right */}
          <ThemeSelector />
        </Stack>
      </VStack>
    </Box>
  );
};

export default CopyrightFooter;
