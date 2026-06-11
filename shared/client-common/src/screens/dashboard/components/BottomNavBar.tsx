import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setCurrentFolderId: (id: string | null) => void;
}

export const BottomNavBar = ({
  activeTab,
  setActiveTab,
  setCurrentFolderId,
}: BottomNavBarProps) => {
  const { t } = useTranslation();
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
        { tab: 'all' as ActiveTab, label: t('Dashboard.nav.drive'), icon: IconType.CLOUD },
        { tab: 'pinned' as ActiveTab, label: t('Dashboard.nav.pinned'), icon: IconType.PIN },
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
        <Icon type={IconType.USER} size={20} />
        <Text
          fontSize="10px"
          fontWeight={activeTab === 'profile' ? 'bold' : 'medium'}
        >
          {t('Dashboard.nav.profile')}
        </Text>
      </VStack>
    </Box>
  );
};
