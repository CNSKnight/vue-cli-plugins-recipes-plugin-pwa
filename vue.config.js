const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  // publicPath: process.env.NODE_ENV == 'production' ? '/RecipeDetails/' : '/',
  publicPath: '/RecipeDetails/',
  outputDir: '/var/www/TAPPADS/vegrds-7109/public_html/acap-dev/plugins/RecipeDetails/dist1/',
  configureWebpack: {
    entry: {
      detailsPluginAppLib: ['./src/details-plugin.js']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index-plugin.html',
        title: 'Webpack Recipe Details Plugin App',
        inject: 'body',
        filename: 'index-plugin.html',
        excludeChunks: ['app']
      })
    ],
    output: {
      chunkFilename: '[name].bundle.js'
    }
  },
  productionSourceMap: true
};
