import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Table,
  Center,
} from '@chakra-ui/react';
import Icon from '@assets/Icon';
import { IconType } from '@assets/types';
import { appStore, selectApiCredentials, useShallow } from '@appStore';
import { motion, AnimatePresence } from 'framer-motion';

interface StorageFile {
  id: string;
  name: string;
  type: 'presentation' | 'code' | 'zip' | 'document' | 'folder' | 'video' | 'csv';
  owner: string;
  ownerAvatar?: string;
  lastModified: string;
  size: string;
  starred?: boolean;
  inTrash?: boolean;
  sizeBytes: number;
}

const INITIAL_FILES: StorageFile[] = [
  {
    id: '1',
    name: 'Project_Requirements_v2.pdf',
    type: 'document',
    owner: 'Me',
    ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2AmRvnpy6gkvqpv3BnMRECKxXrEKiIXVPVxwRK9QMBE9JdERp8Uisibnq-QDcmBYB3mUFQM6DE0nOKkiCGq7wsHJQErzu2GdrN5nTT239ITiadjqqTlJ4U3n6UrU3wq4ij_-l2EK0uLaSrXyWNCeM5VsppjlDfJuCJkrbAVm_rSG654FRXyZJXouEK9BGy9gjs0GGFOPKhlYMQ4WL6AWKcNMzxbPvrxM3vovXqGUOACIOoH__g1BFxo7HJ6WSu-KqGs1S_w7_ek',
    lastModified: 'Oct 24, 2024',
    size: '2.4 MB',
    sizeBytes: 2.4 * 1024 * 1024,
    starred: true,
  },
  {
    id: '2',
    name: 'Marketing Assets',
    type: 'folder',
    owner: 'Sarah J.',
    ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7MPTmtcyopznIMKvdRxWYUPiWYsF0kHopvfmqQ5rTOW_-5S6EW1-NY8_2Lf3cyaDbgJE_82Pjh9sDoa8EhFo850Rjl3PYo46VqszcmA8FldjF9uN4Qh6IL5eDYvYskDst77iB9nK-2JGd4_9doB8jnguTZ2pEapUOMSpBlsBj1kqsdPcLXPIA458WMXpyDsh9eRjaQtA-g48UuRbap7V2g4VxX0bJPtNyXWnsay3eqf0T7BI2uH76Cz4q96wc5AfHSV7AZiXAWHI',
    lastModified: 'Oct 22, 2024',
    size: '142.8 MB',
    sizeBytes: 142.8 * 1024 * 1024,
  },
  {
    id: '3',
    name: 'Product_Demo_Final.mp4',
    type: 'video',
    owner: 'Me',
    ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2AmRvnpy6gkvqpv3BnMRECKxXrEKiIXVPVxwRK9QMBE9JdERp8Uisibnq-QDcmBYB3mUFQM6DE0nOKkiCGq7wsHJQErzu2GdrN5nTT239ITiadjqqTlJ4U3n6UrU3wq4ij_-l2EK0uLaSrXyWNCeM5VsppjlDfJuCJkrbAVm_rSG654FRXyZJXouEK9BGy9gjs0GGFOPKhlYMQ4WL6AWKcNMzxbPvrxM3vovXqGUOACIOoH__g1BFxo7HJ6WSu-KqGs1S_w7_ek',
    lastModified: 'Oct 20, 2024',
    size: '854.0 MB',
    sizeBytes: 854 * 1024 * 1024,
    starred: true,
  },
  {
    id: '4',
    name: 'User_Data_Analytics.csv',
    type: 'csv',
    owner: 'Alex W.',
    ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByXsdtfoqQtAqUw_IpyNTaugLEWMXDQCbkAqmXTAFb1V4JCnawe-M0q-M7W66D9S4_7P3s074242Vd0zkSBtPvULKC0hXD4fNuhUUAX8uiLkllFePT6GrbqlILxxoPBy7_nSYUM625n6yDm3RXDPZ0T5Ge1FejvQ6_NkBWL3WIt_1AF18ePps9NUtlyjDHXaBDUgUL-rtegI1f36dhiGF_n4t84xO8ZkiCrgPtNBmR0IJ1K0kqUJ8uTxdq9_KjaBGFdfKT-mkS7aY',
    lastModified: 'Oct 19, 2024',
    size: '12.5 MB',
    sizeBytes: 12.5 * 1024 * 1024,
  },
];

