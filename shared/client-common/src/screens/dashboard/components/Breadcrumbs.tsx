import { HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BreadcrumbsProps } from './types';

export const Breadcrumbs = ({
  breadcrumbs,
  currentFolderId,
  setCurrentFolderId,
}: BreadcrumbsProps) => {
  const { t } = useTranslation();
  return (
    <HStack gap={1.5} fontSize="sm" color="fg.muted">
      <Text
        cursor="pointer"
        _hover={{ color: 'primary' }}
        fontWeight={!currentFolderId ? 'bold' : 'medium'}
        color={!currentFolderId ? 'fg' : 'fg.muted'}
        onClick={() => setCurrentFolderId(null)}
      >
        {t('Dashboard.breadcrumbs.root')}
      </Text>
      {breadcrumbs.map((crumb) => (
        <HStack key={crumb.id} gap={1.5}>
          <Text>/</Text>
          <Text
            cursor="pointer"
            _hover={{ color: 'primary' }}
            fontWeight={currentFolderId === crumb.id ? 'bold' : 'medium'}
            color={currentFolderId === crumb.id ? 'fg' : 'fg.muted'}
            onClick={() => setCurrentFolderId(crumb.id)}
          >
            {crumb.name}
          </Text>
        </HStack>
      ))}
    </HStack>
  );
};
