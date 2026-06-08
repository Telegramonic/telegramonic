import { HStack, Text } from '@chakra-ui/react';
import { BreadcrumbsProps } from './types';

export const Breadcrumbs = ({
  breadcrumbs,
  currentFolderId,
  setCurrentFolderId,
}: BreadcrumbsProps) => {
  return (
    <HStack gap={1.5} fontSize="sm" color="fg.muted">
      <Text
        cursor="pointer"
        _hover={{ color: 'primary' }}
        fontWeight={!currentFolderId ? 'bold' : 'medium'}
        color={!currentFolderId ? 'fg' : 'fg.muted'}
        onClick={() => setCurrentFolderId(null)}
      >
        In my drive
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
