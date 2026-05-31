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
    ],
  },
  {
    title: 'Architecture',
    items: [
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
];
