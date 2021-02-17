const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const paths = require('./paths');
const initLoaders = require('./loaders');

const config = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  const isProduction = !isDevelopment;
  const {
    sassLoader,
    sassModuleLoader,
    fileLoader,
    babelLoader
  } = initLoaders(isDevelopment);

  return {
    entry: paths.clientIndexFile,
    mode: argv.mode,
    output: {
      filename: isDevelopment ? 'bundle.js' : 'bundle.[hash:8].js',
      path: paths.clientDistDir
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'eval',
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.sass'],
      modules: [paths.clientDir, 'node_modules']
    },
    module: {
      rules: [
        babelLoader,
        sassModuleLoader,
        sassLoader,
        fileLoader
      ]
    },
    plugins: [
      isProduction && new CompressionPlugin({
      algorithm: 'gzip',
      threshold: 10240,
      minRatio: 0.8
      }),
      isProduction && new BrotliPlugin({
      threshold: 10240,
      minRatio: 0.8
      }),
      new HtmlWebpackPlugin({
        template: paths.clientIndexHtml
      }),
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[hash:8].css',
        chunkFilename: isDevelopment ? '[id].css' : '[id].[hash:8].css'
      })
    ].filter(Boolean)
  };
};

module.exports = config;
