import { Box, Heading, Center, VStack, Text, Table, HStack } from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { FilesTableProps } from './types';
import { getFileIconType } from './const';

export const FilesTable = ({
  activeTab,
  filteredItems,
  onItemClick,
  onToggleStar,
  onShare,
  onDeleteFolder,
  onToggleTrash,
}: FilesTableProps) => {
  return (
    <Box>
      <Heading size="sm" mb={4} fontWeight="bold" color="fg">
        {activeTab === 'all'
          ? 'All Files'
          : activeTab === 'recent'
            ? 'Recent Files'
            : activeTab === 'starred'
              ? 'Starred Files'
              : 'Trash explorer'}
      </Heading>

      {filteredItems.length === 0 ? (
        <Center py={16} borderWidth="1px" borderColor="border" borderStyle="dashed" borderRadius="2xl">
          <VStack gap={2}>
            <Box color="fg.muted" opacity={0.6}>
              <Icon type={IconType.CLOUD} size={32} />
            </Box>
            <Text fontSize="sm" color="fg.muted">
              No files or folders found here.
            </Text>
          </VStack>
        </Center>
      ) : (
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
                <Table.ColumnHeader color="fg.muted" fontSize="2xs" fontWeight="bold" textTransform="uppercase">Name</Table.ColumnHeader>
                <Table.ColumnHeader color="fg.muted" fontSize="2xs" fontWeight="bold" textTransform="uppercase">Owner</Table.ColumnHeader>
                <Table.ColumnHeader color="fg.muted" fontSize="2xs" fontWeight="bold" textTransform="uppercase">Last Modified</Table.ColumnHeader>
                <Table.ColumnHeader color="fg.muted" fontSize="2xs" fontWeight="bold" textTransform="uppercase">Size</Table.ColumnHeader>
                <Table.ColumnHeader color="fg.muted" w="120px" textAlign="right" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredItems.map((item) => (
                <Table.Row
                  key={item.id}
                  borderColor="border/40"
                  _hover={{ bg: { base: '#f4f6f8', _dark: '#18202a/40' } }}
                  transition="background-color 0.2s"
                  cursor="pointer"
                  onClick={() => onItemClick(item)}
                >
                  <Table.Cell>
                    <HStack gap={3}>
                      <Box color={item.isFolder ? 'yellow.400' : 'primary'}>
                        <Icon type={getFileIconType(item.type)} size={18} />
                      </Box>
                      <Text fontSize="sm" fontWeight="medium" color="fg">
                        {item.name}
                      </Text>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Center w={5} h={5} borderRadius="full" bg="primary/20" fontSize="2xs" fontWeight="bold" color="primary">
                        {item.owner && item.owner !== '—'
                          ? item.owner.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
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
                    <HStack gap={1} justify="flex-end">
                      {/* Star Icon Button */}
                      {activeTab !== 'trash' && (
                        <Box
                          as="button"
                          onClick={(e: React.MouseEvent) => onToggleStar(item, e)}
                          p={1.5}
                          borderRadius="md"
                          color={item.starred ? 'yellow.400' : 'fg.muted'}
                          _hover={{ bg: 'bg.hover/20', color: item.starred ? 'yellow.300' : 'fg' }}
                          transition="all 0.2s"
                          title={item.starred ? 'Remove Star' : 'Star File'}
                          aria-label={item.starred ? 'Remove Star' : 'Star File'}
                        >
                          ★
                        </Box>
                      )}

                      {/* Share Icon Button */}
                      {activeTab !== 'trash' && !item.isFolder && (
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
                        >
                          <Icon type={IconType.SHARE} size={15} />
                        </Box>
                      )}

                      {/* Delete Folder permanently */}
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

                      {/* Trash/Restore Button for files */}
                      {!item.isFolder && (
                        <Box
                          as="button"
                          onClick={(e: React.MouseEvent) => onToggleTrash(item, e)}
                          p={1.5}
                          borderRadius="md"
                          color={activeTab === 'trash' ? 'success.400' : 'error.400'}
                          _hover={{ bg: activeTab === 'trash' ? 'success.500/10' : 'error.500/10' }}
                          transition="all 0.2s"
                          title={activeTab === 'trash' ? 'Restore File' : 'Move to Trash'}
                          aria-label={activeTab === 'trash' ? 'Restore File' : 'Move to Trash'}
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {activeTab === 'trash' ? '↺' : '✕'}
                        </Box>
                      )}
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  );
};
