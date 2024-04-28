const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return {
    transformer: {
      ...defaultConfig.transformer,
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer')
    },
    resolver: {
      ...defaultConfig.resolver,
      sourceExts: [...defaultConfig.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx', 'json'],
      assetExts: [...defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg')]
    },
  };
})();
