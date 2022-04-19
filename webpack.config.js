const path = require('path');

const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.resolve(srcPath, './__DiscordLoader__.js'),
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: srcPath,
        options: { transpileOnly: true },
        exclude: /node_modules/,
      },
    ],
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  target: 'node',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@src': path.resolve('src'),
      '@utils': path.resolve('utils'),
    },
  },
  output: {
    path: distPath,
    filename: 'app.js',
    clean: true,
  },
};
