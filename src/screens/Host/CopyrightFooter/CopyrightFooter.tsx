import { Box, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { COPYRIGHT_FOOTER_VERTICAL_PADDING } from './constants';
import { useIsDarkMode } from '@components';
import { Link } from 'react-router-dom';

const FOOTER_LINK = [
  {
    title: 'Privacy policy',
    path: 'https://www.telegramonic.com/about/privacy-policy',
  },
  {
    title: 'Terms of service',
    path: 'https://www.telegramonic.com/about/terms-of-use',
  },
  {
    title: 'Contact us',
    path: 'https://www.telegramonic.com/about/contact-us',
  },
  {
    title: 'About us',
    path: 'https://www.telegramonic.com/about/about-us',
  },
  {
    title: 'FAQs',
    path: 'https://www.telegramonic.com/about/faq',
  },
];

const CopyrightFooter = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const isDarkMode = useIsDarkMode();
  return (
    <>
      <Box
        bottom={-10}
        height={10}
        width={'100%'}
        position={'absolute'}
        bg={isDarkMode ? 'neutral.800' : 'neutral.200'}
        display={'flex'}
        justifyContent={'center'}
        columnGap={{ base: 3, md: 6 }}
      >
        {FOOTER_LINK.map(({ path, title }) => (
          <Button
            key={title}
            fontSize={{ base: 10, md: 'sm' }}
            size={'sm'}
            variant={'plain'}
            asChild
          >
            <Link to={path}>{title}</Link>
          </Button>
        ))}
      </Box>
      <Box
        bottom={-20}
        width={'100%'}
        position={'absolute'}
        py={COPYRIGHT_FOOTER_VERTICAL_PADDING}
        bg={'green.700'}
        textAlign={'center'}
      >
        {t('Footer.copyrightText', { year: currentYear })}
      </Box>
    </>
  );
};

export default CopyrightFooter;
