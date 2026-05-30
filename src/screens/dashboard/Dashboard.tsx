import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Separator,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { appStore, selectApiCredentials, useShallow } from '@appStore';
import { Icon, IconType } from '@assets';

interface MockFile {
  id: number;
  name: string;
  size: string;
  fileExt: string;
  createdAt: string;
  iconType: IconType;
}

const MOCK_FILES: MockFile[] = [
  {
    id: 1,
    name: 'Video_Tutorial.mp4',
    size: '1.2 GB',
    fileExt: 'mp4',
    createdAt: '2 hours ago',
    iconType: IconType.VIDEO,
  },
  {
    id: 2,
    name: 'Invoice_May.pdf',
    size: '245 KB',
    fileExt: 'pdf',
    createdAt: '5 hours ago',
    iconType: IconType.FILE,
  },
  {
    id: 3,
    name: 'Family_Photos.zip',
    size: '450 MB',
    fileExt: 'zip',
    createdAt: 'Yesterday',
    iconType: IconType.ZIP,
  },
  {
    id: 4,
    name: 'Design_Assets.fig',
    size: '89 MB',
    fileExt: 'fig',
    createdAt: '2 days ago',
    iconType: IconType.FILE,
  },
  {
    id: 5,
    name: 'Budget_2026.xlsx',
    size: '1.4 MB',
    fileExt: 'xlsx',
    createdAt: '3 days ago',
    iconType: IconType.FILE,
  },
  {
    id: 6,
    name: 'Presentation_Pitch.pptx',
    size: '12 MB',
    fileExt: 'pptx',
    createdAt: '5 days ago',
    iconType: IconType.FILE,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { apiId, apiHash, clearApiCredentials } = appStore(
    useShallow(selectApiCredentials),
  );
  const [searchQuery, setSearchQuery] = useState('');

  const handleDisconnect = () => {
    clearApiCredentials();
    navigate('/login');
  };

  const filteredFiles = MOCK_FILES.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box minH="90vh" py={10} px={{ base: 4, md: 8 }} bg="bg.default">
      <VStack gap={8} align="stretch" maxW="1200px" mx="auto">
        {/* Header Panel */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <VStack align="start" gap={1}>
            <Heading size="xl" fontWeight="extrabold" color="fg">
              Telegram Drive Dashboard
            </Heading>
            <HStack gap={2}>
              <Box w={2} h={2} borderRadius="full" bg="success.400" />
              <Text fontSize="xs" color="fg.muted">
                MTProto active connection: API ID {apiId} (Hash:{' '}
                {apiHash ? `${apiHash.slice(0, 6)}...` : 'N/A'})
              </Text>
            </HStack>
          </VStack>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            borderColor="error.400"
            color="error.400"
            _hover={{ bg: 'error.100', color: 'error.500' }}
            borderRadius="xl"
            fontWeight="bold"
            px={5}
            h="44px"
          >
            Disconnect Drive
          </Button>
        </HStack>

        {/* Stats Row */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Box
            p={6}
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            shadow="md"
          >
            <VStack align="start" gap={1}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Total Storage
              </Text>
              <Heading size="lg" fontWeight="extrabold" color="primary">
                Limitless
              </Heading>
              <Text fontSize="2xs" color="fg.muted">
                Powered by Telegram Cloud Infrastructure
              </Text>
            </VStack>
          </Box>
          <Box
            p={6}
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            shadow="md"
          >
            <VStack align="start" gap={1}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Active Uploads
              </Text>
              <Heading size="lg" fontWeight="extrabold" color="fg">
                {MOCK_FILES.length} Files
              </Heading>
              <Text fontSize="2xs" color="fg.muted">
                Direct-to-API secure chunks
              </Text>
            </VStack>
          </Box>
          <Box
            p={6}
            bg="bg.panel"
            borderRadius="2xl"
            border="1px solid"
            borderColor="border"
            shadow="md"
          >
            <VStack align="start" gap={1}>
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                Encryption Protocol
              </Text>
              <Heading size="lg" fontWeight="extrabold" color="success.400">
                MTProto 2.0
              </Heading>
              <Text fontSize="2xs" color="fg.muted">
                End-to-end user client keys
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* File Manager Section */}
        <VStack
          align="stretch"
          bg="bg.panel"
          borderRadius="2xl"
          border="1px solid"
          borderColor="border"
          p={{ base: 6, md: 8 }}
          shadow="lg"
          gap={6}
        >
          {/* Controls */}
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Heading size="md" fontWeight="bold" color="fg">
              My Files
            </Heading>
            <HStack w={{ base: '100%', md: '300px' }} gap={2}>
              <Box position="relative" w="100%">
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  border="1px solid"
                  borderColor="border"
                  borderRadius="xl"
                  px={4}
                  h="40px"
                  _focus={{
                    borderColor: 'primary',
                    ring: '1px',
                    ringColor: 'primary',
                  }}
                  _placeholder={{ fontSize: 'sm' }}
                />
              </Box>
            </HStack>
          </HStack>

          <Separator bg="border" />

          {/* Files List */}
          {filteredFiles.length === 0 ? (
            <Center py={10}>
              <VStack gap={2}>
                <Text fontSize="sm" color="fg.muted" fontWeight="bold">
                  No files found
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  Try adjusting your search query.
                </Text>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
              {filteredFiles.map((file) => (
                <Box
                  key={file.id}
                  p={4}
                  bg="bg.default"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="border"
                  _hover={{
                    shadow: 'md',
                    transform: 'translateY(-2px)',
                    borderColor: 'primary/50',
                  }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between" align="center" h="100%">
                    <HStack gap={3.5}>
                      <Box
                        p={2.5}
                        bg={
                          file.iconType === IconType.VIDEO
                            ? 'primary/10'
                            : file.iconType === IconType.ZIP
                              ? 'warning/10'
                              : 'success/10'
                        }
                        color={
                          file.iconType === IconType.VIDEO
                            ? 'primary'
                            : file.iconType === IconType.ZIP
                              ? 'warning.400'
                              : 'success.400'
                        }
                        borderRadius="lg"
                      >
                        <Icon type={file.iconType} />
                      </Box>
                      <VStack align="start" gap={0}>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="fg"
                          maxW="180px"
                          truncate
                        >
                          {file.name}
                        </Text>
                        <Text fontSize="10px" color="fg.muted">
                          {file.size} • {file.createdAt}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Dashboard;
