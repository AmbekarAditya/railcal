const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);
    config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('expo-crypto'),
    };
    if (env.mode === 'production') {
        config.output.publicPath = './';
    }
    return config;
};