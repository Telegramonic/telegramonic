import { Box, Button, Input, Text, HStack, Center } from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { useCurrentUser } from '@services';
import { useTranslation } from 'react-i18next';
import { TopNavBarProps } from './types';

export const TopNavBar = ({
  onUploadClick,
  onCreateFolderClick,
  currentFolderId,
  onMenuClick,
}: TopNavBarProps) => {
  const { data: currentUser } = useCurrentUser();
  const { t } = useTranslation();

  const isAtRoot = currentFolderId === null;

  return (
    <HStack
      h="64px"
      borderBottom="1px solid"
      borderBottomColor={{ base: '#e2e8f0', _dark: '#2f3942' }}
      px={{ base: 4, md: 6 }}
      justifyContent="space-between"
      bg={{ base: 'white', _dark: '#0b141d' }}
      position="sticky"
      top={0}
      zIndex={40}
    >
      <HStack gap={{ base: 3, md: 8 }} flex={1} overflow="hidden">
        {onMenuClick && (
          <Box
            as="button"
            onClick={onMenuClick}
            display={{ base: 'flex', md: 'none' }}
            color="fg.muted"
            _hover={{ color: 'primary' }}
            cursor="pointer"
            aria-label="Toggle Navigation Menu"
            flexShrink={0}
          >
            <Icon type={IconType.MENU} size={20} />
          </Box>
        )}
        <HStack gap={3} flexShrink={0} display={{ base: 'none', sm: 'flex' }}>
          <Box w={8} h={8}>
            <Icon type={IconType.LOGO} size="100%" />
          </Box>
          <Text fontSize="lg" fontWeight="extrabold" color="primary">
            Telegramonic
          </Text>
        </HStack>
      </HStack>

      <HStack gap={{ base: 2, md: 4 }} flexShrink={0}>
        <Button
          onClick={onUploadClick}
          bg="primary"
          color="white"
          borderRadius="xl"
          h="40px"
          px={{ base: 3, md: 5 }}
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
          <Box display={{ base: 'none', md: 'inline' }}>
            {t('Dashboard.topNav.uploadFile')}
          </Box>
        </Button>

        <Button
          onClick={onCreateFolderClick}
          variant="outline"
          borderColor="primary/30"
          color="primary"
          borderRadius="xl"
          h="40px"
          px={{ base: 3, md: 4 }}
          fontSize="sm"
          fontWeight="bold"
          disabled={!isAtRoot}
          opacity={!isAtRoot ? 0.5 : 1}
          cursor={!isAtRoot ? 'not-allowed' : 'pointer'}
          _hover={{ bg: !isAtRoot ? 'transparent' : 'primary/5' }}
          display="flex"
          gap={2}
        >
          <Icon type={IconType.FOLDER} size={16} />
          <Box display={{ base: 'inline', md: 'none' }}>+</Box>
          <Box display={{ base: 'none', md: 'inline' }}>
            {t('Dashboard.topNav.newFolder')}
          </Box>
        </Button>
      </HStack>
    </HStack>
  );
};