const SUGGESTED_CARDS = [
  {
    name: 'Q4 Roadmap.pptx',
    type: 'presentation',
    modified: 'Modified 2h ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZrAVxqIjrYZy0SilssXJVX-Mey09pyrrIEzsLjSD_Uqd36TvdY_5xCR-aYDluZczP66LGagZJdccl8BOHnWCTUeNROIwGJATqrmowLx-VbUHtHlF_pFKCa24e04Nv7fMxVJVDV_C8cd0QZD829Fhi2Zdx1GAamXmac95fWlqSWihkgEqom_Yih53mxKg2MMOAu09GFsC6ycYDZWkvNWQmstnNUgJ6CxK5nnVvuUimN1ORYwR1Dt7fwlPsfLYUi2pq_5j19WEdQ7o',
  },
  {
    name: 'api_integration.js',
    type: 'code',
    modified: 'Modified 5h ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5rMlbhDkM0NG4ne-bd0l-adl-lRn9OjN4qCQCAjmEXNwnXcRTx1f2rfm4eg-mTRS6iV03Bn6RCogZ5at5zIhWyNCCF51HPl5Vl5516fahYJifavTkKrgPfJfU7YJODt5vKckCXAi7W0C5kiApagPC1KSH_afFqGfolNkAKe1ie4hAzSlK3_DneU4OscN5xmIgYOjwqrrQ3zwSGakjd12b656vKa0o21R7dC_y9sPLIJT_bZd9zmNI8W1R75YNI-FL3kTKhiljGYg',
  },
  {
    name: 'Brand_Assets.zip',
    type: 'zip',
    modified: 'Modified yesterday',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4GICNIPTXk39gi_97Q3IE0fi7bHddNkHYKeVUbM80gA_rgprkrvhD9wj641rPePRL9yVGNrnWrs3s0uM-9ftWNaRUrRLEyECXU2Hi5ugWNZTXgtbM-9BxJrUDx-vRPopluQPNGtHl6SOXpi7Fc1mtRk5R_Jhs1Q5BBtbugv5-wrLzRdxrnc2Tst_KyMz9hxeWEHaueduwGYkYqCt2QAESDr0HT5_vvm00OlN9jJuaoJsM2_ZzAw-pM2oPoAw8lKfnfIVCYgypwcA',
  },
];

