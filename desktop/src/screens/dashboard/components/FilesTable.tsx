import { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Center,
  VStack,
  Text,
  Table,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { FilesTableProps } from './types';
import { getFileIconType } from './const';
import { DashboardItem } from '../types';

type ViewMode = 'list' | 'icon';
type SortMode = 'az' | 'za';

export const FilesTable = ({
  activeTab,
  filteredItems,
  onItemClick,
  onToggleStar,
  onShare,
  onDownload,
  onDeleteFolder,
  onDeleteFile,
  onSync,
  lastSynced,
  isSyncing,
}: FilesTableProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortMode, setSortMode] = useState<SortMode>('az');

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      // Always show folders before files
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      const cmp = a.name.localeCompare(b.name, undefined, {
        sensitivity: 'base',
      });
      return sortMode === 'az' ? cmp : -cmp;
    });
  }, [filteredItems, sortMode]);

  const sectionTitle = activeTab === 'all' ? '' : 'Pinned';

  return (
    <Box>
      {/* Header row: title + controls */}
      <HStack justify="space-between" mb={4} align="center">
        {sectionTitle ? (
          <Heading size="sm" fontWeight="bold" color="fg">
            {sectionTitle}
          </Heading>
        ) : (
          <Box />
        )}

        <HStack gap={3} align="flex-start">
          {/* Premium Sort selector */}
          <Box position="relative" display="inline-block" mt="1px">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              style={{
                background: 'var(--chakra-colors-bg, white)',
                border: '1px solid var(--chakra-colors-border)',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'var(--chakra-colors-fg\\.muted, #888)',
                padding: '6px 28px 6px 12px',
                cursor: 'pointer',
                appearance: 'none',
                outline: 'none',
                transition: 'all 0.2s',
              }}
            >
              <option value="az">Name: A → Z</option>
              <option value="za">Name: Z → A</option>
            </select>
            <Box
              position="absolute"
              right="10px"
              top="50%"
              transform="translateY(-50%)"
              pointerEvents="none"
              color="fg.muted"
              fontSize="9px"
            >
              ▼
            </Box>
          </Box>

          {/* View toggle with custom modern SVGs */}
          <HStack
            bg={{ base: '#f4f6f8', _dark: '#131c26' }}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            p={0.5}
            gap={0}
            mt="1px"
          >
            <Box
              as="button"
              onClick={() => setViewMode('list')}
              px={2.5}
              py={1.5}
              borderRadius="md"
              bg={
                viewMode === 'list'
                  ? { base: 'white', _dark: '#18202a' }
                  : 'transparent'
              }
              color={viewMode === 'list' ? 'primary' : 'fg.muted'}
              transition="all 0.2s"
              title="List view"
              aria-label="List view"
              boxShadow={viewMode === 'list' ? 'sm' : 'none'}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </Box>
            <Box
              as="button"
              onClick={() => setViewMode('icon')}
              px={2.5}
              py={1.5}
              borderRadius="md"
              bg={
                viewMode === 'icon'
                  ? { base: 'white', _dark: '#18202a' }
                  : 'transparent'
              }
              color={viewMode === 'icon' ? 'primary' : 'fg.muted'}
              transition="all 0.2s"
              title="Icon view"
              aria-label="Icon view"
              boxShadow={viewMode === 'icon' ? 'sm' : 'none'}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </Box>
          </HStack>

          {/* Sync Button & Last Synced Text Wrapper */}
          <VStack gap={1} align="center">
            <Box
              as="button"
              onClick={onSync}
              {...({ disabled: isSyncing } as any)}
              h="30px"
              w="34px"
              borderRadius="md"
              bg={{ base: '#f4f6f8', _dark: '#131c26' }}
              borderWidth="1px"
              borderColor="border"
              color="fg.muted"
              _hover={{
                bg: { base: 'white', _dark: '#18202a' },
                color: 'primary',
              }}
              _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
              transition="all 0.2s"
              title="Sync folders"
              aria-label="Sync folders"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                className={isSyncing ? 'spin-anim' : ''}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </Box>
            <Text fontSize="2xs" color="fg.muted" whiteSpace="nowrap" mt="-1px">
              Last synced:{' '}
              {lastSynced
                ? lastSynced.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                  })
                : 'Never'}
            </Text>
          </VStack>
        </HStack>
      </HStack>

      {sortedItems.length === 0 ? (
        <Center
          py={16}
          borderWidth="1px"
          borderColor="border"
          borderStyle="dashed"
          borderRadius="2xl"
        >
          <VStack gap={2}>
            <Box color="fg.muted" opacity={0.6}>
              <Icon type={IconType.CLOUD} size={32} />
            </Box>
            <Text fontSize="sm" color="fg.muted">
              No files or folders found here.
            </Text>
          </VStack>
        </Center>
      ) : viewMode === 'list' ? (
        /* ── LIST VIEW ── */
        <Box
          overflow="hidden"
          borderWidth="1px"
          borderColor="border"
          borderRadius="2xl"
          bg={{ base: 'white', _dark: '#131c26' }}
        >
          <Table.Root variant="line">
            <Table.Header bg={{ base: '#f4f6f8', _dark: '#18202a/60' }}>
              <Table.Row borderColor="border">
                <Table.ColumnHeader
                  color="fg.muted"
                  fontSize="2xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Name
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="fg.muted"
                  fontSize="2xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Owner
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="fg.muted"
                  fontSize="2xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Last Modified
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="fg.muted"
                  fontSize="2xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Size
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="fg.muted"
                  w="120px"
                  textAlign="right"
                />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sortedItems.map((item) => (
                <Table.Row
                  key={item.id}
                  borderColor="border/40"
                  _hover={{ bg: { base: '#f4f6f8', _dark: '#18202a/40' } }}
                  transition="background-color 0.2s"
                  cursor="pointer"
                  onClick={() => onItemClick(item)}
                >
                  <Table.Cell overflow="hidden">
                    <HStack gap={3} overflow="hidden">
                      <Box
                        color={item.isFolder ? 'yellow.400' : 'primary'}
                        flexShrink={0}
                      >
                        <Icon type={getFileIconType(item.type)} size={18} />
                      </Box>
                      <Text
                        fontSize="sm"
                        maxW="200px"
                        fontWeight={item.name.length > 25 ? 'bold' : 'medium'}
                        color={item.name.length > 25 ? 'primary' : 'fg'}
                        textOverflow="ellipsis"
                        overflow="hidden"
                        whiteSpace="nowrap"
                        title={item.name}
                      >
                        {item.name}
                      </Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Center
                        w={5}
                        h={5}
                        borderRadius="full"
                        bg="primary/20"
                        fontSize="2xs"
                        fontWeight="bold"
                        color="primary"
                      >
                        {item.owner && item.owner !== '—'
                          ? item.owner
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)
                          : 'ME'}
                      </Center>
                      <Text fontSize="sm" color="fg.muted">
                        {item.owner}
                      </Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell fontSize="sm" color="fg.muted">
                    {item.lastModified}
                  </Table.Cell>
                  <Table.Cell fontSize="sm" color="fg.muted">
                    {item.size}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <RowActions
                      item={item}
                      activeTab={activeTab}
                      onToggleStar={onToggleStar}
                      onShare={onShare}
                      onDownload={onDownload}
                      onDeleteFolder={onDeleteFolder}
                      onDeleteFile={onDeleteFile}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      ) : (
        /* ── ICON VIEW ── */
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} gap={4}>
          {sortedItems.map((item) => (
            <Box
              key={item.id}
              bg={{ base: 'white', _dark: '#131c26' }}
              borderWidth="1px"
              borderColor="border"
              borderRadius="2xl"
              p={4}
              cursor="pointer"
              onClick={() => onItemClick(item)}
              _hover={{
                borderColor: 'primary',
                bg: { base: '#f4f6f8', _dark: '#18202a/60' },
              }}
              transition="all 0.2s"
              position="relative"
              role="group"
            >
              <VStack gap={3} align="center">
                <Box
                  color={item.isFolder ? 'yellow.400' : 'primary'}
                  p={3}
                  bg={item.isFolder ? 'yellow.400/10' : 'primary/10'}
                  borderRadius="xl"
                >
                  <Icon type={getFileIconType(item.type)} size={28} />
                </Box>
                <VStack gap={0} align="center">
                  <Text
                    fontSize="xs"
                    fontWeight={item.name.length > 25 ? 'bold' : 'semibold'}
                    color={item.name.length > 25 ? 'primary' : 'fg'}
                    textAlign="center"
                    maxW="100%"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    w="full"
                    title={item.name}
                  >
                    {item.name}
                  </Text>
                  {!item.isFolder && (
                    <Text fontSize="2xs" color="fg.muted">
                      {item.size}
                    </Text>
                  )}
                </VStack>
              </VStack>

              {/* Hover action row */}
              <HStack
                position="absolute"
                top={2}
                right={2}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
                gap={0.5}
                onClick={(e) => e.stopPropagation()}
              >
                <RowActions
                  item={item}
                  activeTab={activeTab}
                  onToggleStar={onToggleStar}
                  onShare={onShare}
                  onDownload={onDownload}
                  onDeleteFolder={onDeleteFolder}
                  onDeleteFile={onDeleteFile}
                />
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

/* ── Shared action buttons for both views ── */
const RowActions = ({
  item,
  activeTab,
  onToggleStar,
  onShare,
  onDownload,
  onDeleteFolder,
  onDeleteFile,
}: {
  item: DashboardItem;
  activeTab: string;
  onToggleStar: (item: DashboardItem, e: React.MouseEvent) => void;
  onShare: (item: DashboardItem, e: React.MouseEvent) => void;
  onDownload: (item: DashboardItem, e: React.MouseEvent) => void;
  onDeleteFolder: (id: string, e: React.MouseEvent) => void;
  onDeleteFile: (item: DashboardItem, e: React.MouseEvent) => void;
}) => (
  <HStack gap={1} justify="flex-end">
    {/* Pin / Star */}
    <Box
      as="button"
      onClick={(e: React.MouseEvent) => onToggleStar(item, e)}
      p={1.5}
      borderRadius="md"
      color={item.starred ? 'yellow.400' : 'fg.muted'}
      _hover={{ bg: 'bg.hover/20', color: item.starred ? 'yellow.300' : 'fg' }}
      transition="all 0.2s"
      title={item.starred ? 'Unpin' : 'Pin'}
      aria-label={item.starred ? 'Unpin' : 'Pin'}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon
        type={IconType.PIN}
        size="16px"
        fill={item.starred ? 'currentColor' : 'none'}
      />
    </Box>

    {/* Share — files only */}
    {!item.isFolder && (
      <Box
        as="button"
        onClick={(e: React.MouseEvent) => onShare(item, e)}
        p={1.5}
        borderRadius="md"
        color="fg.muted"
        _hover={{ bg: 'bg.hover/20', color: 'primary' }}
        transition="all 0.2s"
        title="Share Link"
        aria-label="Share Link"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon type={IconType.SHARE} size="15px" />
      </Box>
    )}

    {/* Download — files only */}
    {!item.isFolder && (
      <Box
        as="button"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onDownload(item, e);
        }}
        p={1.5}
        borderRadius="md"
        color="fg.muted"
        _hover={{ bg: 'bg.hover/20', color: 'primary' }}
        transition="all 0.2s"
        title="Download File"
        aria-label="Download File"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </Box>
    )}

    {/* Delete folder */}
    {item.isFolder && (
      <Box
        as="button"
        onClick={(e: React.MouseEvent) => onDeleteFolder(item.dbId, e)}
        p={1.5}
        borderRadius="md"
        color="error.400"
        _hover={{ bg: 'error.500/10' }}
        transition="all 0.2s"
        title="Delete Folder"
        aria-label="Delete Folder"
        fontSize="xs"
        fontWeight="bold"
      >
        🗑
      </Box>
    )}

    {/* Delete file — files only */}
    {!item.isFolder && (
      <Box
        as="button"
        onClick={(e: React.MouseEvent) => onDeleteFile(item, e)}
        p={1.5}
        borderRadius="md"
        color="error.400"
        _hover={{ bg: 'error.500/10' }}
        transition="all 0.2s"
        title="Delete File"
        aria-label="Delete File"
        fontSize="xs"
        fontWeight="bold"
      >
        🗑
      </Box>
    )}
  </HStack>
);
