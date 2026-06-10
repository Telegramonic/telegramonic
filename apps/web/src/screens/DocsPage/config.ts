export interface DocItem {
  id: string;
  title: string;
  filePath: string;
}

export interface DocTopic {
  title: string;
  items: DocItem[];
}

export const DOCS_TOPICS: DocTopic[] = [
  {
    title: 'Getting Started',
    items: [
      {
        id: 'introduction',
        title: 'Introduction',
        filePath: 'data/product/introduction',
      },
      {
        id: 'quickstart',
        title: 'Quick Start',
        filePath: 'data/product/quickstart',
      },
      {
        id: 'setup-guide',
        title: 'Setup Guide',
        filePath: 'data/product/telegram-credentials',
      },
    ],
  },
  {
    title: 'Architecture',
    items: [
      {
        id: 'system-design',
        title: 'System Design',
        filePath: 'data/product/system-design',
      },
      {
        id: 'mtproto',
        title: 'MTProto Protocol',
        filePath: 'data/product/mtproto',
      },
      {
        id: 'direct-storage',
        title: 'Direct Storage',
        filePath: 'data/product/direct-storage',
      },
    ],
  },
  {
    title: 'Reference',
    items: [
      {
        id: 'api-reference',
        title: 'API Gateway Reference',
        filePath: 'data/product/api-reference',
      },
    ],
  },
  {
    title: 'Version History',
    items: [
      {
        id: 'version-history-desktop',
        title: 'Desktop',
        filePath: 'data/product/version-history-desktop',
      },
      {
        id: 'version-history-mobile',
        title: 'Mobile',
        filePath: 'data/product/version-history-mobile',
      },
    ],
  },
];