const Dashboard = () => {
  const { clearApiCredentials } = appStore(useShallow(selectApiCredentials));

  const [files, setFiles] = useState<StorageFile[]>(INITIAL_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'starred' | 'trash'>('all');
  
  // Custom Toast System state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  
  // Simulated uploading state
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Storage usage calculation
  const totalStorageGB = 100;
  const currentUsageGB = useMemo(() => {
    // Basic base storage 45GB plus sum of any files added
    const extraBytes = files
      .filter((f) => !f.inTrash)
      .reduce((acc, f) => acc + (f.id !== '1' && f.id !== '2' && f.id !== '3' && f.id !== '4' ? f.sizeBytes : 0), 0);
    const extraGB = extraBytes / (1024 * 1024 * 1024);
    return Math.min(totalStorageGB, parseFloat((45.2 + extraGB).toFixed(2)));
  }, [files]);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLogout = () => {
    clearApiCredentials();
    showToast('Logged out successfully', 'info');
  };

  const handleUpgradeStorage = () => {
    showToast('Simulated: Storage Upgraded to 1 TB!', 'success');
  };

  const handleShareFile = (file: StorageFile) => {
    const link = `https://telegramonic.cloud/share/${file.id}`;
    navigator.clipboard.writeText(link).then(() => {
      showToast(`Link copied: ${file.name}`, 'success');
    }).catch(() => {
      showToast(`Failed to copy link`, 'error');
    });
  };

  const handleToggleStar = (file: StorageFile) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, starred: !f.starred } : f))
    );
    showToast(
      file.starred ? `Removed star: ${file.name}` : `Starred: ${file.name}`,
      'success'
    );
  };

  const handleToggleTrash = (file: StorageFile) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, inTrash: !f.inTrash } : f))
    );
    showToast(
      file.inTrash ? `Restored: ${file.name}` : `Moved to trash: ${file.name}`,
      'success'
    );
  };

  const handleSimulateUpload = () => {
    const fileNames = [
      'Marketing_Strategy_2026.docx',
      'Finance_Report_Q2.xlsx',
      'Architecture_Diagram.png',
      'Backup_Server_Config.yaml',
    ];
    const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
    
    // Check if file already exists in files list
    if (files.some((f) => f.name === randomName && !f.inTrash)) {
      showToast('File already uploaded recently', 'info');
      return;
    }

    setUploadingFile(randomName);
    setUploadProgress(0);
  };

  // Upload Progress simulation
  useEffect(() => {
    if (uploadingFile === null) return;
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const randomSizeMB = (Math.random() * 15 + 1).toFixed(1);
            const newFile: StorageFile = {
              id: Date.now().toString(),
              name: uploadingFile,
              type: uploadingFile.endsWith('.docx') ? 'document' : uploadingFile.endsWith('.xlsx') ? 'csv' : 'code',
              owner: 'Me',
              ownerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_2AmRvnpy6gkvqpv3BnMRECKxXrEKiIXVPVxwRK9QMBE9JdERp8Uisibnq-QDcmBYB3mUFQM6DE0nOKkiCGq7wsHJQErzu2GdrN5nTT239ITiadjqqTlJ4U3n6UrU3wq4ij_-l2EK0uLaSrXyWNCeM5VsppjlDfJuCJkrbAVm_rSG654FRXyZJXouEK9BGy9gjs0GGFOPKhlYMQ4WL6AWKcNMzxbPvrxM3vovXqGUOACIOoH__g1BFxo7HJ6WSu-KqGs1S_w7_ek',
              lastModified: 'Just now',
              size: `${randomSizeMB} MB`,
              sizeBytes: parseFloat(randomSizeMB) * 1024 * 1024,
            };
            setFiles((prev) => [newFile, ...prev]);
            showToast(`Uploaded successfully: ${uploadingFile}`, 'success');
            setUploadingFile(null);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [uploadingFile]);

  // Filtering files based on Tab & Search Query
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      // Search matching
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Tab matching
      if (activeTab === 'trash') {
        return f.inTrash && matchesSearch;
      }
      
      // If not looking at trash, ignore files that are in trash
      if (f.inTrash) return false;

      if (activeTab === 'starred') {
        return f.starred && matchesSearch;
      }
      if (activeTab === 'recent') {
        return (f.lastModified.includes('ago') || f.lastModified.includes('now') || f.lastModified.includes('Oct 24')) && matchesSearch;
      }
      return matchesSearch;
    });
  }, [files, activeTab, searchQuery]);

  const getFileIconType = (type: string): IconType => {
    switch (type) {
      case 'video':
        return IconType.VIDEO;
      case 'zip':
        return IconType.ZIP;
      case 'document':
        return IconType.FILE;
      case 'folder':
        return IconType.CLOUD; // Using Cloud as folder replacement representation
      default:
        return IconType.FILE;
    }
  };

  return (
    <Box bg={{ base: '#f4f6f8', _dark: '#0b141d' }} minH="calc(100vh - 38px)" color="fg" display="flex" flexDirection="column" position="relative">
      {/* 1. Header/TopNavBar */}
      <HStack
        h="64px"
        borderBottom="1px solid"
        borderBottomColor={{ base: '#e2e8f0', _dark: '#2f3942' }}
        px={6}
        justifyContent="space-between"
        bg={{ base: 'white', _dark: '#0b141d' }}
        position="sticky"
        top={0}
        zIndex={40}
      >
        <HStack gap={8} flex={1}>
          <HStack gap={3}>
            <Box w={8} h={8}>
              {/* Uses the beautiful stack hard drives logo */}
              <Icon type={IconType.LOGO} size="100%" />
            </Box>
            <Text fontSize="lg" fontWeight="extrabold" color="primary">
              Telegramonic
            </Text>
          </HStack>
          
          {/* Search bar */}
          <Box position="relative" maxW="380px" w="100%">
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="fg.muted" zIndex={2}>
              <Icon type={IconType.SEARCH} size={16} />
            </Box>
            <Input
              placeholder="Search files, folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg={{ base: '#e2e8f0/50', _dark: '#18202a' }}
              border="none"
              borderRadius="xl"
              h="40px"
              pl={10}
              pr={4}
              fontSize="sm"
              color="fg"
              _focus={{
                borderColor: 'primary',
                ring: '1px',
                ringColor: 'primary',
              }}
              _placeholder={{ color: 'outline' }}
            />
          </Box>
        </HStack>

        <HStack gap={4}>
          <Button
            onClick={handleSimulateUpload}
            bg="primary"
            color="white"
            borderRadius="xl"
            h="40px"
            px={5}
            fontSize="sm"
            fontWeight="bold"
            _hover={{ filter: 'brightness(1.1)' }}
            display="flex"
            gap={2}
          >
            <Icon type={IconType.CLOUD_UPLOAD} size={16} />
            Upload File
          </Button>

          <Box
            w={8}
            h={8}
            borderRadius="full"
            overflow="hidden"
            border="1px solid"
            borderColor="border"
          >
            <img
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_2AmRvnpy6gkvqpv3BnMRECKxXrEKiIXVPVxwRK9QMBE9JdERp8Uisibnq-QDcmBYB3mUFQM6DE0nOKkiCGq7wsHJQErzu2GdrN5nTT239ITiadjqqTlJ4U3n6UrU3wq4ij_-l2EK0uLaSrXyWNCeM5VsppjlDfJuCJkrbAVm_rSG654FRXyZJXouEK9BGy9gjs0GGFOPKhlYMQ4WL6AWKcNMzxbPvrxM3vovXqGUOACIOoH__g1BFxo7HJ6WSu-KqGs1S_w7_ek"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </HStack>
      </HStack>

      <HStack flex={1} alignItems="stretch" gap={0} overflow="hidden">
        {/* 2. SideNavBar */}
        <VStack
          w="280px"
          bg={{ base: 'white', _dark: '#18202a' }}
          borderRight="1px solid"
          borderColor="border"
          p={4}
          alignItems="stretch"
          justifyContent="space-between"
          flexShrink={0}
        >
          <VStack gap={4} align="stretch">
            {/* Storage visualizer */}
            <Box p={4} borderRadius="2xl" bg={{ base: '#f4f6f8', _dark: '#131c26' }} borderWidth="1px" borderColor="border">
              <HStack gap={3} mb={3}>
                <Box p={2} bg="primary/10" borderRadius="lg" color="primary">
                  <Icon type={IconType.CLOUD} size={20} />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" fontWeight="bold" color="fg">
                    My Storage
                  </Text>
                  <Text fontSize="10px" color="fg.muted">
                    {currentUsageGB} GB of {totalStorageGB} GB used
                  </Text>
                </VStack>
              </HStack>
              
              {/* Animated/Smooth storage bar */}
              <Box w="full" bg={{ base: '#e2e8f0', _dark: '#18202a' }} h="6px" borderRadius="full" overflow="hidden">
                <Box
                  bg="primary"
                  h="full"
                  style={{
                    width: `${(currentUsageGB / totalStorageGB) * 100}%`,
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 0 8px var(--chakra-colors-primary)',
                  }}
                  borderRadius="full"
                />
              </Box>
              
              <Button
                onClick={handleUpgradeStorage}
                w="full"
                mt={4}
                variant="outline"
                borderColor="primary/30"
                color="primary"
                h="32px"
                fontSize="xs"
                fontWeight="bold"
                borderRadius="lg"
                _hover={{ bg: 'primary/5' }}
              >
                Upgrade Storage
              </Button>
            </Box>

            {/* Navigation links */}
            <VStack gap={1} align="stretch">
              {[
                { tab: 'all', label: 'All Files', icon: IconType.CLOUD },
                { tab: 'recent', label: 'Recent', icon: IconType.SYNC },
                { tab: 'starred', label: 'Starred', icon: IconType.LOGO }, // Star symbol helper
                { tab: 'trash', label: 'Trash', icon: IconType.LOCK },
              ].map(({ tab, label, icon }) => (
                <HStack
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  cursor="pointer"
                  px={4}
                  py={3}
                  bg={activeTab === tab ? { base: 'primary/10', _dark: '#3f4a59/40' } : 'transparent'}
                  color={activeTab === tab ? 'primary' : 'fg.muted'}
                  borderRadius="xl"
                  fontWeight={activeTab === tab ? 'bold' : 'medium'}
                  _hover={{ bg: activeTab === tab ? { base: 'primary/15', _dark: '#3f4a59/40' } : 'bg.hover', color: 'fg' }}
                  transition="all 0.2s"
                  gap={3}
                >
                  <Icon type={icon} size={18} />
                  <Text fontSize="sm">{label}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>

          {/* Bottom Sidebar navigation */}
          <VStack gap={1} align="stretch" borderTop="1px solid" borderColor="border" pt={4}>
            <HStack
              cursor="pointer"
              px={4}
              py={3}
              color="fg.muted"
              borderRadius="xl"
              _hover={{ bg: 'bg.hover/20', color: 'fg' }}
              transition="all 0.2s"
              gap={3}
            >
              <Icon type={IconType.BOLT} size={18} />
              <Text fontSize="sm">Help</Text>
            </HStack>
            <HStack
              onClick={handleLogout}
              cursor="pointer"
              px={4}
              py={3}
              color="error.400"
              borderRadius="xl"
              _hover={{ bg: 'error.500/10' }}
              transition="all 0.2s"
              gap={3}
            >
              <Icon type={IconType.LOCK} size={18} />
              <Text fontSize="sm">Logout</Text>
            </HStack>
          </VStack>
        </VStack>

        {/* 3. Main content area */}
        <Box flex={1} p={8} overflowY="auto" className="custom-scrollbar">
          <VStack gap={8} align="stretch" maxW="1100px" mx="auto">
            {/* Simulated uploading progress bar */}
            {uploadingFile && (
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
            )}

            {/* Suggested Section (Bento grid style cards) */}
            {activeTab === 'all' && (
              <Box>
                <Heading size="sm" mb={4} fontWeight="bold" color="fg">
                  Suggested Files
                </Heading>
                <HStack gap={6} align="stretch" wrap="wrap">
                  {SUGGESTED_CARDS.map((card) => (
                    <Box
                      key={card.name}
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
                      className="group"
                    >
                      <Box
                        aspectRatio={16 / 9}
                        borderRadius="xl"
                        mb={4}
                        bg={{ base: '#f4f6f8', _dark: '#18202a' }}
                        overflow="hidden"
                        position="relative"
                      >
                        <img
                          alt={card.name}
                          src={card.image}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s',
                          }}
                          className="group-hover:scale-105"
                        />
                        <Box
                          position="absolute"
                          inset={0}
                          bg="gradient-to-t"
                          gradientFrom="black/75"
                          gradientTo="transparent"
                        />
                        <HStack position="absolute" bottom={2} left={3} gap={2}>
                          <Icon type={getFileIconType(card.type)} size={16} color="white" />
                          <Text fontSize="xs" fontWeight="bold" color="white">
                            {card.name}
                          </Text>
                        </HStack>
                      </Box>
                      <HStack justify="space-between">
                        <Text fontSize="2xs" color="fg.muted">
                          {card.modified}
                        </Text>
                        <Box color="fg.muted" _groupHover={{ color: 'primary' }} transition="colors 0.2s">
                          <Icon type={IconType.SHARE} size={16} />
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </HStack>
              </Box>
            )}

            {/* Detailed Files Table */}
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
              
              {filteredFiles.length === 0 ? (
                <Center py={16} borderWidth="1px" borderColor="border" borderStyle="dashed" borderRadius="2xl">
                  <VStack gap={2}>
                    <Box color="fg.muted" opacity={0.6}>
                      <Icon type={IconType.CLOUD} size={32} />
                    </Box>
                    <Text fontSize="sm" color="fg.muted">
                      No files found.
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
                      {filteredFiles.map((file) => (
                        <Table.Row
                          key={file.id}
                          borderColor="border/40"
                          _hover={{ bg: { base: '#f4f6f8', _dark: '#18202a/40' } }}
                          transition="background-color 0.2s"
                        >
                          <Table.Cell>
                            <HStack gap={3}>
                              <Box color={file.type === 'folder' ? 'yellow.400' : 'primary'}>
                                <Icon type={getFileIconType(file.type)} size={18} />
                              </Box>
                              <Text fontSize="sm" fontWeight="medium" color="fg">
                                {file.name}
                              </Text>
                            </HStack>
                          </Table.Cell>
                          <Table.Cell>
                            <HStack gap={2}>
                              {file.ownerAvatar ? (
                                <Box w={5} h={5} borderRadius="full" overflow="hidden" border="1px solid" borderColor="border">
                                  <img alt={file.owner} src={file.ownerAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                              ) : (
                                <Center w={5} h={5} borderRadius="full" bg="primary/20" fontSize="2xs" fontWeight="bold" color="primary">
                                  {file.owner.substring(0, 2).toUpperCase()}
                                </Center>
                              )}
                              <Text fontSize="sm" color="fg.muted">
                                {file.owner}
                              </Text>
                            </HStack>
                          </Table.Cell>
                          <Table.Cell fontSize="sm" color="fg.muted">
                            {file.lastModified}
                          </Table.Cell>
                          <Table.Cell fontSize="sm" color="fg.muted">
                            {file.size}
                          </Table.Cell>
                          <Table.Cell textAlign="right">
                            <HStack gap={1} justify="flex-end">
                              {/* Star Icon Button */}
                              {activeTab !== 'trash' && (
                                <Box
                                  as="button"
                                  onClick={() => handleToggleStar(file)}
                                  p={1.5}
                                  borderRadius="md"
                                  color={file.starred ? 'yellow.400' : 'fg.muted'}
                                  _hover={{ bg: 'bg.hover/20', color: file.starred ? 'yellow.300' : 'fg' }}
                                  transition="all 0.2s"
                                  title={file.starred ? 'Remove Star' : 'Star File'}
                                >
                                  ★
                                </Box>
                              )}
                              
                              {/* Share Icon Button */}
                              {activeTab !== 'trash' && (
                                <Box
                                  as="button"
                                  onClick={() => handleShareFile(file)}
                                  p={1.5}
                                  borderRadius="md"
                                  color="fg.muted"
                                  _hover={{ bg: 'bg.hover/20', color: 'primary' }}
                                  transition="all 0.2s"
                                  title="Share Link"
                                >
                                  <Icon type={IconType.SHARE} size={15} />
                                </Box>
                              )}

                              {/* Delete / Restore Button */}
                              <Box
                                as="button"
                                onClick={() => handleToggleTrash(file)}
                                p={1.5}
                                borderRadius="md"
                                color={activeTab === 'trash' ? 'success.400' : 'error.400'}
                                _hover={{ bg: activeTab === 'trash' ? 'success.500/10' : 'error.500/10' }}
                                transition="all 0.2s"
                                title={activeTab === 'trash' ? 'Restore File' : 'Move to Trash'}
                                fontSize="xs"
                                fontWeight="bold"
                              >
                                {activeTab === 'trash' ? '↺' : '✕'}
                              </Box>
                            </HStack>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}
            </Box>
          </VStack>
        </Box>
      </HStack>

      {/* 4. Footer */}
      <HStack
        h="48px"
        bg={{ base: 'white', _dark: '#060f18' }}
        borderTop="1px solid"
        borderColor="border"
        px={6}
        justifyContent="space-between"
        fontSize="xs"
        color="fg.muted"
        zIndex={40}
      >
        <HStack gap={6}>
          <Text fontWeight="bold" color="fg.muted">
            © 2026 Telegramonic Cloud
          </Text>
          <HStack gap={4} display={{ base: 'none', md: 'flex' }}>
            <Text cursor="pointer" _hover={{ color: 'primary' }}>
              Privacy Policy
            </Text>
            <Text cursor="pointer" _hover={{ color: 'primary' }}>
              Terms of Service
            </Text>
            <Text cursor="pointer" _hover={{ color: 'primary' }}>
              API Status
            </Text>
          </HStack>
        </HStack>

        <HStack gap={2}>
          <Box w={2} h={2} borderRadius="full" bg="success.400" className="pulse-anim" />
          <Text color="fg.muted">All Systems Operational</Text>
        </HStack>
      </HStack>

      {/* 5. Custom Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              zIndex: 2000,
            }}
          >
            <HStack
              bg={{ base: 'white', _dark: '#18202a' }}
              borderWidth="1px"
              borderColor={
                toastType === 'success'
                  ? 'success.400'
                  : toastType === 'error'
                    ? 'error.400'
                    : 'primary'
              }
              borderRadius="xl"
              px={5}
              py={3.5}
              shadow="2xl"
              gap={3}
            >
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg={
                  toastType === 'success'
                    ? 'success.400'
                    : toastType === 'error'
                      ? 'error.400'
                      : 'primary'
                }
              />
              <Text fontSize="sm" fontWeight="bold" color="fg">
                {toastMessage}
              </Text>
            </HStack>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.6; transform: scale(1); }
        }
        .pulse-anim {
          animation: pulse 2s infinite ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--chakra-colors-border);
          border-radius: 10px;
        }
      `}</style>
    </Box>
  );
};

export default Dashboard;
