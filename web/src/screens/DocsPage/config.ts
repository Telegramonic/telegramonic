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
        id: 'version-history',
        title: 'Version History',
        filePath: 'data/product/version-history',
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
];
