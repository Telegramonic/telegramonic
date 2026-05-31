import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Spinner,
} from '@chakra-ui/react';
import { appStore, selectApiCredentials, useShallow } from '@appStore';
import { Icon, IconType } from '@assets';
import { apiClient, FileMetadata, DriveStats } from '@services';


const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  } catch {
    return 'recently';
  }
};

const getIconType = (backendType: string): IconType => {
  switch (backendType) {
    case 'video':
      return IconType.VIDEO;
    case 'archive':
      return IconType.ZIP;
    default:
      return IconType.FILE;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { apiId, apiHash, clearApiCredentials } = appStore(
    useShallow(selectApiCredentials),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [stats, setStats] = useState<DriveStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, filesData] = await Promise.all([
        apiClient.getStats(),
        apiClient.getFiles(undefined, searchQuery || undefined),
      ]);
      setStats(statsData);
      setFiles(filesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [searchQuery]);

  const handleDisconnect = async () => {
    try {
      await apiClient.logOut();
    } catch (e) {
      console.error('Failed to log out from server:', e);
    }
    clearApiCredentials();
    navigate('/login');
  };

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

        {error && (
          <Box p={4} bg="error.100" color="error.500" borderRadius="xl">
            <Text fontSize="sm" fontWeight="bold">
              {error}
            </Text>
          </Box>
        )}

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
                {stats ? formatSize(stats.total_space) : 'Limitless'}
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
                Active Files
              </Text>
              <Heading size="lg" fontWeight="extrabold" color="fg">
                {stats ? `${stats.file_count} Files` : '0 Files'}
              </Heading>
              <Text fontSize="2xs" color="fg.muted">
                Direct-to-API secure chunks (Folders: {stats?.folder_count || 0})
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

          {/* Files List / Loading State */}
          {isLoading ? (
            <Center py={10}>
              <Spinner size="lg" color="primary" />
            </Center>
          ) : files.length === 0 ? (
            <Center py={10}>
              <VStack gap={2}>
                <Text fontSize="sm" color="fg.muted" fontWeight="bold">
                  No files found
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  Try uploading files or adjusting your search query.
                </Text>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
              {files.map((file) => (
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
                          getIconType(file.icon_type) === IconType.VIDEO
                            ? 'primary/10'
                            : getIconType(file.icon_type) === IconType.ZIP
                              ? 'warning/10'
                              : 'success/10'
                        }
                        color={
                          getIconType(file.icon_type) === IconType.VIDEO
                            ? 'primary'
                            : getIconType(file.icon_type) === IconType.ZIP
                              ? 'warning.400'
                              : 'success.400'
                        }
                        borderRadius="lg"
                      >
                        <Icon type={getIconType(file.icon_type)} />
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
                          {formatSize(file.size)} • {formatTime(file.created_at)}
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
