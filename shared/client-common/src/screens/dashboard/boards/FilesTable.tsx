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
  Menu,
  Portal,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { FilesTableProps } from './types';
import { getFileIconType } from '../components/const';
import { DashboardItem } from '../types';

export enum ViewMode {
  LIST = 'list',
  ICON = 'icon',
}
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
  onBack,
  isInsideFolder,
  onDropFiles,
  onUploadClick,
}: FilesTableProps) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
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

  const sectionTitle =
    activeTab === 'all' ? '' : t('Dashboard.filesTable.pinned');

  return (
    <Box>
      {/* Header row: title + controls */}
      <HStack justify="space-between" mb={4} align="center">
        <HStack gap={2} align="center">
          {/* Back button — only shown when inside a folder */}
          {isInsideFolder && onBack && (
            <Box
              as="button"
              onClick={onBack}
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="30px"
              h="30px"
              borderRadius="lg"
              bg={{ base: '#f4f6f8', _dark: '#131c26' }}
              borderWidth="1px"
              borderColor="border"
              color="fg.muted"
              _hover={{
                bg: { base: 'white', _dark: '#18202a' },
                color: 'primary',
              }}
              transition="all 0.2s"
              title={t('Dashboard.filesTable.goBack')}
              aria-label={t('Dashboard.filesTable.goBack')}
              flexShrink={0}
            >
              <Icon type={IconType.CHEVRON_LEFT} size="14px" />
            </Box>
          )}
          {sectionTitle ? (
            <Heading size="sm" fontWeight="bold" color="fg">
              {sectionTitle}
            </Heading>
          ) : (
            <Box />
          )}
        </HStack>

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
              <option value="az">{t('Dashboard.filesTable.sort.az')}</option>
              <option value="za">{t('Dashboard.filesTable.sort.za')}</option>
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
              onClick={() => setViewMode(ViewMode.LIST)}
              px={2.5}
              py={1.5}
              borderRadius="md"
              bg={
                viewMode === ViewMode.LIST
                  ? { base: 'white', _dark: '#18202a' }
                  : 'transparent'
              }
              color={viewMode === ViewMode.LIST ? 'primary' : 'fg.muted'}
              transition="all 0.2s"
              title={t('Dashboard.filesTable.listView')}
              aria-label={t('Dashboard.filesTable.listView')}
              boxShadow={viewMode === ViewMode.LIST ? 'sm' : 'none'}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon type={IconType.LIST_VIEW} size="14px" />
            </Box>
            <Box
              as="button"
              onClick={() => setViewMode(ViewMode.ICON)}
              px={2.5}
              py={1.5}
              borderRadius="md"
              bg={
                viewMode === ViewMode.ICON
                  ? { base: 'white', _dark: '#18202a' }
                  : 'transparent'
              }
              color={viewMode === ViewMode.ICON ? 'primary' : 'fg.muted'}
              transition="all 0.2s"
              title={t('Dashboard.filesTable.iconView')}
              aria-label={t('Dashboard.filesTable.iconView')}
              boxShadow={viewMode === ViewMode.ICON ? 'sm' : 'none'}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon type={IconType.GRID_VIEW} size="14px" />
            </Box>
          </HStack>

          {/* Sync Button */}
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
            title={t('Dashboard.filesTable.syncFolders')}
            aria-label={t('Dashboard.filesTable.syncFolders')}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              type={IconType.SYNC}
              size="14px"
              className={isSyncing ? 'spin-anim' : ''}
            />
          </Box>
        </HStack>
      </HStack>

      {sortedItems.length === 0 ? (
        <Center
          py={16}
          borderWidth="1px"
          borderColor="border"
          borderRadius="2xl"
          bg={{ base: 'white', _dark: '#131c26' }}
        >
          <VStack gap={2}>
            <Box color="fg.muted" opacity={0.6}>
              <Icon type={IconType.CLOUD} size={32} />
            </Box>
            <Text fontSize="sm" color="fg.muted" textAlign="center" px={4}>
              {t('Dashboard.filesTable.emptyState')}
            </Text>
          </VStack>
        </Center>
      ) : viewMode === ViewMode.LIST ? (
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
                  {t('Dashboard.filesTable.headers.name')}
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="fg.muted"
                  fontSize="2xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  display={{ base: 'none', md: 'table-cell' }}
                >
                  {t('Dashboard.filesTable.headers.owner')}
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="fg.muted"
                  fontSize="2xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  display={{ base: 'none', md: 'table-cell' }}
                >
                  {t('Dashboard.filesTable.headers.lastModified')}
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  color="fg.muted"
                  fontSize="2xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  display={{ base: 'none', md: 'table-cell' }}
                >
                  {t('Dashboard.filesTable.headers.size')}
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
                  <Table.Cell display={{ base: 'none', md: 'table-cell' }}>
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
                  <Table.Cell
                    fontSize="sm"
                    color="fg.muted"
                    display={{ base: 'none', md: 'table-cell' }}
                  >
                    {item.lastModified}
                  </Table.Cell>
                  <Table.Cell
                    fontSize="sm"
                    color="fg.muted"
                    display={{ base: 'none', md: 'table-cell' }}
                  >
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
                      viewMode={ViewMode.LIST}
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
              overflow="hidden"
              minW={0}
              w="full"
            >
              <VStack
                gap={3}
                align="center"
                w="full"
                minW={0}
                overflow="hidden"
              >
                <Box
                  color={item.isFolder ? 'yellow.400' : 'primary'}
                  p={3}
                  bg={item.isFolder ? 'yellow.400/10' : 'primary/10'}
                  borderRadius="xl"
                >
                  <Icon type={getFileIconType(item.type)} size={28} />
                </Box>
                <VStack
                  gap={0}
                  align="center"
                  w="full"
                  minW={0}
                  overflow="hidden"
                >
                  <Text
                    fontSize="2xs"
                    fontWeight="extrabold"
                    color="fg"
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

              {/* Card actions */}
              <HStack
                position="absolute"
                top={2}
                right={2}
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
                  viewMode={ViewMode.ICON}
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
  viewMode,
}: {
  item: DashboardItem;
  activeTab: string;
  onToggleStar: (item: DashboardItem, e: React.MouseEvent) => void;
  onShare: (item: DashboardItem, e: React.MouseEvent) => void;
  onDownload: (item: DashboardItem, e: React.MouseEvent) => void;
  onDeleteFolder: (id: string, e: React.MouseEvent) => void;
  onDeleteFile: (item: DashboardItem, e: React.MouseEvent) => void;
  viewMode: ViewMode;
}) => {
  const { t } = useTranslation();
  return (
    <HStack gap={1} justify="flex-end" onClick={(e) => e.stopPropagation()}>
      {/* Desktop View: Side-by-side buttons */}
      <HStack
        gap={1}
        display={
          viewMode === ViewMode.ICON ? 'none' : { base: 'none', md: 'flex' }
        }
      >
        {/* Pin / Star */}
        <Box
          as="button"
          onClick={(e: React.MouseEvent) => onToggleStar(item, e)}
          p={1.5}
          borderRadius="md"
          color={item.starred ? 'yellow.400' : 'fg.muted'}
          _hover={{
            bg: 'bg.hover/20',
            color: item.starred ? 'yellow.300' : 'fg',
          }}
          transition="all 0.2s"
          title={
            item.starred
              ? t('Dashboard.filesTable.actions.unpin')
              : t('Dashboard.filesTable.actions.pin')
          }
          aria-label={
            item.starred
              ? t('Dashboard.filesTable.actions.unpin')
              : t('Dashboard.filesTable.actions.pin')
          }
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
            title={t('Dashboard.filesTable.actions.share')}
            aria-label={t('Dashboard.filesTable.actions.share')}
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
            title={t('Dashboard.filesTable.actions.download')}
            aria-label={t('Dashboard.filesTable.actions.download')}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon type={IconType.DOWNLOAD} size="15px" />
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
            title={t('Dashboard.filesTable.actions.deleteFolder')}
            aria-label={t('Dashboard.filesTable.actions.deleteFolder')}
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
            title={t('Dashboard.filesTable.actions.deleteFile')}
            aria-label={t('Dashboard.filesTable.actions.deleteFile')}
            fontSize="xs"
            fontWeight="bold"
          >
            🗑
          </Box>
        )}
      </HStack>

      {/* Mobile View: 3-dot dropdown menu */}
      <Box
        display={
          viewMode === ViewMode.ICON ? 'block' : { base: 'block', md: 'none' }
        }
        position="relative"
        zIndex={10}
      >
        <Menu.Root>
          <Menu.Trigger asChild>
            <Box
              as="button"
              onClick={(e) => e.stopPropagation()}
              p={1.5}
              borderRadius="md"
              color="fg.muted"
              _hover={{ bg: 'bg.hover/25', color: 'fg' }}
              transition="all 0.2s"
              title={t('Dashboard.filesTable.actions.options')}
              aria-label={t('Dashboard.filesTable.actions.options')}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon type={IconType.THREE_DOTS} size="16px" />
            </Box>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner onClick={(e) => e.stopPropagation()}>
              <Menu.Content
                zIndex={9999}
                borderRadius="xl"
                boxShadow="2xl"
                bg="bg.panel"
                borderColor="border"
                py={1}
                minW="140px"
                maxH="none"
                overflow="visible"
              >
                <Menu.Item
                  value="star"
                  onClick={(e: React.MouseEvent) => onToggleStar(item, e)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Icon
                    type={IconType.PIN}
                    size="14px"
                    color={item.starred ? 'yellow.400' : 'inherit'}
                    fill={item.starred ? 'currentColor' : 'none'}
                  />
                  {item.starred
                    ? t('Dashboard.filesTable.actions.unpin')
                    : t('Dashboard.filesTable.actions.pin')}
                </Menu.Item>

                {!item.isFolder && (
                  <Menu.Item
                    value="share"
                    onClick={(e: React.MouseEvent) => onShare(item, e)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icon type={IconType.SHARE} size="14px" />
                    {t('Dashboard.filesTable.actions.share')}
                  </Menu.Item>
                )}

                {!item.isFolder && (
                  <Menu.Item
                    value="download"
                    onClick={(e: React.MouseEvent) => onDownload(item, e)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Icon type={IconType.DOWNLOAD} size="14px" />
                    {t('Dashboard.filesTable.actions.download')}
                  </Menu.Item>
                )}

                <Menu.Item
                  value="delete"
                  onClick={(e: React.MouseEvent) => {
                    if (item.isFolder) {
                      onDeleteFolder(item.dbId, e);
                    } else {
                      onDeleteFile(item, e);
                    }
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--chakra-colors-error-400)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      width: '14px',
                      textAlign: 'center',
                    }}
                  >
                    🗑
                  </span>
                  {t('Dashboard.filesTable.actions.delete')}
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>
    </HStack>
  );
};
