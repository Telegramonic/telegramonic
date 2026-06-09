import { Box, Button, Input, Text, HStack, Center } from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { useCurrentUser } from '@services';
import { TopNavBarProps } from './types';

export const TopNavBar = ({
  searchQuery,
  setSearchQuery,
  onUploadClick,
  onCreateFolderClick,
  currentFolderId,
}: TopNavBarProps) => {
  const { data: currentUser } = useCurrentUser();

  const isAtRoot = currentFolderId === null;

  return (
    <HStack
      h="64px"
      borderBottom="1px solid"
      borderBottomColor={{ base: '#e2e8f0', _dark: '#2f3942' }}
      px={6}
      justifyContent="space-between"
      bg={{ base: 'white', _dark: '#0b141d' }}
      position="sticky"
      top={0}
      zIndex={40}
    >
      <HStack gap={8} flex={1}>
        <HStack gap={3}>
          <Box w={8} h={8}>
            <Icon type={IconType.LOGO} size="100%" />
          </Box>
          <Text fontSize="lg" fontWeight="extrabold" color="primary">
            Telegramonic
          </Text>
        </HStack>

        {/* Search bar */}
        <Box position="relative" maxW="380px" w="100%">
          <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="fg.muted" zIndex={2}>
            <Icon type={IconType.SEARCH} size={16} />
          </Box>
          <Input
            placeholder="Search files, folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={{ base: '#e2e8f0/50', _dark: '#18202a' }}
            border="none"
            borderRadius="xl"
            h="40px"
            pl={10}
            pr={4}
            fontSize="sm"
            color="fg"
            _focus={{
              borderColor: 'primary',
              ring: '1px',
              ringColor: 'primary',
            }}
            _placeholder={{ color: 'outline' }}
          />
        </Box>
      </HStack>

      <HStack gap={4}>
        <Button
          onClick={onUploadClick}
          bg="primary"
          color="white"
          borderRadius="xl"
          h="40px"
          px={5}
          fontSize="sm"
          fontWeight="bold"
          disabled={isAtRoot}
          opacity={isAtRoot ? 0.5 : 1}
          cursor={isAtRoot ? 'not-allowed' : 'pointer'}
          _hover={{ filter: isAtRoot ? 'none' : 'brightness(1.1)' }}
          display="flex"
          gap={2}
        >
          <Icon type={IconType.CLOUD_UPLOAD} size={16} />
          Upload File
        </Button>

        <Button
          onClick={onCreateFolderClick}
          variant="outline"
          borderColor="primary/30"
          color="primary"
          borderRadius="xl"
          h="40px"
          px={4}
          fontSize="sm"
          fontWeight="bold"
          disabled={!isAtRoot}
          opacity={!isAtRoot ? 0.5 : 1}
          cursor={!isAtRoot ? 'not-allowed' : 'pointer'}
          _hover={{ bg: !isAtRoot ? 'transparent' : 'primary/5' }}
        >
          + New Folder
        </Button>

        <Center
          w={8}
          h={8}
          borderRadius="full"
          bg="primary/15"
          border="1px solid"
          borderColor="primary/30"
          color="primary"
          fontSize="sm"
          fontWeight="bold"
          title={currentUser ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : 'Profile'}
        >
          {currentUser
            ? `${currentUser.first_name[0]}${currentUser.last_name ? currentUser.last_name[0] : ''}`.toUpperCase()
            : 'U'}
        </Center>
      </HStack>
    </HStack>
  );
};
