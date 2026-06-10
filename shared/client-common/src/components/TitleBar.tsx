import { useEffect, useState } from 'react';
import { Box, HStack, Text, Spinner } from '@chakra-ui/react';
import { Logo } from '@assets';
import { useServerHealth } from '@services';

const TitleBar = () => {
  const [platform, setPlatform] = useState<string>('unknown');
  const { data, isFetching, refetch } = useServerHealth();
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const [checkingInternet, setCheckingInternet] = useState<boolean>(false);

  const checkInternet = async () => {
    setCheckingInternet(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    try {
      await fetch('https://clients3.google.com/generate_204', {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      setIsOnline(true);
    } catch (_) {
      setIsOnline(navigator.onLine);
    } finally {
      clearTimeout(timeoutId);
      setCheckingInternet(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkInternet();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkInternet();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const status = isFetching
    ? 'checking'
    : data?.status === 'connected'
      ? 'connected'
      : 'error';
  const latency = data?.latency ?? null;

  useEffect(() => {
    let currentPlatform = 'unknown';
    if (window.electronAPI) {
      currentPlatform = window.electronAPI.platform;
      setPlatform(currentPlatform);
    }

    // Dynamic dock icon scaling with standard macOS safety padding
    if (currentPlatform === 'darwin' && window.electronAPI?.setDockIcon) {
      const img = new Image();
      img.src = './icon.png';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Standard macOS rounded square icons fit within a 410x410 square
          // centered in the 512x512 canvas, leaving ~10% margin on all sides.
          const iconSize = 410;
          const offset = (512 - iconSize) / 2;

          ctx.clearRect(0, 0, 512, 512);
          ctx.drawImage(img, offset, offset, iconSize, iconSize);

          try {
            const dataUrl = canvas.toDataURL('image/png');
            window.electronAPI?.setDockIcon?.(dataUrl);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to generate padded macOS dock icon URL:', err);
          }
        }
      };
      img.onerror = (err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load icon.png for macOS dock padding:', err);
      };
    }
  }, []);

  const isMac = platform === 'darwin';
  const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleMinimize = () => {
    window.electronAPI?.minimize();
  };

  const handleClose = () => {
    window.electronAPI?.close();
  };

  return (
    <HStack
      h={isMobile ? "calc(40px + max(24px, env(safe-area-inset-top, 24px)))" : "38px"}
      pt={isMobile ? "max(24px, env(safe-area-inset-top, 24px))" : "0px"}
      bg="bg.panel/85"
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderBottomColor="border/50"
      px={4}
      justifyContent="space-between"
      style={{ WebkitAppRegion: 'drag', userSelect: 'none' } as any}
      zIndex={1000}
      position="relative"
    >
      {/* Left side: Logo & Title (with space for macOS traffic lights) */}
      <HStack gap={2} style={{ WebkitAppRegion: 'drag' } as any}>
        {isMac && <Box w="68px" h="1px" />}
        <HStack gap={2}>
          <Box w={4} h={4}>
            <Logo size="100%" />
          </Box>
          <Text fontSize="xs" fontWeight="bold" color="fg" letterSpacing="wider">
            Telegramonic
          </Text>
        </HStack>
      </HStack>

      {/* Middle Spacer: Draggable area that fills the center */}
      <Box flex={1} h="100%" style={{ WebkitAppRegion: 'drag' } as any} />

      {/* Right side: Connection Indicators + Window Controls */}
      <HStack gap={3} style={{ WebkitAppRegion: 'no-drag' } as any} alignItems="center">
        {/* Internet Status Indicator */}
        <HStack
          gap={2}
          cursor="pointer"
          onClick={checkInternet}
          px={2.5}
          py={0.5}
          borderRadius="full"
          bg="bg.hover/40"
          border="1px solid"
          borderColor="border/20"
          _hover={{ bg: 'bg.hover', borderColor: 'primary/30' }}
          transition="all 0.2s"
          title="Click to recheck Internet Connection"
        >
          <Box
            w={2}
            h={2}
            borderRadius="full"
            bg={
              checkingInternet
                ? 'yellow.400'
                : isOnline
                  ? 'success.400'
                  : 'error.400'
            }
            className={checkingInternet ? 'pulse-anim' : ''}
            style={
              !checkingInternet && isOnline
                ? { boxShadow: '0 0 8px var(--chakra-colors-success-400)' }
                : !checkingInternet && !isOnline
                  ? { boxShadow: '0 0 8px var(--chakra-colors-error-400)' }
                  : {}
            }
          />
          {checkingInternet ? (
            <Spinner size="xs" color="primary" />
          ) : (
            <Text fontSize="10px" fontWeight="medium" color="fg.muted">
              {isOnline ? 'Internet: Online' : 'Internet: Offline'}
            </Text>
          )}
        </HStack>

        {/* Interactive Status Indicator */}
        <HStack
          gap={2}
          cursor="pointer"
          onClick={() => refetch()}
          px={2.5}
          py={0.5}
          borderRadius="full"
          bg="bg.hover/40"
          border="1px solid"
          borderColor="border/20"
          _hover={{ bg: 'bg.hover', borderColor: 'primary/30' }}
          transition="all 0.2s"
          title="Click to recheck Telegram Connection Latency"
        >
          <Box
            w={2}
            h={2}
            borderRadius="full"
            bg={
              status === 'checking'
                ? 'yellow.400'
                : status === 'connected'
                  ? 'success.400'
                  : status === 'error'
                    ? 'error.400'
                    : 'fg.muted'
            }
            className={status === 'checking' || status === 'connected' ? 'pulse-anim' : ''}
            style={
              status === 'connected'
                ? { boxShadow: '0 0 8px var(--chakra-colors-success-400)' }
                : status === 'error'
                  ? { boxShadow: '0 0 8px var(--chakra-colors-error-400)' }
                  : {}
            }
          />
          {status === 'checking' ? (
            <Spinner size="xs" color="primary" />
          ) : (
            <Text fontSize="10px" fontWeight="medium" color="fg.muted">
              {status === 'connected' && latency !== null
                ? `TG Connected: ${latency}ms`
                : status === 'error'
                  ? 'TG Disconnected'
                  : 'Check Status'}
            </Text>
          )}
        </HStack>

        {/* Window controls for Windows/Linux */}
        {!isMac && !isMobile && (
          <HStack gap={1}>
            {/* Minimize */}
            <Box
              as="button"
              onClick={handleMinimize}
              w="28px"
              h="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              color="fg.muted"
              _hover={{ bg: 'bg.hover', color: 'fg' }}
              transition="all 0.2s"
              aria-label="Minimize Window"
            >
              <svg width="10" height="1" viewBox="0 0 10 1">
                <rect width="10" height="1" fill="currentColor" />
              </svg>
            </Box>

            {/* Close */}
            <Box
              as="button"
              onClick={handleClose}
              w="28px"
              h="24px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              color="fg.muted"
              _hover={{ bg: 'error.500/20', color: 'error.400' }}
              transition="all 0.2s"
              aria-label="Close Window"
            >
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path
                  d="M1 1 L9 9 M9 1 L1 9"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
          </HStack>
        )}
      </HStack>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        .pulse-anim {
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style>
    </HStack>
  );
};

export default TitleBar;
