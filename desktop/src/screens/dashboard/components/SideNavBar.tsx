import { Box, Button, Text, VStack, HStack } from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { useStats } from '@services';
import { SideNavBarProps } from './types';

export const SideNavBar = ({
  activeTab,
  setActiveTab,
  setCurrentFolderId,
  onUpgradeStorage,
  onLogout,
}: SideNavBarProps) => {
  const { data: stats } = useStats();

  const totalStorageGB = stats
    ? parseFloat((stats.total_space / (1024 * 1024 * 1024 * 1024)).toFixed(1)) * 1024 // Convert TB to GB
    : 100;
  const currentUsageGB = stats
    ? parseFloat((stats.used_space / (1024 * 1024 * 1024)).toFixed(3))
    : 45.2;

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
        {/* Storage visualizer */}
        <Box p={4} borderRadius="2xl" bg={{ base: '#f4f6f8', _dark: '#131c26' }} borderWidth="1px" borderColor="border">
          <HStack gap={3} mb={3}>
            <Box p={2} bg="primary/10" borderRadius="lg" color="primary">
              <Icon type={IconType.CLOUD} size={20} />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="sm" fontWeight="bold" color="fg">
                My Storage
              </Text>
              <Text fontSize="10px" color="fg.muted">
                {currentUsageGB} GB of {totalStorageGB} GB used
              </Text>
            </VStack>
          </HStack>

          {/* Animated/Smooth storage bar */}
          <Box w="full" bg={{ base: '#e2e8f0', _dark: '#18202a' }} h="6px" borderRadius="full" overflow="hidden">
            <Box
              bg="primary"
              h="full"
              style={{
                width: `${Math.max(0.5, Math.min(100, (currentUsageGB / totalStorageGB) * 100))}%`,
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 8px var(--chakra-colors-primary)',
              }}
              borderRadius="full"
            />
          </Box>

          <Button
            onClick={onUpgradeStorage}
            w="full"
            mt={4}
            variant="outline"
            borderColor="primary/30"
            color="primary"
            h="32px"
            fontSize="xs"
            fontWeight="bold"
            borderRadius="lg"
            _hover={{ bg: 'primary/5' }}
          >
            Upgrade Storage
          </Button>
        </Box>

        {/* Navigation links */}
        <VStack gap={1} align="stretch">
          {[
            { tab: 'all', label: 'All Files', icon: IconType.CLOUD },
            { tab: 'recent', label: 'Recent', icon: IconType.SYNC },
            { tab: 'starred', label: 'Starred', icon: IconType.LOGO },
            { tab: 'trash', label: 'Trash', icon: IconType.LOCK },
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
              bg={activeTab === tab ? { base: 'primary/10', _dark: '#3f4a59/40' } : 'transparent'}
              color={activeTab === tab ? 'primary' : 'fg.muted'}
              borderRadius="xl"
              fontWeight={activeTab === tab ? 'bold' : 'medium'}
              _hover={{ bg: activeTab === tab ? { base: 'primary/15', _dark: '#3f4a59/40' } : 'bg.hover', color: 'fg' }}
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
      <VStack gap={1} align="stretch" borderTop="1px solid" borderColor="border" pt={4}>
        <HStack
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
