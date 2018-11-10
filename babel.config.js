module.exports = function(api) {
  api.cache(true);
  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    'source-map-support'
  ];
  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        shippedProposals: true,
        modules: 'commonjs',
        targets: {
          node: '8.10'
        }
      }
    ],
    '@babel/preset-typescript'
  ];

  return {
    comments: false,
    plugins,
    presets
  };
};
