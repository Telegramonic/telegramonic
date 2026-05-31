import * as React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Logo } from '../../assets';

// Float animation for logo
const floatKeyframe = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

// Pulse animation for glow
const glowKeyframe = keyframes`
  0% { transform: scale(0.95); opacity: 0.4; }
  100% { transform: scale(1.15); opacity: 0.8; }
`;

// Progress bar movement
const progressKeyframe = keyframes`
  0% { left: -40%; width: 30%; }
  50% { width: 50%; }
  100% { left: 110%; width: 20%; }
`;

const loadingMessages = [
  'INITIALIZING SECURE SESSION...',
  'CONNECTING TO TELEGRAM MTPROTO GATEWAY...',
  'SECURE CONNECTION ESTABLISHED.',
  'DOWNLOADING SYSTEM MANIFESTS...',
  'PARSING ASSET DICTIONARIES...',
  'DECRYPTING LOCAL STATE STORES...',
  'COMPILING SHADERS & STYLES...',
  'MOUNTING TELEGRAMONIC DESKTOP SHELL...',
  'SPAWNING CRAFTSMAN COMPASS...',
];

const LoadingComponent = () => {
  const [logIndex, setLogIndex] = React.useState(0);
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    // Cycle messages
    const messageInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1200);

    // Blinking dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <Flex
      height="100vh"
      width="100vw"
      direction="column"
      justifyContent="center"
      alignItems="center"
      bg="#15111e"
      backgroundImage="
        radial-gradient(circle at center, rgba(139, 92, 246, 0.12) 0%, rgba(21, 17, 30, 1) 75%),
        linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
      "
      backgroundSize="100% 100%, 24px 24px, 24px 24px"
      overflow="hidden"
      position="relative"
    >
      {/* Decorative cybernetic corner accents */}
      <Box
        position="absolute"
        top="4"
        left="4"
        width="16px"
        height="16px"
        borderTop="2px solid rgba(139, 92, 246, 0.3)"
        borderLeft="2px solid rgba(139, 92, 246, 0.3)"
      />
      <Box
        position="absolute"
        top="4"
        right="4"
        width="16px"
        height="16px"
        borderTop="2px solid rgba(139, 92, 246, 0.3)"
        borderRight="2px solid rgba(139, 92, 246, 0.3)"
      />
      <Box
        position="absolute"
        bottom="4"
        left="4"
        width="16px"
        height="16px"
        borderBottom="2px solid rgba(139, 92, 246, 0.3)"
        borderLeft="2px solid rgba(139, 92, 246, 0.3)"
      />
      <Box
        position="absolute"
        bottom="4"
        right="4"
        width="16px"
        height="16px"
        borderBottom="2px solid rgba(139, 92, 246, 0.3)"
        borderRight="2px solid rgba(139, 92, 246, 0.3)"
      />

      {/* Floating Logo Container */}
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb="8"
        css={{
          animation: `${floatKeyframe} 4s ease-in-out infinite`,
        }}
      >
        {/* Pulsing Backglow */}
        <Box
          position="absolute"
          width="120px"
          height="120px"
          bg="radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)"
          filter="blur(10px)"
          css={{
            animation: `${glowKeyframe} 2s ease-in-out infinite alternate`,
          }}
        />

        {/* Main Brand Logo */}
        <Box position="relative" zIndex={2}>
          <Logo size={80} />
        </Box>
      </Box>

      {/* Brand Title */}
      <Text
        fontSize="lg"
        fontWeight="black"
        letterSpacing="0.35em"
        textTransform="uppercase"
        color="white"
        mb="1"
        textShadow="0 0 15px rgba(139, 92, 246, 0.4)"
      >
        Telegramonic
      </Text>

      {/* Brand Subtitle */}
      <Text
        fontFamily="mono"
        fontSize="xs"
        fontWeight="medium"
        color="neutral.500"
        letterSpacing="0.1em"
        mb="8"
      >
        CLOUD STORAGE CLIENT
      </Text>

      {/* Premium Sleek Progress Bar */}
      <Box
        width="220px"
        height="3px"
        bg="rgba(255, 255, 255, 0.05)"
        borderRadius="full"
        overflow="hidden"
        position="relative"
        mb="6"
        border="1px solid rgba(255, 255, 255, 0.03)"
      >
        <Box
          position="absolute"
          height="100%"
          background="linear-gradient(90deg, #0088cc 0%, #8b5cf6 100%)"
          borderRadius="full"
          css={{
            animation: `${progressKeyframe} 1.8s cubic-bezier(0.65, 0.05, 0.36, 1) infinite`,
          }}
        />
      </Box>

      {/* Interactive Terminal console */}
      <Flex
        direction="row"
        alignItems="center"
        fontFamily="mono"
        fontSize="xs"
        color="rgba(0, 136, 204, 0.85)"
        letterSpacing="0.05em"
        height="1.5rem"
      >
        <Text mr="1">&gt; {loadingMessages[logIndex]}</Text>
        <Text color="#8b5cf6">{dots}</Text>
      </Flex>
    </Flex>
  );
};

export default LoadingComponent;
