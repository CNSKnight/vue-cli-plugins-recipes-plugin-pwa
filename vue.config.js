// const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const {BundleStatsWebpackPlugin} = require('bundle-stats');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * DISCLAIMER: Using this plugin without enabling the proper feature sets may cause lodash functions to behave in unexpected ways.
 */
const lmrpOpts = {
  currying: true,
  collections: true,
  cloning: true,
  caching: true,
  paths: true,
  metadata: true,
  placeholders: true,
};

module.exports = {
  // publicPath: process.env.NODE_ENV == 'production' ? '/RecipeDetails/' : '/',
  publicPath: '/RecipeDetails/',
  outputDir: '/var/www/TAPPADS/vegrds-7109/public_html/acap-dev/plugins/RecipeDetails/dist1/',
  indexPath: 'templates/',
  pages: {
    app: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'App Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['index', 'chunk-big-vendor'],
    },
    detailsPlugin: {
      // entry for the page
      entry: 'src/details-plugin.js',
      // the source template
      template: 'public/index-plugin.html',
      // output as dist/index.html
      filename: 'index-plugin.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Details Plugin Index Page',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['index-plugin', 'chunk-big-vendor'],
    },
  },

  configureWebpack: {
    plugins: [
      new LodashModuleReplacementPlugin(lmrpOpts),
      // use `$ BUNDLE_STATS_BASELINE=true npm run build` to establish baseline
      new BundleStatsWebpackPlugin(),
      // new BundleAnalyzerPlugin(),
    ],
    // Option #1 - for Simple configs
    // optimization: {
    //   splitChunks: {
    //     cacheGroups: {
    //       bigVendors: {
    //         name: "chunk-big-vendors",
    //         test: /\/node_modules\/(lodash|markdown-it)\//,
    //         chunks: "all",
    //         priority: 1
    //       },
    //       common: {
    //         priority: -9
    //       }
    //     }
    //   }
    // }
  },
  // Option #2 - for Advanced config
  chainWebpack: config => {
    // config.optimization.get("splitChunks").cacheGroups.bigVendors = {
    //   name: "chunk-big-vendors",
    //   test: /\/node_modules\/(lodash|markdown-it)\//,
    //   chunks: "all",
    //   priority: 1
    // };
    // config.optimization.get("splitChunks").cacheGroups.common.priority = -9;
    console.log(config.optimization.get('splitChunks'));
  },
  productionSourceMap: true,
};
