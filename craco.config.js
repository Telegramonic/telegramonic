const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@assets/*': path.resolve(__dirname, './src/assets/*'),
      '@components': path.resolve(__dirname, './src/components'),
      '@data': path.resolve(__dirname, './src/data'),
      '@data/*': path.resolve(__dirname, './src/data/*'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@localization': path.resolve(__dirname, './src/localization'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@uiStore': path.resolve(__dirname, './src/store/ui'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@screens/*': path.resolve(__dirname, './src/screens/*'),
      '@appStore': path.resolve(__dirname, './src/store/app'),
      '@services': path.resolve(__dirname, './src/services'),
      '@testUtils': path.resolve(__dirname, './src/testUtils'),
    },
    configure: (webpackConfig) => {
      // Exclude node_modules from source-map-loader to suppress missing
      // .map file warnings (e.g. parse5) that come from third-party packages.
      const sourceMapRule = webpackConfig.module.rules
        .flatMap((rule) => (rule.oneOf ? rule.oneOf : [rule]))
        .find(
          (rule) =>
            rule.loader &&
            rule.loader.includes('source-map-loader'),
        );

      if (sourceMapRule) {
        sourceMapRule.exclude = /node_modules/;
      }

      return webpackConfig;
    },
  },
};
