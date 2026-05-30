export const MD_PAGE_CONFIG: Record<
  string,
  { filePath: string; i18nKey: string; badgeColor: string }
> = {
  privacy: {
    filePath: 'data/legals/privacy',
    i18nKey: 'MdPage.privacy',
    badgeColor: 'blue',
  },
  terms: {
    filePath: 'data/legals/terms',
    i18nKey: 'MdPage.terms',
    badgeColor: 'blue',
  },
  'contact-us': {
    filePath: 'data/legals/contact-us',
    i18nKey: 'MdPage.contactUs',
    badgeColor: 'teal',
  },
  'about-us': {
    filePath: 'data/legals/about-us',
    i18nKey: 'MdPage.aboutUs',
    badgeColor: 'purple',
  },
  faq: {
    filePath: 'data/legals/faq',
    i18nKey: 'MdPage.faq',
    badgeColor: 'green',
  },
  disclaimer: {
    filePath: 'data/legals/disclaimer',
    i18nKey: 'MdPage.disclaimer',
    badgeColor: 'orange',
  },
};
