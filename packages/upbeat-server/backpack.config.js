module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = [
      './src/server.ts'
    ]

    config.resolve = {
      extensions: [".ts", ".js", ".json"]
    };

    config.module.rules.push(
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    );

    config.plugins.splice(1, 1)

    return config;
  }
};
