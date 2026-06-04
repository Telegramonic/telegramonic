import { Box, HStack, Text } from '@chakra-ui/react';
import { UploadProgressBannerProps } from './types';

export const UploadProgressBanner = ({
  uploadingFile,
  uploadProgress,
}: UploadProgressBannerProps) => {
  if (!uploadingFile) return null;

  return (
    <Box p={4} bg="primary/5" border="1px solid" borderColor="primary/20" borderRadius="xl">
      <HStack justify="space-between" mb={2}>
        <Text fontSize="xs" fontWeight="bold" color="primary">
          Uploading {uploadingFile}...
        </Text>
        <Text fontSize="xs" fontWeight="bold" color="primary">
          {uploadProgress}%
        </Text>
      </HStack>
      <Box w="full" bg={{ base: '#e2e8f0', _dark: '#18202a' }} h="4px" borderRadius="full">
        <Box bg="primary" h="full" w={`${uploadProgress}%`} borderRadius="full" transition="width 0.1s linear" />
      </Box>
    </Box>
  );
};
