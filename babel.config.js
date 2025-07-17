// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          // Target browsers, not just Node.js
          browsers: 'last 2 versions',
        },
        modules: 'auto', // Let Babel decide between ESM and CommonJS
      },
    ],
  ],
};