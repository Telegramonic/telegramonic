module.exports = {
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.js'],
  roots: ['./'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  coverageReporters: ['lcov'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    // exclude files from coverage
    '!src/**/index.ts',
    '!src/**/index.tsx',
    '!src/**/App.tsx',
    '!src/**/react-app-env.d.ts',
    '!src/**/reportWebVitals.ts',
    '!src/**/setupTests.ts',
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '@assets': '<rootDir>/src/assets',
    '@assets/*': '<rootDir>/src/assets/*',
    '@components': '<rootDir>/src/components',
    '@data': '<rootDir>/src/data',
    '@data/*': '<rootDir>/src/data/*',
    '@providers': '<rootDir>/src/providers',
    '@localization': '<rootDir>/src/localization',
    '@routes': '<rootDir>/src/routes',
    '@screens': '<rootDir>/src/screens',
    '@screens/*': '<rootDir>/src/screens/*',
    '@uiStore': '<rootDir>/src/store/ui',
    '@appStore': '<rootDir>/src/store/app',
    '@services': '<rootDir>/src/services',
    '@testUtils': '<rootDir>/src/testUtils',
  },
  transform: {
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10,
  //   },
  // },
};
