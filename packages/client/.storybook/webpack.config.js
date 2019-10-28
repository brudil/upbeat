const path = require('path');

module.exports = async ({ config, mode }) => {
  config.module.rules.push({
    test: /\.ts(x?)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
      },
      {
        loader: 'ts-loader'
      }
    ]
  });

  config.module.rules.push({
    test: /\.svg$/,
    use: {
      loader: '@svgr/webpack',
    },
    include: path.resolve(__dirname, "src/vectors"),
  });

  config.resolve.extensions = ['.ts', '.tsx', '.js', '.svg'];

  // Return the altered config
  return config;
};
