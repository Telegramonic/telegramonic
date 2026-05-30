import {
  VStack,
  Stack,
  Heading,
  Text,
  Button,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@assets';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      minHeight={'80vh'}
      bgGradient="radial(circle at 50% -20%, #e6f4ff, bg.default 70%)"
      py={16}
      px={6}
      position="relative"
      overflow="hidden"
      zIndex={1}
    >
      {/* Decorative blurred blobs */}
      <Box
        position="absolute"
        top="5rem"
        left="5%"
        width="16rem"
        height="16rem"
        bg="primary"
        opacity={0.15}
        borderRadius="full"
        filter="blur(60px)"
        pointerEvents="none"
        zIndex={-1}
      />
      <Box
        position="absolute"
        bottom="5rem"
        right="5%"
        width="24rem"
        height="24rem"
        bg="success.300"
        opacity={0.12}
        borderRadius="full"
        filter="blur(80px)"
        pointerEvents="none"
        zIndex={-1}
      />

      <VStack gap={6} maxW="4xl" mx="auto" textAlign="center" zIndex={2}>
        {/* Telegramonic Large Logo placeholder / Icon */}
        <Box
          color="white"
          width="6rem"
          height="6rem"
          borderRadius="2xl"
          mb={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Logo size="100%" />
        </Box>

        <Heading
          size={{ base: 'xl', md: '2xl' }}
          color={'fg'}
          lineHeight="tight"
          fontWeight="extrabold"
          maxW="3xl"
        >
          {t('LandingPage.heroText')}
          <br />
          <Text as="span" color="primary">
            {t('LandingPage.poweredBy')}
          </Text>
        </Heading>

        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          color={'fg.muted'}
          maxW="2xl"
          lineHeight="relaxed"
        >
          {t('LandingPage.subHeroText')}
        </Text>

        <Stack direction={{ base: 'column', sm: 'row' }} gap={4} mt={4}>
          <Button
            size="lg"
            bg="primary"
            color="white"
            borderRadius="xl"
            px={8}
            py={6}
            fontWeight="semibold"
            shadow="md"
            _hover={{ bg: 'primary/90' }}
          >
            {t('LandingPage.getStarted')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            borderColor="border"
            color="fg"
            borderRadius="xl"
            px={8}
            py={6}
            fontWeight="semibold"
            bg="bg.panel"
            _hover={{ bg: 'bg.hover' }}
          >
            {t('LandingPage.exploreFeatures')}
          </Button>
        </Stack>
      </VStack>
    </Stack>
  );
};

export default HeroSection;
