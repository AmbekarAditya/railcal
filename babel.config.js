module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      "module:metro-react-native-babel-preset",
      ["@babel/preset-react", {
        "runtime": "automatic",
        "importSource": "react"
      }]
    ],
    plugins: [
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-export-namespace-from', // Add this line
      // Other plugins...
    ]
  };
};