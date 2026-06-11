const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@assets': path.resolve(__dirname, '../../shared/common/src/assets'),
      '@assets/*': path.resolve(__dirname, '../../shared/common/src/assets/*'),
      '@components': path.resolve(
        __dirname,
        '../../shared/common/src/components',
      ),
      '@data': path.resolve(__dirname, '../../docs'),
      '@data/*': path.resolve(__dirname, '../../docs/*'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@localization': path.resolve(
        __dirname,
        '../../shared/common/src/localization',
      ),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@uiStore': path.resolve(__dirname, './src/store/ui'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@screens/*': path.resolve(__dirname, './src/screens/*'),
      '@appStore': path.resolve(__dirname, './src/store/app'),
      '@services': path.resolve(__dirname, './src/services'),
      '@testUtils': path.resolve(
        __dirname,
        '../../shared/common/src/testUtils',
      ),
    },
    configure: (webpackConfig) => {
      // Remove ModuleScopePlugin to allow importing from common/ workspace
      if (webpackConfig.resolve && webpackConfig.resolve.plugins) {
        const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
          ({ constructor }) =>
            constructor && constructor.name === 'ModuleScopePlugin',
        );
        if (scopePluginIndex !== -1) {
          webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
        }
      }

      // Exclude node_modules from source-map-loader to suppress missing
      // .map file warnings (e.g. parse5) that come from third-party packages.
      const sourceMapRule = webpackConfig.module.rules
        .flatMap((rule) => (rule.oneOf ? rule.oneOf : [rule]))
        .find(
          (rule) => rule.loader && rule.loader.includes('source-map-loader'),
        );

      if (sourceMapRule) {
        sourceMapRule.exclude = /node_modules/;
      }

      // Find all babel-loaders and redirect their cache directories
      const babelLoaders = webpackConfig.module.rules
        .flatMap((rule) => (rule.oneOf ? rule.oneOf : [rule]))
        .filter((rule) => rule.loader && rule.loader.includes('babel-loader'));

      babelLoaders.forEach((loader, index) => {
        if (loader.options) {
          loader.options.cacheDirectory = path.resolve(
            __dirname,
            `../../node_modules/.cache/babel-loader-${index}`,
          );
        }
      });

      // Include common folder in the main application's compilation
      const mainBabelLoader = babelLoaders[0];
      if (mainBabelLoader) {
        const include = Array.isArray(mainBabelLoader.include)
          ? mainBabelLoader.include
          : [mainBabelLoader.include];
        mainBabelLoader.include = include.concat([
          path.resolve(__dirname, '../../shared/common'),
        ]);
      }

      // Redirect Webpack persistent cache
      if (webpackConfig.cache && webpackConfig.cache.type === 'filesystem') {
        webpackConfig.cache.cacheDirectory = path.resolve(
          __dirname,
          '../../node_modules/.cache',
        );
      }

      // Redirect ForkTsCheckerWebpackPlugin cache (tsconfig.tsbuildinfo)
      const forkTsPlugin = webpackConfig.plugins.find(
        (plugin) =>
          plugin.constructor &&
          plugin.constructor.name === 'ForkTsCheckerWebpackPlugin',
      );
      if (
        forkTsPlugin &&
        forkTsPlugin.options &&
        forkTsPlugin.options.typescript
      ) {
        const ts = forkTsPlugin.options.typescript;
        ts.configOverwrite = ts.configOverwrite || {};
        ts.configOverwrite.compilerOptions =
          ts.configOverwrite.compilerOptions || {};
        ts.configOverwrite.compilerOptions.tsBuildInfoFile = path.resolve(
          __dirname,
          '../../node_modules/.cache/tsconfig.tsbuildinfo',
        );
      }

      // Redirect ESLintWebpackPlugin cache (.eslintcache)
      const eslintPlugin = webpackConfig.plugins.find(
        (plugin) =>
          plugin.constructor &&
          plugin.constructor.name === 'ESLintWebpackPlugin',
      );
      if (eslintPlugin && eslintPlugin.options) {
        eslintPlugin.options.cacheLocation = path.resolve(
          __dirname,
          '../../node_modules/.cache/.eslintcache',
        );
      }

      return webpackConfig;
    },
  },
};
