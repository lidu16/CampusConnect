module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      }],
      // Add this for Hermes compatibility:
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-private-property-in-object'
    ]
  };
};