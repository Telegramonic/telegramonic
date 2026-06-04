import { Box, Heading, HStack, Text, Center } from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { SuggestedSectionProps } from './types';
import {
  formatDate,
  getFileType,
  getFileIconType,
  getGradientForType,
  buildDashboardItemFromFile,
} from './const';

export const SuggestedSection = ({
  activeTab,
  currentFolderId,
  suggestedFiles,
  ownerName,
  starredIds,
  trashIds,
  onItemClick,
  onShare,
  onUploadTrigger,
  onCreateFolderTrigger,
  onShowToast,
}: SuggestedSectionProps) => {
  if (activeTab !== 'all' || currentFolderId !== null) return null;

  return (
    <Box>
      <Heading size="sm" mb={4} fontWeight="bold" color="fg">
        Suggested Files
      </Heading>
      <HStack gap={6} align="stretch" wrap="wrap">
        {suggestedFiles.length > 0 ? (
          suggestedFiles.map((item) => {
            const mappedItem = buildDashboardItemFromFile(item, ownerName, starredIds, trashIds);

            return (
              <Box
                key={item.id}
                flex={1}
                minW="240px"
                bg={{ base: 'white', _dark: 'rgba(23, 33, 43, 0.6)' }}
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="border"
                p={4}
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ borderColor: 'primary/50', transform: 'translateY(-2px)' }}
                onClick={() => onItemClick(mappedItem)}
                className="group"
              >
                <Box
                  aspectRatio={16 / 9}
                  borderRadius="xl"
                  mb={4}
                  bg={{ base: '#f4f6f8', _dark: '#18202a' }}
                  overflow="hidden"
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{ background: getGradientForType(getFileType(item.file_ext || '')) }}
                >
                  <Center
                    w="56px"
                    h="56px"
                    borderRadius="2xl"
                    bg="white/20"
                    backdropFilter="blur(8px)"
                    border="1px solid rgba(255, 255, 255, 0.3)"
                    boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                    color="white"
                    transition="transform 0.3s"
                    _groupHover={{ transform: 'scale(1.1)' }}
                  >
                    <Icon type={getFileIconType(getFileType(item.file_ext || ''))} size={28} />
                  </Center>
                  <Box
                    position="absolute"
                    inset={0}
                    bg="gradient-to-t"
                    gradientFrom="black/40"
                    gradientTo="transparent"
                    zIndex={1}
                  />
                  <HStack position="absolute" bottom={2} left={3} gap={2} zIndex={2}>
                    <Icon type={getFileIconType(getFileType(item.file_ext || ''))} size={16} color="white" />
                    <Text fontSize="xs" fontWeight="bold" color="white" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" maxW="180px">
                      {item.name}
                    </Text>
                  </HStack>
                </Box>
                <HStack justify="space-between">
                  <Text fontSize="2xs" color="fg.muted">
                    {formatDate(item.created_at)}
                  </Text>
                  <Box
                    as="button"
                    onClick={(e) => onShare(mappedItem, e)}
                    color="fg.muted"
                    _hover={{ color: 'primary' }}
                    transition="colors 0.2s"
                  >
                    <Icon type={IconType.SHARE} size={16} />
                  </Box>
                </HStack>
              </Box>
            );
          })
        ) : (
          <>
            <Box
              flex={1}
              minW="240px"
              bg={{ base: 'white', _dark: 'rgba(23, 33, 43, 0.6)' }}
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="border"
              p={4}
              cursor="pointer"
              transition="all 0.3s"
              _hover={{ borderColor: 'primary/50', transform: 'translateY(-2px)' }}
              onClick={onUploadTrigger}
              className="group"
            >
              <Box
                aspectRatio={16 / 9}
                borderRadius="xl"
                mb={4}
                bg={{ base: '#f4f6f8', _dark: '#18202a' }}
                overflow="hidden"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <Center
                  w="56px"
                  h="56px"
                  borderRadius="2xl"
                  bg="white/20"
                  backdropFilter="blur(8px)"
                  border="1px solid rgba(255, 255, 255, 0.3)"
                  color="white"
                  transition="transform 0.3s"
                  _groupHover={{ transform: 'scale(1.1)' }}
                >
                  <Icon type={IconType.CLOUD_UPLOAD} size={28} />
                </Center>
                <Box
                  position="absolute"
                  inset={0}
                  bg="gradient-to-t"
                  gradientFrom="black/40"
                  gradientTo="transparent"
                  zIndex={1}
                />
                <HStack position="absolute" bottom={2} left={3} gap={2} zIndex={2}>
                  <Text fontSize="xs" fontWeight="bold" color="white">
                    Upload File
                  </Text>
                </HStack>
              </Box>
              <Text fontSize="2xs" color="fg.muted">
                Upload your first document or media
              </Text>
            </Box>

            <Box
              flex={1}
              minW="240px"
              bg={{ base: 'white', _dark: 'rgba(23, 33, 43, 0.6)' }}
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="border"
              p={4}
              cursor="pointer"
              transition="all 0.3s"
              _hover={{ borderColor: 'primary/50', transform: 'translateY(-2px)' }}
              onClick={onCreateFolderTrigger}
              className="group"
            >
              <Box
                aspectRatio={16 / 9}
                borderRadius="xl"
                mb={4}
                bg={{ base: '#f4f6f8', _dark: '#18202a' }}
                overflow="hidden"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' }}
              >
                <Center
                  w="56px"
                  h="56px"
                  borderRadius="2xl"
                  bg="white/20"
                  backdropFilter="blur(8px)"
                  border="1px solid rgba(255, 255, 255, 0.3)"
                  color="white"
                  transition="transform 0.3s"
                  _groupHover={{ transform: 'scale(1.1)' }}
                >
                  <Icon type={IconType.CLOUD} size={28} />
                </Center>
                <Box
                  position="absolute"
                  inset={0}
                  bg="gradient-to-t"
                  gradientFrom="black/40"
                  gradientTo="transparent"
                  zIndex={1}
                />
                <HStack position="absolute" bottom={2} left={3} gap={2} zIndex={2}>
                  <Text fontSize="xs" fontWeight="bold" color="white">
                    New Folder
                  </Text>
                </HStack>
              </Box>
              <Text fontSize="2xs" color="fg.muted">
                Organize your files in subdirectories
              </Text>
            </Box>

            <Box
              flex={1}
              minW="240px"
              bg={{ base: 'white', _dark: 'rgba(23, 33, 43, 0.6)' }}
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="border"
              p={4}
              cursor="pointer"
              transition="all 0.3s"
              _hover={{ borderColor: 'primary/50', transform: 'translateY(-2px)' }}
              onClick={() => onShowToast('Server health is good!', 'success')}
              className="group"
            >
              <Box
                aspectRatio={16 / 9}
                borderRadius="xl"
                mb={4}
                bg={{ base: '#f4f6f8', _dark: '#18202a' }}
                overflow="hidden"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)' }}
              >
                <Center
                  w="56px"
                  h="56px"
                  borderRadius="2xl"
                  bg="white/20"
                  backdropFilter="blur(8px)"
                  border="1px solid rgba(255, 255, 255, 0.3)"
                  color="white"
                  transition="transform 0.3s"
                  _groupHover={{ transform: 'scale(1.1)' }}
                >
                  <Icon type={IconType.BOLT} size={28} />
                </Center>
                <Box
                  position="absolute"
                  inset={0}
                  bg="gradient-to-t"
                  gradientFrom="black/40"
                  gradientTo="transparent"
                  zIndex={1}
                />
                <HStack position="absolute" bottom={2} left={3} gap={2} zIndex={2}>
                  <Text fontSize="xs" fontWeight="bold" color="white">
                    Server Status
                  </Text>
                </HStack>
              </Box>
              <Text fontSize="2xs" color="fg.muted">
                Connected to Rust backend on port 50065
              </Text>
            </Box>
          </>
        )}
      </HStack>
    </Box>
  );
};

// Helper Functions
