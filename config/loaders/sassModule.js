const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('../paths');

module.exports = function(isDevelopment) {
  return {
    test: /\.module\.s(a|c)ss$/,
    use: [
      isDevelopment ? {
          loader: 'style-loader',
          options: {
            esModule: true
          }
        } : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true
          }
        },
      {
        loader: 'css-modules-typescript-loader'
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: isDevelopment
        }
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: isDevelopment
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: paths.cssModuleRessourceFiles,
        },
      }
    ]
  };
}
