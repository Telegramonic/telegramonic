import {
  Box,
  Button,
  Separator,
  HStack,
  Heading,
  Menu,
  Text,
} from '@chakra-ui/react';
import { ThemeIcon } from '@components';
import { Logo } from '@assets';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { usePaddingForScreen } from '../../hooks';
import { NAVIGATION_LINKS } from './constants';

const IconMenu = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path
      fill="currentColor"
      d="M2 6a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM2 12.032a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM3 17.064a1 1 0 100 2h18a1 1 0 000-2H3z"
    />
  </svg>
);

const NavigationBar = () => {
  const { t } = useTranslation();
  const padding = usePaddingForScreen();
  const titleKey = useLocation().pathname.split('/').pop();
  const title = titleKey ? t(`NavigationBar.${titleKey}`) : '';
  return (
    <HStack
      paddingX={padding}
      height={16}
      borderBottomWidth={1}
      borderBottomColor="border"
      shadow="sm"
      justifyContent={'space-between'}
      position="sticky"
      top={0}
      zIndex={50}
      bg="bg.panel"
    >
      <HStack
        gap={1}
        _hover={{
          cursor: 'pointer',
        }}
      >
        <Link
          to={'/'}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Box
            color={'white'}
            width={'2.5rem'}
            height={'2.5rem'}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Logo />
          </Box>
          <Box display="flex">
            <Heading size={'md'} color={'primary'} fontWeight="bold">
              {t('Title_1')}
            </Heading>
            <Heading size={'md'} fontWeight="bold">
              {t('Title_2')}
            </Heading>
          </Box>
        </Link>
        {!isEmpty(title) ? (
          <>
            <Separator
              orientation={'vertical'}
              mx={4}
              bg={'border'}
              width={'1px'}
              height={6}
            />
            <Text fontSize="sm" color="fg.muted">
              {title}{' '}
            </Text>
          </>
        ) : null}
      </HStack>
      <HStack gap={4}>
        <HStack gap={{ base: 2, xl: 4 }} display={{ base: 'none', md: 'flex' }}>
          {NAVIGATION_LINKS.map(({ name, link }) => (
            <Button
              asChild
              variant={'ghost'}
              key={link}
              aria-label={link + '-nav-link'}
              px={3}
              py={2}
              borderRadius="md"
              color="fg.muted"
              _hover={{ bg: 'bg.hover', color: 'primary' }}
              transition="all 0.2s"
            >
              <Link to={link} style={{ display: 'flex', alignItems: 'center' }}>
                <Text fontSize="sm" fontWeight={'medium'}>
                  {name}
                </Text>
              </Link>
            </Button>
          ))}
        </HStack>
        <Box display={{ base: 'flex', md: 'none' }}>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant={'outline'}
                borderColor="border"
                borderWidth={1}
                px={3}
                py={2}
                size="sm"
              >
                Menu
                <IconMenu />
              </Button>
            </Menu.Trigger>
            <Menu.Content
              zIndex={100}
              borderRadius="md"
              boxShadow={'md'}
              bg="bg.panel"
              borderColor="border"
            >
              {NAVIGATION_LINKS.map(({ name, link }) => (
                <Menu.Item key={link} value={link} asChild>
                  <Link
                    to={link}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                    }}
                  >
                    <Text fontSize="sm" fontWeight={'medium'}>
                      {name}
                    </Text>
                  </Link>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Root>
        </Box>
        <ThemeIcon />
      </HStack>
    </HStack>
  );
};

export default NavigationBar;
