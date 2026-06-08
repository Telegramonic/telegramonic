import { Box, HStack, Text } from '@chakra-ui/react';
import { UploadProgressBannerProps } from './types';

export const UploadProgressBanner = ({
  uploadingFile,
  uploadProgress,
  onCancelUpload,
}: UploadProgressBannerProps) => {
  if (!uploadingFile) return null;

  return (
    <Box p={4} bg="primary/5" border="1px solid" borderColor="primary/20" borderRadius="xl">
      <HStack justify="space-between" mb={2}>
        <Text fontSize="xs" fontWeight="bold" color="primary" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" maxW="70%">
          Uploading {uploadingFile}...
        </Text>
        <HStack gap={2}>
          <Text fontSize="xs" fontWeight="bold" color="primary">
            {uploadProgress}%
          </Text>
          {onCancelUpload && (
            <Box
              as="button"
              onClick={onCancelUpload}
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
              Cancel
            </Box>
          )}
        </HStack>
      </HStack>
      <Box w="full" bg={{ base: '#e2e8f0', _dark: '#18202a' }} h="4px" borderRadius="full">
        <Box bg="primary" h="full" w={`${uploadProgress}%`} borderRadius="full" transition="width 0.1s linear" />
      </Box>
    </Box>
  );
};
