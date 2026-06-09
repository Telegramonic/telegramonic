import { Text, VStack, HStack } from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { SideNavBarProps } from './types';

export const SideNavBar = ({
  activeTab,
  setActiveTab,
  setCurrentFolderId,
  onLogout,
}: SideNavBarProps) => {
  return (
    <VStack
      w="280px"
      bg={{ base: 'white', _dark: '#18202a' }}
      borderRight="1px solid"
      borderColor="border"
      p={4}
      alignItems="stretch"
      justifyContent="space-between"
      flexShrink={0}
    >
      <VStack gap={4} align="stretch">
        {/* Navigation links */}
        <VStack gap={1} align="stretch">
          {[
            { tab: 'all', label: 'In my drive', icon: IconType.CLOUD },
            { tab: 'pinned', label: 'Pinned', icon: IconType.PIN },
          ].map(({ tab, label, icon }) => (
            <HStack
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setCurrentFolderId(null); // Reset directory when jumping tabs
              }}
              cursor="pointer"
              px={4}
              py={3}
              bg={
                activeTab === tab
                  ? { base: 'primary/10', _dark: '#3f4a59/40' }
                  : 'transparent'
              }
              color={activeTab === tab ? 'primary' : 'fg.muted'}
              borderRadius="xl"
              fontWeight={activeTab === tab ? 'bold' : 'medium'}
              _hover={{
                bg:
                  activeTab === tab
                    ? { base: 'primary/15', _dark: '#3f4a59/40' }
                    : 'bg.hover',
                color: 'fg',
              }}
              transition="all 0.2s"
              gap={3}
            >
              <Icon type={icon} size={18} />
              <Text fontSize="sm">{label}</Text>
            </HStack>
          ))}
        </VStack>
      </VStack>

      {/* Bottom Sidebar navigation */}
      <VStack
        gap={1}
        align="stretch"
        borderTop="1px solid"
        borderColor="border"
        pt={4}
      >
        <HStack
          onClick={() => {
            if (window.electronAPI && window.electronAPI.openExternal) {
              window.electronAPI.openExternal('https://telegramonic.com/docs');
            } else {
              window.open('https://telegramonic.com/docs', '_blank');
            }
          }}
          cursor="pointer"
          px={4}
          py={3}
          color="fg.muted"
          borderRadius="xl"
          _hover={{ bg: 'bg.hover/20', color: 'fg' }}
          transition="all 0.2s"
          gap={3}
        >
          <Icon type={IconType.BOLT} size={18} />
          <Text fontSize="sm">Help</Text>
        </HStack>
        <HStack
          onClick={onLogout}
          cursor="pointer"
          px={4}
          py={3}
          color="error.400"
          borderRadius="xl"
          _hover={{ bg: 'error.500/10' }}
          transition="all 0.2s"
          gap={3}
        >
          <Icon type={IconType.LOCK} size={18} />
          <Text fontSize="sm">Logout</Text>
        </HStack>
      </VStack>
    </VStack>
  );
};
