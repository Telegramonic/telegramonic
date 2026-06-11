import * as React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Menu,
  Spinner,
} from '@chakra-ui/react';
import { MdPreview, getMdFileDataInString } from '@components/MdPreview';
import { TitleBoxContainer } from '@components';
import { Icon, IconType } from '@assets';
import { DOCS_TOPICS } from './config';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const parseHeadings = (markdown: string): HeadingItem[] => {
  const lines = markdown.split('\n');
  const headings: HeadingItem[] = [];

  lines.forEach((line) => {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length; // 2 or 3
      const text = match[2].trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }
  });

  return headings;
};

const DocsPage = () => {
  const { docId } = useParams<{ docId?: string }>();
  const navigate = useNavigate();
  const [mdContent, setMdContent] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [headings, setHeadings] = React.useState<HeadingItem[]>([]);

  // Find all doc items flat
  const flatDocs = React.useMemo(() => {
    return DOCS_TOPICS.flatMap((topic) => topic.items);
  }, []);

  // Determine active doc item
  const activeDoc = React.useMemo(() => {
    if (!docId) return flatDocs[0];
    return flatDocs.find((doc) => doc.id === docId) || flatDocs[0];
  }, [docId, flatDocs]);

  // Fetch markdown content
  React.useEffect(() => {
    if (!activeDoc) return;

    setIsLoading(true);
    setMdContent('');
    setHeadings([]);

    getMdFileDataInString(activeDoc.filePath, (data) => {
      setMdContent(data);
      setHeadings(parseHeadings(data));
      setIsLoading(false);
    });
  }, [activeDoc]);

  // Handle direct navigation to /docs
  if (!docId && activeDoc) {
    return <Navigate to={`/docs/${activeDoc.id}`} replace />;
  }

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <TitleBoxContainer
      title={`Docs - ${activeDoc?.title || ''}`}
      icon="app"
      display="flex"
      flexDirection="column"
      width="100%"
      bg="bg.default"
    >
      {/* CSS Scroll Margin Fix for Sticky Header */}
      <style>{`
        [id] {
          scroll-margin-top: 80px;
        }
      `}</style>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        width="100%"
        maxW="1400px"
        mx="auto"
        minH="calc(100vh - 4rem)"
        position="relative"
      >
        {/* ===================================================================
            1. LEFT COLUMN: NAVIGATION SIDEBAR (Desktop only)
            =================================================================== */}
        <Box
          display={{ base: 'none', lg: 'block' }}
          width="260px"
          position="sticky"
          top="16"
          height="calc(100vh - 4rem)"
          overflowY="auto"
          borderRightWidth="1px"
          borderRightColor="border"
          bg="bg.panel"
          py={8}
          px={6}
        >
          <VStack align="stretch" gap={6}>
            {DOCS_TOPICS.map((topic) => (
              <Box key={topic.title}>
                <Text
                  fontSize="10px"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="widest"
                  color="fg.muted"
                  opacity={0.8}
                  mb={3}
                >
                  {topic.title}
                </Text>
                <VStack align="stretch" gap={1.5}>
                  {topic.items.map((item) => {
                    const isActive = activeDoc?.id === item.id;
                    return (
                      <Flex
                        key={item.id}
                        align="center"
                        py={2}
                        px={3}
                        borderRadius="md"
                        cursor="pointer"
                        bg={isActive ? 'primary/10' : 'transparent'}
                        color={isActive ? 'primary' : 'fg.muted'}
                        _hover={{ bg: 'bg.hover', color: 'primary' }}
                        transition="all 0.2s"
                        onClick={() => navigate(`/docs/${item.id}`)}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight={isActive ? 'semibold' : 'medium'}
                        >
                          {item.title}
                        </Text>
                      </Flex>
                    );
                  })}
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* ===================================================================
            2. MIDDLE COLUMN: CONTENT CONTAINER
            =================================================================== */}
        <Box flex={1} minWidth="0" px={{ base: 6, md: 10, lg: 12 }} py={8}>
          {/* Mobile Navigation Dropdown */}
          <Box display={{ base: 'block', lg: 'none' }} mb={6}>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  variant="outline"
                  width="100%"
                  borderColor="border"
                  justifyContent="space-between"
                  size="md"
                  bg="bg.panel"
                >
                  <Flex align="center" gap={2}>
                    <Icon type={IconType.MENU} size="16px" />
                    <Text fontSize="sm" fontWeight="bold">
                      {activeDoc?.title || 'Select Topic'}
                    </Text>
                  </Flex>
                  <Text fontSize="xs" color="fg.muted">
                    Switch
                  </Text>
                </Button>
              </Menu.Trigger>
              <Menu.Content
                zIndex={100}
                bg="bg.panel"
                borderColor="border"
                width="calc(100vw - 3rem)"
                maxW="400px"
              >
                {DOCS_TOPICS.map((topic) => (
                  <Box key={topic.title} py={1}>
                    <Box px={3} py={1}>
                      <Text
                        fontSize="9px"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        color="fg.muted"
                        opacity={0.7}
                      >
                        {topic.title}
                      </Text>
                    </Box>
                    {topic.items.map((item) => (
                      <Menu.Item
                        key={item.id}
                        value={item.id}
                        onClick={() => navigate(`/docs/${item.id}`)}
                        color={activeDoc?.id === item.id ? 'primary' : 'fg'}
                        fontWeight={
                          activeDoc?.id === item.id ? 'bold' : 'normal'
                        }
                      >
                        {item.title}
                      </Menu.Item>
                    ))}
                  </Box>
                ))}
              </Menu.Content>
            </Menu.Root>
          </Box>

          {/* Circular Loader while loading markdown */}
          {isLoading ? (
            <Flex
              justifyContent="center"
              alignItems="center"
              minH="300px"
              width="full"
              aria-busy="true"
              aria-label="Loading documentation"
            >
              <Spinner size="xl" color="primary" />
            </Flex>
          ) : (
            <Box width="full">
              <MdPreview mdString={mdContent} />
            </Box>
          )}
        </Box>

        {/* ===================================================================
            3. RIGHT COLUMN: TABLE OF CONTENTS (Desktop only)
            =================================================================== */}
        <Box
          display={{ base: 'none', xl: 'block' }}
          width="240px"
          position="sticky"
          top="16"
          height="calc(100vh - 4rem)"
          overflowY="auto"
          py={8}
          px={6}
          borderLeftWidth="1px"
          borderLeftColor="border"
        >
          {headings.length > 0 && (
            <VStack align="stretch" gap={3}>
              <Text
                fontSize="10px"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="widest"
                color="fg.muted"
                opacity={0.8}
              >
                In this Page
              </Text>
              <VStack align="stretch" gap={2}>
                {headings.map((heading) => (
                  <Text
                    key={heading.id}
                    fontSize="xs"
                    fontWeight="medium"
                    color="fg.muted"
                    pl={heading.level === 3 ? 3 : 0}
                    cursor="pointer"
                    _hover={{ color: 'primary' }}
                    transition="color 0.2s"
                    onClick={() => handleHeadingClick(heading.id)}
                  >
                    {heading.text}
                  </Text>
                ))}
              </VStack>
            </VStack>
          )}
        </Box>
      </Flex>
    </TitleBoxContainer>
  );
};

export default DocsPage;
