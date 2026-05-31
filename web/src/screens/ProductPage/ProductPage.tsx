import * as React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Heading,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { TitleBoxContainer, LinkButton } from '@components';
import { AppleLogo, WindowsLogo, LinuxLogo, AndroidLogo } from '@assets';

type DetectedOS = 'macos' | 'windows' | 'linux' | 'android' | 'ios' | null;

const ProductPage = () => {
  const { t } = useTranslation();
  const [detectedOS, setDetectedOS] = React.useState<DetectedOS>(null);

  React.useEffect(() => {
    const ua = window.navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setDetectedOS('ios');
    } else if (/Android/i.test(ua)) {
      setDetectedOS('android');
    } else if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua)) {
      setDetectedOS('macos');
    } else if (/Win/i.test(ua)) {
      setDetectedOS('windows');
    } else if (/Linux/i.test(ua)) {
      setDetectedOS('linux');
    }
  }, []);

  return (
    <TitleBoxContainer
      title={t('NavigationBar.product')}
      icon="app"
      display="flex"
      flexDirection="column"
      width="100%"
      bg="bg.default"
      minH="calc(100vh - 4rem)"
    >
      {/* Visual pulse animations for recommendation glows */}
      <style>{`
        @keyframes recommendedGlow {
          0%, 100% { border-color: var(--chakra-colors-primary); box-shadow: 0 0 15px rgba(139, 92, 246, 0.15); }
          50% { border-color: var(--chakra-colors-primary); box-shadow: 0 0 25px rgba(139, 92, 246, 0.35); }
        }
        .recommended-card {
          animation: recommendedGlow 3s ease-in-out infinite;
        }
      `}</style>

      <Box maxW="1200px" mx="auto" px={6} py={12} width="100%">
        {/* ===================================================================
            HERO SECTION
            =================================================================== */}
        <VStack gap={4} textAlign="center" mb={16}>
          <Heading
            as="h1"
            fontSize={{ base: '3xl', md: '5xl' }}
            fontWeight="extrabold"
            letterSpacing="tight"
            color="fg"
          >
            {t('ProductPage.heroTitle')}
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="fg.muted"
            maxW="600px"
          >
            {t('ProductPage.heroSubtitle')}
          </Text>
        </VStack>

        {/* ===================================================================
            DESKTOP CLIENTS
            =================================================================== */}
        <Box mb={14}>
          <Heading
            as="h2"
            fontSize="xl"
            fontWeight="bold"
            mb={6}
            color="fg"
            letterSpacing="wide"
          >
            {t('ProductPage.desktopHeading')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {/* macOS CARD */}
            <Box
              data-testid="platform-card-macos"
              bg="bg.panel"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="border"
              p={6}
              position="relative"
              overflow="hidden"
              className={detectedOS === 'macos' ? 'recommended-card' : ''}
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
              }}
            >
              {detectedOS === 'macos' && (
                <Badge
                  colorScheme="purple"
                  position="absolute"
                  top={4}
                  right={4}
                  variant="solid"
                  borderRadius="full"
                  px={3}
                  py={0.5}
                  fontSize="2xs"
                  bg="primary"
                >
                  {t('ProductPage.recommended')}
                </Badge>
              )}
              <VStack align="start" gap={5}>
                <HStack gap={3} color="primary">
                  <AppleLogo />
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="fg"
                  >
                    {t('ProductPage.macos.title')}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="fg.muted" minH="40px">
                  {t('ProductPage.macos.description')}
                </Text>
                <VStack width="100%" gap={3}>
                  <LinkButton
                    href="#download-macos-arm"
                    width="100%"
                    variant="solid"
                    bg="primary"
                    color="white"
                    _hover={{ bg: 'primary/80' }}
                    size="sm"
                  >
                    {t('ProductPage.macos.buttonArm')}
                  </LinkButton>
                  <LinkButton
                    href="#download-macos-intel"
                    width="100%"
                    variant="outline"
                    borderColor="border"
                    _hover={{ bg: 'bg.hover' }}
                    size="sm"
                  >
                    {t('ProductPage.macos.buttonIntel')}
                  </LinkButton>
                </VStack>
              </VStack>
            </Box>

            {/* Windows CARD */}
            <Box
              data-testid="platform-card-windows"
              bg="bg.panel"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="border"
              p={6}
              position="relative"
              overflow="hidden"
              className={detectedOS === 'windows' ? 'recommended-card' : ''}
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
              }}
            >
              {detectedOS === 'windows' && (
                <Badge
                  colorScheme="purple"
                  position="absolute"
                  top={4}
                  right={4}
                  variant="solid"
                  borderRadius="full"
                  px={3}
                  py={0.5}
                  fontSize="2xs"
                  bg="primary"
                >
                  {t('ProductPage.recommended')}
                </Badge>
              )}
              <VStack align="start" gap={5}>
                <HStack gap={3} color="primary">
                  <WindowsLogo />
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="fg"
                  >
                    {t('ProductPage.windows.title')}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="fg.muted" minH="40px">
                  {t('ProductPage.windows.description')}
                </Text>
                <VStack width="100%" gap={3}>
                  <LinkButton
                    href="#download-windows-exe"
                    width="100%"
                    variant="solid"
                    bg="primary"
                    color="white"
                    _hover={{ bg: 'primary/80' }}
                    size="sm"
                  >
                    {t('ProductPage.windows.buttonExe')}
                  </LinkButton>
                  <LinkButton
                    href="#download-windows-zip"
                    width="100%"
                    variant="outline"
                    borderColor="border"
                    _hover={{ bg: 'bg.hover' }}
                    size="sm"
                  >
                    {t('ProductPage.windows.buttonZip')}
                  </LinkButton>
                </VStack>
              </VStack>
            </Box>

            {/* Linux CARD */}
            <Box
              data-testid="platform-card-linux"
              bg="bg.panel"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="border"
              p={6}
              position="relative"
              overflow="hidden"
              className={detectedOS === 'linux' ? 'recommended-card' : ''}
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
              }}
            >
              {detectedOS === 'linux' && (
                <Badge
                  colorScheme="purple"
                  position="absolute"
                  top={4}
                  right={4}
                  variant="solid"
                  borderRadius="full"
                  px={3}
                  py={0.5}
                  fontSize="2xs"
                  bg="primary"
                >
                  {t('ProductPage.recommended')}
                </Badge>
              )}
              <VStack align="start" gap={5}>
                <HStack gap={3} color="primary">
                  <LinuxLogo />
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="fg"
                  >
                    {t('ProductPage.linux.title')}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="fg.muted" minH="40px">
                  {t('ProductPage.linux.description')}
                </Text>
                <VStack width="100%" gap={3}>
                  <LinkButton
                    href="#download-linux-appimage"
                    width="100%"
                    variant="solid"
                    bg="primary"
                    color="white"
                    _hover={{ bg: 'primary/80' }}
                    size="sm"
                  >
                    {t('ProductPage.linux.buttonAppImage')}
                  </LinkButton>
                  <LinkButton
                    href="#download-linux-tar"
                    width="100%"
                    variant="outline"
                    borderColor="border"
                    _hover={{ bg: 'bg.hover' }}
                    size="sm"
                  >
                    {t('ProductPage.linux.buttonTar')}
                  </LinkButton>
                </VStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>

        {/* ===================================================================
            MOBILE CLIENTS
            =================================================================== */}
        <Box>
          <Heading
            as="h2"
            fontSize="xl"
            fontWeight="bold"
            mb={6}
            color="fg"
            letterSpacing="wide"
          >
            {t('ProductPage.mobileHeading')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {/* iOS CARD */}
            <Box
              data-testid="platform-card-ios"
              bg="bg.panel"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="border"
              p={6}
              position="relative"
              overflow="hidden"
              className={detectedOS === 'ios' ? 'recommended-card' : ''}
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
              }}
            >
              {detectedOS === 'ios' && (
                <Badge
                  colorScheme="purple"
                  position="absolute"
                  top={4}
                  right={4}
                  variant="solid"
                  borderRadius="full"
                  px={3}
                  py={0.5}
                  fontSize="2xs"
                  bg="primary"
                >
                  {t('ProductPage.recommended')}
                </Badge>
              )}
              <VStack align="start" gap={5}>
                <HStack gap={3} color="primary">
                  <AppleLogo />
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="fg"
                  >
                    {t('ProductPage.ios.title')}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="fg.muted" minH="40px">
                  {t('ProductPage.ios.description')}
                </Text>
                <VStack width="100%" gap={3}>
                  <LinkButton
                    href="#download-ios-appstore"
                    width="100%"
                    variant="solid"
                    bg="primary"
                    color="white"
                    _hover={{ bg: 'primary/80' }}
                    size="sm"
                  >
                    {t('ProductPage.ios.buttonAppStore')}
                  </LinkButton>
                  <LinkButton
                    href="#download-ios-testflight"
                    width="100%"
                    variant="outline"
                    borderColor="border"
                    _hover={{ bg: 'bg.hover' }}
                    size="sm"
                  >
                    {t('ProductPage.ios.buttonTestFlight')}
                  </LinkButton>
                </VStack>
              </VStack>
            </Box>

            {/* Android CARD */}
            <Box
              data-testid="platform-card-android"
              bg="bg.panel"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="border"
              p={6}
              position="relative"
              overflow="hidden"
              className={detectedOS === 'android' ? 'recommended-card' : ''}
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
              }}
            >
              {detectedOS === 'android' && (
                <Badge
                  colorScheme="purple"
                  position="absolute"
                  top={4}
                  right={4}
                  variant="solid"
                  borderRadius="full"
                  px={3}
                  py={0.5}
                  fontSize="2xs"
                  bg="primary"
                >
                  {t('ProductPage.recommended')}
                </Badge>
              )}
              <VStack align="start" gap={5}>
                <HStack gap={3} color="primary">
                  <AndroidLogo />
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="fg"
                  >
                    {t('ProductPage.android.title')}
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="fg.muted" minH="40px">
                  {t('ProductPage.android.description')}
                </Text>
                <VStack width="100%" gap={3}>
                  <LinkButton
                    href="#download-android-apk"
                    width="100%"
                    variant="solid"
                    bg="primary"
                    color="white"
                    _hover={{ bg: 'primary/80' }}
                    size="sm"
                  >
                    {t('ProductPage.android.buttonApk')}
                  </LinkButton>
                  <LinkButton
                    href="#download-android-playstore"
                    width="100%"
                    variant="outline"
                    borderColor="border"
                    _hover={{ bg: 'bg.hover' }}
                    size="sm"
                  >
                    {t('ProductPage.android.buttonPlayStore')}
                  </LinkButton>
                </VStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </TitleBoxContainer>
  );
};

export default ProductPage;
