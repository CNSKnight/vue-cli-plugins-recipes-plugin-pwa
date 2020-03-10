// const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

// DISCLAIMER: Using this plugin without enabling the proper feature sets may
//             cause lodash functions to behave in unexpected ways.
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const lmrpOpts = {
  caching: true,
  cloning: true,
  collections: true,
  currying: true,
  flattening: true,
  metadata: true,
  paths: true,
  placeholders: true,
  shorthands: true
};

const pages = {
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
    chunks: ['index', 'chunk-big-vendors']
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
    chunks: ['index-plugin', 'chunk-big-vendors']
  }
};

// @todo 01/20 the `npm run server` yields nothing w/this config file in place?
module.exports = {
  publicPath: '/RecipeDetails/',
  // publicPath: process.env.NODE_ENV == 'production' ? '/RecipeDetails/' : '/',
  outputDir:
    // '/var/www/TAPPADS/vegrds-7109/public_html/acap-dev/plugins/RecipeDetails/dist1/',
    process.env.NODE_ENV == 'production'
      ? '/var/www/TAPPADS/vegrds-7109/public_html/acap-dev/plugins/RecipeDetails/prod/'
      : '/var/www/TAPPADS/vegrds-7109/public_html/acap-dev/plugins/RecipeDetails/dev/',
  pages,

  configureWebpack: {
    plugins: [
      new LodashModuleReplacementPlugin(lmrpOpts),
      // use `$ BUNDLE_STATS_BASELINE=true npm run build` to establish baseline
      new BundleStatsWebpackPlugin()
      // new BundleAnalyzerPlugin(),
    ]
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
    config.optimization.get('splitChunks').cacheGroups.bigVendors = {
      name: 'chunk-big-vendors',
      test: /\/node_modules\/(lodash|markdown-it)\//,
      chunks: 'all',
      priority: 1
    };
    config.optimization.get('splitChunks').cacheGroups.common.priority = -9;
    console.log(config.optimization.get('splitChunks'));
  },
  productionSourceMap: true
};
