import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setCurrentFolderId: (id: string | null) => void;
}

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const BottomNavBar = ({
  activeTab,
  setActiveTab,
  setCurrentFolderId,
}: BottomNavBarProps) => {
  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      h="calc(60px + env(safe-area-inset-bottom, 0px))"
      pb="env(safe-area-inset-bottom, 0px)"
      bg={{ base: 'white/90', _dark: '#131c26/90' }}
      backdropFilter="blur(16px)"
      borderTop="1px solid"
      borderTopColor="border/40"
      display={{ base: 'flex', md: 'none' }}
      alignItems="center"
      justifyContent="space-around"
      zIndex={150}
      shadow="0 -4px 12px rgba(0, 0, 0, 0.05)"
    >
      {[
        { tab: 'all' as ActiveTab, label: 'Drive', icon: IconType.CLOUD },
        { tab: 'pinned' as ActiveTab, label: 'Pinned', icon: IconType.PIN },
      ].map(({ tab, label, icon }) => {
        const isActive = activeTab === tab;
        return (
          <VStack
            key={tab}
            as="button"
            onClick={() => {
              setActiveTab(tab);
              setCurrentFolderId(null);
            }}
            gap={1}
            py={2}
            px={4}
            color={isActive ? 'primary' : 'fg.muted'}
            _hover={{ color: 'fg' }}
            cursor="pointer"
            flex={1}
            alignItems="center"
          >
            <Icon type={icon} size={20} />
            <Text fontSize="10px" fontWeight={isActive ? 'bold' : 'medium'}>
              {label}
            </Text>
          </VStack>
        );
      })}

      <VStack
        as="button"
        onClick={() => {
          setActiveTab('profile');
          setCurrentFolderId(null);
        }}
        gap={1}
        py={2}
        px={4}
        color={activeTab === 'profile' ? 'primary' : 'fg.muted'}
        _hover={{ color: 'fg' }}
        cursor="pointer"
        flex={1}
        alignItems="center"
      >
        <UserIcon />
        <Text fontSize="10px" fontWeight={activeTab === 'profile' ? 'bold' : 'medium'}>
          Profile
        </Text>
      </VStack>
    </Box>
  );
};
