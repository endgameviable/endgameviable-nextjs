module.exports = function (api) {
  api.cache(true);

  const presets = [ 'next/babel' ];
  const plugins = [ '@babel/plugin-transform-private-methods' ];

  return {
    presets,
    plugins
  };
}