const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  baseUrl: process.env.NODE_ENV == 'production' ? '/RecipeDetails/' : '/',
  configureWebpack: {
    entry: {
      detailsPlugin: ['./src/details-plugin.js']
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
    },
    resolve: {
      alias: {}
    }
  }
};
