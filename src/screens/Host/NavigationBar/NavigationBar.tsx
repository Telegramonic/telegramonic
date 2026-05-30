import {
  Box,
  Button,
  Separator,
  HStack,
  Heading,
  Icon,
  Menu,
  Text,
} from '@chakra-ui/react';
import { ThemeIcon } from '@components';
import { TelegramonicIcon, IconHc } from '@assets';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { usePaddingForScreen } from '../../hooks';
import { NAVIGATION_LINKS } from './constants';

const NavigationBar = () => {
  const { t } = useTranslation();
  const padding = usePaddingForScreen();
  const titleKey = useLocation().pathname.split('/').pop();
  const title = titleKey ? t(`NavigationBar.${titleKey}`) : '';
  return (
    <HStack
      paddingX={padding}
      height={12}
      borderBottomWidth={1}
      shadow={'md'}
      justifyContent={'space-between'}
      py={6}
    >
      <HStack
        gap={0.2}
        _hover={{
          cursor: 'pointer',
        }}
      >
        <Link to={'https://www.telegramonic.com'} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Icon
            color={'white'}
            width={'3em'}
            height={'3em'}
            focusable={false}
            borderRadius={'full'}
            bg={'primary'}
            padding={2}
            asChild
          >
            <span>
              <TelegramonicIcon icon={IconHc.TELEGRAMONIC} />
            </span>
          </Icon>
          <Box display={{ base: 'none', xl: 'flex' }}>
            <Heading size={'md'} color={'primary'}>
              {t('Title_1')}
            </Heading>
            <Heading size={'md'}>{t('Title_2')}</Heading>
          </Box>
        </Link>
        {!isEmpty(title) ? (
          <>
            <Separator
              orientation={'vertical'}
              mx={6}
              bg={'primary'}
              width={'1px'}
              height={6}
            />
            <Text>{title} </Text>
          </>
        ) : null}
      </HStack>
      <HStack>
        <HStack
          gap={{ base: 1, xl: 2 }}
          display={{ base: 'none', xl: 'flex' }}
        >
          {NAVIGATION_LINKS.map(({ name, link, icon }) => (
            <Button
              asChild
              p={0}
              variant={'ghost'}
              key={link}
              aria-label={link + '-nav-link'}
            >
              <Link to={link}>
                <TelegramonicIcon icon={icon} height={20} width={20} />
                <Text
                  p={1}
                  fontSize={{ base: 'smaller', md: 'medium' }}
                  fontWeight={'bold'}
                  textAlign={'center'}
                  _hover={{
                    cursor: 'pointer',
                    color: 'primary',
                  }}
                  transition={'all 0.3s'}
                >
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
                borderColor="primary"
                borderWidth={1}
              >
                Menu
                <TelegramonicIcon icon={IconHc.MENU} />
              </Button>
            </Menu.Trigger>
            <Menu.Content
              zIndex={100}
              borderRadius={10}
              boxShadow={'md'}
              display={{ base: 'flex', md: 'none' }}
              flexDir="column"
            >
              {NAVIGATION_LINKS.map(({ name, link, icon }) => (
                <Menu.Item key={link} value={link} asChild>
                  <Link to={link}>
                    <TelegramonicIcon icon={icon} height={20} width={20} />
                    <Text
                      p={1}
                      fontSize={{ base: 'smaller', md: 'medium' }}
                      fontWeight={'bold'}
                      textAlign={'center'}
                    >
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
