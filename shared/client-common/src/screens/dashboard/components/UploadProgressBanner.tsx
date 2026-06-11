import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { UploadProgressBannerProps } from './types';

export const UploadProgressBanner = ({
  uploadingFile,
  uploadProgress,
  onCancelUpload,
  activeUploads,
}: UploadProgressBannerProps) => {
  const { t } = useTranslation();
  // Normalize into a single uniform array for display
  const uploads =
    activeUploads ||
    (uploadingFile
      ? [
          {
            id: 'single',
            name: uploadingFile,
            progress: uploadProgress ?? 0,
            onCancel: onCancelUpload,
          },
        ]
      : []);

  if (uploads.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes stream-stripes {
          0% { background-position: 0 0; }
          100% { background-position: 16px 0; }
        }
      `}</style>
      <VStack
        gap={4}
        p={4}
        bg="primary/5"
        border="1px solid"
        borderColor="primary/20"
        borderRadius="xl"
        align="stretch"
        backdropFilter="blur(8px)"
        boxShadow="0 8px 32px 0 rgba(0, 136, 204, 0.06)"
      >
        {uploads.map((upload) => (
          <Box key={upload.id} w="full">
            <HStack justify="space-between" mb={2}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="primary"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                maxW="70%"
              >
                {t('Dashboard.uploadProgress.uploading', { name: upload.name })}
              </Text>
              <HStack gap={2}>
                <Text fontSize="xs" fontWeight="bold" color="primary">
                  {upload.progress}%
                </Text>
                {upload.onCancel && (
                  <Box
                    as="button"
                    onClick={upload.onCancel}
                    fontSize="2xs"
                    fontWeight="bold"
                    px={2}
                    py="2px"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="red.500/30"
                    color="red.500"
                    bg="red.500/10"
                    _hover={{ bg: 'red.500/20' }}
                    transition="all 0.2s"
                    style={{ cursor: 'pointer' }}
                  >
                    {t('Dashboard.cancel')}
                  </Box>
                )}
              </HStack>
            </HStack>
            <Box
              w="full"
              bg={{ base: '#e2e8f0', _dark: '#18202a' }}
              h="6px"
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                bg="primary"
                h="full"
                w={`${upload.progress}%`}
                borderRadius="full"
                transition="width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="hidden"
              >
                {/* Animated stripes overlay representing stream flow */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  backgroundImage="linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.25) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.25) 50%,
                    rgba(255, 255, 255, 0.25) 75%,
                    transparent 75%,
                    transparent
                  )"
                  backgroundSize="16px 16px"
                  animation="stream-stripes 1s infinite linear"
                  opacity={0.8}
                />
                {/* Glowing leading edge tip */}
                {upload.progress > 0 && upload.progress < 100 && (
                  <Box
                    position="absolute"
                    right={0}
                    top={0}
                    bottom={0}
                    w="12px"
                    bgGradient="linear(to-r, rgba(255,255,255,0), rgba(255,255,255,0.6) 50%, #fff)"
                    filter="blur(0.5px)"
                  />
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </VStack>
    </>
  );
};
