const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const path = require('path');
const _ = require('lodash');

const NODE_ENV = process.env.NODE_ENV || 'development';

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  target: 'web',

  entry: {
    main: ['./src/application.tsx'],
  },

  output: {
    path: path.join(__dirname),
    publicPath: '/',
    filename: 'application.[name].js',
    chunkFilename: '[name].[id].js',
  },

  resolve: {
    modules: ['web_modules', 'node_modules', './src/images'],
    moduleExtensions: ['js', 'svg', 'tsx'],
    extensions: ['.tsx', '.ts', '.js', '.svg'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${NODE_ENV}'`,
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Loading - CUE',
      template: './src/entry.ejs',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      title: 'Loading - CUE',
      template: './src/entry.ejs',
      inject: false,
      filename: '200.html',
    }),
    new webpack.IgnorePlugin(/unicode\/category\/So/),

    new FaviconsWebpackPlugin({
      logo: './src/images/favicon-2048.png',
      icons: {
        favicons: true,
        android: isProduction,
        appleIcon: isProduction,
        windows: isProduction,
        firefox: isProduction,
        opengraph: false,
        yandex: false,
        coast: false,
        appleStartup: false,
      },
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader:
          'style-loader!postcss-loader',
      },
      {
        test: /\.graphql$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'svgr/webpack',
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader?useBabel',
      },
    ],
  },
};
