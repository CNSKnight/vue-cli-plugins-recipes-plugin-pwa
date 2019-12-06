module.exports = function(api) {
  api.cache(true);

  const presets = ['@vue/cli-plugin-babel/preset', ['@babel/preset-env', {modules: false, targets: {node: 6}}]];
  const plugins = [
    'lodash',
    // '@babel/plugin-proposal-optional-chaining'
  ];

  return {
    presets,
    plugins,
  };
};
