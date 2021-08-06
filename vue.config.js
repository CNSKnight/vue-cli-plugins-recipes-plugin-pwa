// const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleStatsWebpackPlugin } = require('bundle-stats-webpack-plugin');
// const BundleAnalyzerPlugin =
//   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
  shorthands: true,
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
    chunks: ['chunk-big-vendors', 'chunk-common', 'app'],
    reminder:
      process.env.NODE_ENV == 'development'
        ? '<h6>Remember! There is no node-modules/ in dev/</h6>'
        : '',
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
    chunks: ['chunk-big-vendors', 'chunk-common', 'detailsPlugin'],
    reminder:
      process.env.NODE_ENV == 'development'
        ? '<h6>Remember! There is no node-modules/ in dev/</h6>'
        : '',
  },
};

const opBase =
  '/var/www/TAPPADS/vegrds-7109/public_html/acap-dev/plugins/RecipeDetails/';

// @todo 01/20 the `npm run server` yields nothing w/this config file in place?
module.exports = {
  publicPath:
    process.env.NODE_ENV == 'production'
      ? '/RecipeDetails/'
      : '/RecipeDetailsDev/',
  outputDir:
    process.env.NODE_ENV == 'production' ? `${opBase}prod/` : `${opBase}dev/`,
  pages,

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
  chainWebpack: (config) => {
    /* new/temp */
    config.resolve.alias.set('vue', '@vue/compat');
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        };
      });
    /* end new/temp */
    config.optimization.get('splitChunks').cacheGroups.bigVendors = {
      name: 'chunk-big-vendors',
      test: /\/node_modules\/(lodash|markdown-it)\//,
      chunks: 'all',
      priority: 1,
    };
    config.optimization.get('splitChunks').cacheGroups.common.priority = -9;
    console.log(
      '\n',
      'splitChunks:',
      '\n',
      config.optimization.get('splitChunks')
    );
  },
  productionSourceMap: true,
};
