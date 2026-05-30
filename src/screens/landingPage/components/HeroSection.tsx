import {
  VStack,
  Stack,
  Heading,
  Input,
  Text,
  Collapsible,
  CloseButton,
  Group,
  InputAddon,
} from '@chakra-ui/react';
import { fuse } from '@data';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearchText] = useState<string>('');
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const result = fuse.search(search);
      setList(result.map((item) => item.item));
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  useEffect(() => {
    setIsOpen(list.length > 0);
  }, [list.length, search]);

  return (
    <Stack
      paddingTop={10}
      alignItems={'center'}
      width={'100%'}
      bg={'green.800'}
      rowGap={2}
      py={5}
      height={'fit-content'}
      zIndex={1}
    >
      <Heading
        textAlign={'center'}
        size={{ base: 'md', md: 'lg' }}
        color={'white'}
        filter={'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.75))'}
      >
        {t('LandingPage.heroText')}
      </Heading>
      <Text
        textAlign={'center'}
        fontSize={{ base: 'medium', md: 'large' }}
        color={'neutral.100'}
      >
        {t('LandingPage.subHeroText')}
      </Text>
      <Group
        width={{ base: '80%', md: '50%' }}
        attached
      >
        <Input
          bg={'white'}
          borderRadius={'full'}
          paddingStart={{ base: 3, md: 5 }}
          value={search}
          _active={{
            borderColor: 'green.800',
          }}
          _focus={{
            borderColor: 'green.800',
          }}
          placeholder={t('LandingPage.searchPlaceholder')}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          color={'green.800'}
          borderColor={'green.800'}
        />
        <InputAddon
          _hover={{
            cursor: 'pointer',
          }}
          onClick={() => {
            setSearchText('');
          }}
          bg={'white'}
          borderEndRadius={'full'}
          px={2}
        >
          <CloseButton size={'md'} color={'green'} />
        </InputAddon>
      </Group>
      <Collapsible.Root
        open={isOpen}
        style={{ width: '50%' }}
      >
        <Collapsible.Content>
          <VStack
            width={'100%'}
            zIndex={10}
            py={2}
            height={'40vh'}
            bg={'white'}
            borderRadius={10}
            boxShadow={'md'}
            overflow={'auto'}
          >
            {list.map((item) => (
              <Text
                width={'100%'}
                fontSize={{ base: 'medium', md: 'large' }}
                key={item.title}
                color={'green.800'}
                asChild
                paddingX={5}
                textAlign={'left'}
              >
                <Link
                  to={item.path}
                  style={{ display: 'block', width: '100%' }}
                >
                  {item.title}
                </Link>
              </Text>
            ))}
          </VStack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Stack>
  );
};

export default HeroSection;
