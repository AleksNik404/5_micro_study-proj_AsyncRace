import path from 'path';
import webpack from 'webpack';

import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin, { loader } from 'mini-css-extract-plugin';

const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = isProduction ? loader : 'style-loader';

const devServer: DevServerConfiguration = {
  open: true,
  host: 'localhost',
  historyApiFallback: true,
};

const config: webpack.Configuration = {
  entry: path.resolve(__dirname, './src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
    clean: true,
  },
  devServer: devServer,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g|gif|webp|ico)$/i,
        type: 'asset',
      },
      {
        test: /\.(?:mp3|wav|ogg|mp4|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: ['@svgr/webpack'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    preferAbsolute: true,
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: { '@': path.resolve(__dirname, 'src') },
    mainFiles: ['index'],
  },
};

export default () => {
  if (isProduction) {
    config.mode = 'production';

    config.plugins!.push(new MiniCssExtractPlugin());
  } else {
    config.mode = 'development';
  }
  return config;
};
