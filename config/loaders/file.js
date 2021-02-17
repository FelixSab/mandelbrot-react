const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function() {
  return {
    loader: 'file-loader',
    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.s(a|c)ss$/, /\.html$/, /\.json$/],
    options: {
      name: `$[name].[hash:8].[ext]`
    }
  };
}
