import {
  VStack,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  HStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Icon, IconType } from '@assets';

// ---------------------------------------------------------------------------
// DriveWidget — Glassmorphic mock-drive card shown in the Hero right column
// ---------------------------------------------------------------------------
const DriveWidget = () => {
  const { t } = useTranslation();
  return (
    <Box
      bg="bg.panel"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="border"
      p={6}
      shadow="2xl"
      width="100%"
      maxW="480px"
      position="relative"
      overflow="hidden"
      className="drive-card-float"
      transition="all 0.3s ease"
      _hover={{ shadow: '3xl', transform: 'translateY(-6px)' }}
    >
    {/* Shimmer sweep overlay */}
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      pointerEvents="none"
      zIndex={10}
      className="drive-shimmer"
      borderRadius="2xl"
    />

    {/* Header mock controls */}
    <HStack justify="space-between" mb={6} position="relative" zIndex={1}>
      <HStack gap={2}>
        <Box w={3} h={3} borderRadius="full" bg="red.400" className="dot-pulse dot-pulse-1" />
        <Box w={3} h={3} borderRadius="full" bg="yellow.400" className="dot-pulse dot-pulse-2" />
        <Box w={3} h={3} borderRadius="full" bg="green.400" className="dot-pulse dot-pulse-3" />
      </HStack>
      <Text fontSize="xs" fontWeight="bold" color="fg.muted">
        {t('LandingPage.driveWidget.title')}
      </Text>
      <Box color="fg.muted">
        <Icon type={IconType.LOGO} size="18px" />
      </Box>
    </HStack>

    {/* Simulated file entries */}
    <VStack gap={3.5} align="stretch" position="relative" zIndex={1}>

      {/* File 1: Uploading Video — animated progress */}
      <Box
        p={3.5}
        borderRadius="xl"
        bg="bg.default"
        borderWidth="1px"
        borderColor="border"
        position="relative"
        overflow="hidden"
        className="row-slide-in row-slide-in-1"
      >
        {/* Row glow when uploading */}
        <Box
          position="absolute"
          inset={0}
          className="upload-row-glow"
          borderRadius="xl"
          pointerEvents="none"
        />
        <HStack justify="space-between" mb={2}>
          <HStack gap={3}>
            <Box color="primary" p={2} bg="primary/10" borderRadius="lg" className="icon-pulse">
              <Icon type={IconType.VIDEO} />
            </Box>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" fontWeight="bold" color="fg">
                Video_Tutorial.mp4
              </Text>
              <HStack gap={1.5}>
                <Text fontSize="10px" color="fg.muted">
                  1.2 GB •
                </Text>
                <Text fontSize="10px" color="primary" fontWeight="semibold" className="uploading-text-blink">
                  {t('LandingPage.driveWidget.uploading')}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          {/* Animated percentage counter */}
          <Text fontSize="10px" fontWeight="bold" color="primary" className="percent-counter">
            <span className="pct-value" />
          </Text>
        </HStack>
        {/* Looping progress bar */}
        <Box w="100%" h="4px" bg="bg.subtle" borderRadius="full" overflow="hidden">
          <Box
            h="100%"
            bg="linear-gradient(90deg, var(--chakra-colors-primary), #60efff)"
            borderRadius="full"
            className="upload-progress-loop"
          />
        </Box>
      </Box>

      {/* File 2: Completed Invoice */}
      <Box
        p={3.5}
        borderRadius="xl"
        bg="bg.default"
        borderWidth="1px"
        borderColor="border"
        _hover={{ bg: 'bg.hover' }}
        transition="background 0.2s"
        className="row-slide-in row-slide-in-2"
      >
        <HStack justify="space-between">
          <HStack gap={3}>
            <Box color="success.400" p={2} bg="success.100" borderRadius="lg">
              <Icon type={IconType.FILE} />
            </Box>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" fontWeight="bold" color="fg">
                Invoice_May.pdf
              </Text>
              <Text fontSize="10px" color="fg.muted">
                245 KB • {t('LandingPage.driveWidget.hoursAgo')}
              </Text>
            </VStack>
          </HStack>
          <Box bg="success.100" p={1} borderRadius="full" className="check-pop">
            <Icon type={IconType.CHECK} />
          </Box>
        </HStack>
      </Box>

      {/* File 3: Completed Archive */}
      <Box
        p={3.5}
        borderRadius="xl"
        bg="bg.default"
        borderWidth="1px"
        borderColor="border"
        _hover={{ bg: 'bg.hover' }}
        transition="background 0.2s"
        className="row-slide-in row-slide-in-3"
      >
        <HStack justify="space-between">
          <HStack gap={3}>
            <Box color="warning.400" p={2} bg="warning.100" borderRadius="lg">
              <Icon type={IconType.ZIP} />
            </Box>
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" fontWeight="bold" color="fg">
                Family_Photos.zip
              </Text>
              <Text fontSize="10px" color="fg.muted">
                450 MB • {t('LandingPage.driveWidget.yesterday')}
              </Text>
            </VStack>
          </HStack>
          <Box bg="success.100" p={1} borderRadius="full" className="check-pop" style={{ animationDelay: '0.2s' }}>
            <Icon type={IconType.CHECK} />
          </Box>
        </HStack>
      </Box>

      {/* Drag and Drop Zone */}
      <Box
        borderWidth="2px"
        borderStyle="dashed"
        borderColor="primary/30"
        bg="primary/5"
        borderRadius="xl"
        p={5}
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        cursor="pointer"
        className="row-slide-in row-slide-in-4 dropzone-breathe"
        _hover={{ bg: 'primary/10', borderColor: 'primary/60' }}
        transition="all 0.2s"
      >
        <Box color="primary" className="cloud-bounce">
          <Icon type={IconType.CLOUD_UPLOAD} />
        </Box>
        <Text fontSize="xs" fontWeight="bold" color="fg">
          {t('LandingPage.driveWidget.dropzoneTitle')}
        </Text>
        <Text fontSize="9px" color="fg.muted">
          {t('LandingPage.driveWidget.dropzoneSubtitle')}
        </Text>
      </Box>
    </VStack>
  </Box>
  );
};

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------
const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width="100%"
      minHeight={{ base: 'auto', md: '90vh' }}
      bgGradient="radial(circle at 50% -20%, #e6f4ff, bg.default 80%)"
      py={{ base: 12, md: 24 }}
      px={{ base: 6, md: 16 }}
      position="relative"
      overflow="hidden"
      zIndex={1}
    >
      {/* Dynamic Animated Background Blobs */}
      <Box
        position="absolute"
        top="10%"
        left="-5%"
        width={{ base: '200px', md: '450px' }}
        height={{ base: '200px', md: '450px' }}
        bg="primary"
        opacity="0.12"
        borderRadius="full"
        filter="blur(100px)"
        pointerEvents="none"
        zIndex={-1}
        className="blob-animation-1"
      />
      <Box
        position="absolute"
        bottom="15%"
        right="-5%"
        width={{ base: '250px', md: '500px' }}
        height={{ base: '250px', md: '500px' }}
        bg="success.300"
        opacity="0.08"
        borderRadius="full"
        filter="blur(120px)"
        pointerEvents="none"
        zIndex={-1}
        className="blob-animation-2"
      />

      {/* Main Responsive Grid Container */}
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 12, lg: 16 }}
        maxW="1200px"
        width="100%"
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
        zIndex={2}
      >
        {/* LEFT COLUMN: Copy, CTA, Badges */}
        <VStack
          alignItems={{ base: 'center', lg: 'flex-start' }}
          textAlign={{ base: 'center', lg: 'left' }}
          gap={6}
          flex={1}
          maxW={{ base: 'xl', lg: 'none' }}
        >
          {/* Ergonomic Top Pill Badge */}
          <Box
            display="inline-flex"
            alignItems="center"
            gap={2}
            bg="primary/10"
            color="primary"
            px={4}
            py={1.5}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
            borderWidth="1px"
            borderColor="primary/20"
            backdropFilter="blur(8px)"
          >
            <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--chakra-colors-primary)', borderRadius: '50%' }}></span>
            {t('LandingPage.heroBadge')}
          </Box>

          {/* Heading */}
          <Heading
            size={{ base: 'xl', md: '2xl', lg: '3xl' }}
            color="fg"
            lineHeight="tight"
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            {t('LandingPage.heroText')}
            <br />
            <Text
              as="span"
              bgGradient="linear(to-r, primary, success.400)"
              bgClip="text"
            >
              {t('LandingPage.poweredBy')}
            </Text>
          </Heading>

          {/* Subheading text */}
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="fg.muted"
            lineHeight="relaxed"
          >
            {t('LandingPage.subHeroText')}
          </Text>

          {/* Interactive buttons */}
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={4}
            width={{ base: '100%', sm: 'auto' }}
            mt={2}
          >
            <Button
              size="lg"
              bg="primary"
              color="white"
              borderRadius="xl"
              px={8}
              py={6}
              fontWeight="bold"
              shadow="lg"
              _hover={{ bg: 'primary/90', transform: 'translateY(-2px)', shadow: 'xl' }}
              transition="all 0.2s"
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
              _hover={{ bg: 'bg.hover', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('LandingPage.exploreFeatures')}
            </Button>
          </Stack>

          {/* Inline trust tags / value indicators */}
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 3, sm: 6 }}
            mt={4}
            color="fg.muted"
            fontSize="xs"
            fontWeight="semibold"
            width="100%"
            justifyContent={{ base: 'center', lg: 'flex-start' }}
          >
            <HStack gap={1.5}>
              <Text color="primary">🔒</Text>
              <Text>{t('LandingPage.tags.encrypted')}</Text>
            </HStack>
            <HStack gap={1.5}>
              <Text color="primary">📁</Text>
              <Text>{t('LandingPage.tags.fileSize')}</Text>
            </HStack>
            <HStack gap={1.5}>
              <Text color="primary">🚀</Text>
              <Text>{t('LandingPage.tags.direct')}</Text>
            </HStack>
          </Stack>
        </VStack>

        {/* RIGHT COLUMN: Interactive Mock Drive Widget */}
        <Box
          flex={1}
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <DriveWidget />
        </Box>
      </Stack>

      {/* Styled Animations for Blobs, DriveWidget & Progress */}
      <style>{`
        /* ── Background blobs ── */
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -35px) scale(1.05); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.08); }
        }
        .blob-animation-1 { animation: float-1 12s ease-in-out infinite; }
        .blob-animation-2 { animation: float-2 15s ease-in-out infinite; }

        /* ── Card gentle float ── */
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .drive-card-float { animation: card-float 6s ease-in-out infinite; }
        .drive-card-float:hover { animation-play-state: paused; }

        /* ── Shimmer sweep across card ── */
        @keyframes shimmer-sweep {
          0%   { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          10%  { opacity: 1; }
          40%  { transform: translateX(220%) skewX(-15deg); opacity: 0; }
          100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
        }
        .drive-shimmer::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.07) 40%,
            rgba(255,255,255,0.18) 50%,
            rgba(255,255,255,0.07) 60%,
            transparent 100%
          );
          animation: shimmer-sweep 4s ease-in-out infinite;
          border-radius: inherit;
        }

        /* ── Traffic-light dot breathe ── */
        @keyframes dot-breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(0.82); }
        }
        .dot-pulse-1 { animation: dot-breathe 2.4s ease-in-out infinite; }
        .dot-pulse-2 { animation: dot-breathe 2.4s ease-in-out infinite 0.4s; }
        .dot-pulse-3 { animation: dot-breathe 2.4s ease-in-out infinite 0.8s; }

        /* ── Staggered row slide-in ── */
        @keyframes row-in {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .row-slide-in   { animation: row-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .row-slide-in-1 { animation-delay: 0.05s; }
        .row-slide-in-2 { animation-delay: 0.18s; }
        .row-slide-in-3 { animation-delay: 0.31s; }
        .row-slide-in-4 { animation-delay: 0.44s; }

        /* ── Upload row ambient glow loop ── */
        @keyframes row-glow {
          0%, 100% { box-shadow: inset 0 0 0px 0 rgba(99,102,241,0); }
          50%       { box-shadow: inset 0 0 14px 2px rgba(99,102,241,0.12); }
        }
        .upload-row-glow { animation: row-glow 2.2s ease-in-out infinite; }

        /* ── Video icon pulse ── */
        @keyframes icon-pulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.14); }
        }
        .icon-pulse { animation: icon-pulse 1.8s ease-in-out infinite; }

        /* ── Uploading text blink ── */
        @keyframes text-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        .uploading-text-blink { animation: text-blink 1.4s ease-in-out infinite; }

        /* ── Looping upload progress bar (0 → 100% → reset) ── */
        @keyframes upload-loop {
          0%   { width: 0%;   opacity: 1; }
          80%  { width: 100%; opacity: 1; }
          85%  { width: 100%; opacity: 0; }
          86%  { width: 0%;   opacity: 0; }
          100% { width: 0%;   opacity: 1; }
        }
        .upload-progress-loop {
          animation: upload-loop 3.5s cubic-bezier(0.4,0,0.2,1) infinite;
        }

        /* ── Check mark pop ── */
        @keyframes check-pop {
          0%, 90%, 100% { transform: scale(1); }
          95%            { transform: scale(1.3) rotate(8deg); }
        }
        .check-pop { animation: check-pop 4s ease-in-out infinite; }

        /* ── Drop zone border breathe ── */
        @keyframes dropzone-breathe {
          0%, 100% { border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.05); }
          50%       { border-color: rgba(99,102,241,0.65); background: rgba(99,102,241,0.1); }
        }
        .dropzone-breathe { animation: dropzone-breathe 3s ease-in-out infinite; }

        /* ── Cloud icon bounce ── */
        @keyframes cloud-bounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          40%       { transform: translateY(-5px) scale(1.08); }
          60%       { transform: translateY(-3px) scale(1.05); }
        }
        .cloud-bounce { animation: cloud-bounce 2.6s ease-in-out infinite; }
      `}</style>
    </Stack>
  );
};

export default HeroSection;
