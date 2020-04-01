Vue's logoIssue Helper
EN
中文
Before You Start...
The issue list is reserved exclusively for bug reports and feature requests. That means we do not accept usage questions. If you open an issue that does not conform to the requirements, it will be closed immediately.
Why are we so strict about this?

For usage questions, please use the following resources:

Read the docs
Watch video tutorials
Ask on the forums
Ask on the chat
Look for / ask questions on Stack Overflow
Also try to search for your issue - it may have already been answered or even fixed in the development branch. However, if you find that an old, closed issue still persists in the latest version, you should open a new issue using the form below instead of commenting on the old issue.

I am opening an issue for

Please make sure to file the issue at appropriate repo.
This is a
Issue title
CLI Build w/chainWebpack config fails to inject all built artifact <script/> tags?
Version
4.2.3

Check if the issue is reproducible with the latest stable version of Vue.
Environment Info
  System:
    OS: Linux 4.15 Ubuntu 18.04.4 LTS (Bionic Beaver)
    CPU: (8) x64 Intel(R) Core(TM) i7-4810MQ CPU @ 2.80GHz
  Binaries:
    Node: 12.14.1 - ~/.nvm/versions/node/v12.14.1/bin/node
    Yarn: Not Found
    npm: 6.14.4 - ~/.nvm/versions/node/v12.14.1/bin/npm
  Browsers:
    Chrome: 78.0.3904.97
    Firefox: 74.0
  npmPackages:
    @vue/babel-helper-vue-jsx-merge-props:  1.0.0 
    @vue/babel-plugin-transform-vue-jsx:  1.1.2 
    @vue/babel-preset-app:  4.2.3 
    @vue/babel-preset-jsx:  1.1.2 
    @vue/babel-sugar-functional-vue:  1.1.2 
    @vue/babel-sugar-inject-h:  1.1.2 
    @vue/babel-sugar-v-model:  1.1.2 
    @vue/babel-sugar-v-on:  1.1.2 
    @vue/cli-overlay:  4.2.3 
    @vue/cli-plugin-babel: ^4.2.3 => 4.2.3 
    @vue/cli-plugin-e2e-nightwatch: ^4.2.3 => 4.2.3 
    @vue/cli-plugin-eslint: ^4.2.3 => 4.2.3 
    @vue/cli-plugin-router:  4.2.3 
    @vue/cli-plugin-unit-jest: ^4.2.3 => 4.2.3 
    @vue/cli-plugin-vuex:  4.2.3 
    @vue/cli-service: ^4.2.3 => 4.2.3 
    @vue/cli-shared-utils:  4.2.3 
    @vue/component-compiler-utils:  3.1.1 
    @vue/eslint-config-prettier: ^6.0.0 => 6.0.0 
    @vue/preload-webpack-plugin:  1.1.1 
    @vue/test-utils: ^1.0.0-beta.32 => 1.0.0-beta.32 
    @vue/web-component-wrapper:  1.2.0 
    eslint-plugin-vue: ^6.2.2 => 6.2.2 
    jest-serializer-vue:  2.0.2 
    vue: ^2.6.11 => 2.6.11 
    vue-eslint-parser:  7.0.0 
    vue-hot-reload-api:  2.3.4 
    vue-jest:  3.0.5 
    vue-loader:  15.9.0 
    vue-router: ^3.1.6 => 3.1.6 
    vue-style-loader:  4.1.2 
    vue-template-compiler: ^2.6.11 => 2.6.11 
    vue-template-es2015-compiler:  1.9.1 
    vuex: ^3.1.3 => 3.1.3 
    vuex-map-fields: ^1.4.0 => 1.4.0 
    vuex-persist: ^2.2.0 => 2.2.0 
  npmGlobalPackages:
    @vue/cli: 4.2.3

Run the following command in your project's folder in terminal:

vue info

Copy and paste the output of the command in the section above.

Link to minimal reproduction
https://github.com/CNSKnight/vue-cli-plugins-recipes-plugin-pwa
Please provide link to a GitHub repository that can reproduce the issue.

What is a minimal reproduction, and why is it required?


Steps to reproduce
$ vue-cli-service build --modern
What do we need to do after opening your repro in order to make the bug happen? Clear and concise reproduction instructions are important for us to be able to triage your issue in a timely manner. Note that you can use Markdown to format lists and code.

What is expected?
completed build output - eg:
```
<!DOCTYPE html>
<html>

<head>
    <meta charset=utf-8>
    <meta http-equiv=X-UA-Compatible content="IE=edge">
    <meta name=viewport content="width=device-width,initial-scale=1">
    <!--custom-crap-omitted-->
    <title>vue-cli-plugins-recipes-plugin-pwa</title>
    <link href=/js/dynacomp.aba7a1c9.js rel=prefetch>
    <link href=/css/app.c0b4efd0.css rel=preload as=style>
    <link href=/js/app.61f06452.js rel=modulepreload as=script>
    <link href=/js/chunk-vendors.86d5e37a.js rel=modulepreload as=script>
    <link href=/css/app.c0b4efd0.css rel=stylesheet>
</head>

<body><noscript><strong>Oops! We're now JavaScript intensive. To continue, please enable javascript for this domain and
            hit refresh.</strong></noscript>
    <div id=app></div>
    <script type=module src=/js/chunk-vendors.86d5e37a.js></script>
    <script type=module src=/js/app.61f06452.js></script>
    <script>!function() {var e=document,t=e.createElement("script"); if(!("noModule" in t)&&"onbeforeload" in t) {var n=!1; e.addEventListener("beforeload",function(e) {if(e.target===t) n=!0; else if(!e.target.hasAttribute("nomodule")||!n) return; e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()} }();</script>
    <script src=/js/chunk-vendors-legacy.d2d26338.js nomodule></script>
    <script src=/js/app-legacy.699ad9ab.js nomodule></script>
</body>

</html>
```
What is actually happening?
post pre-load script and stylesheet links tags missing,
while modulepreload and preload tags are injected:
```
<!DOCTYPE html>
<html>

<head>
    <meta charset=utf-8>
    <meta http-equiv=X-UA-Compatible content="IE=edge">
    <meta name=viewport content="width=device-width,initial-scale=1">
    <!--custom-crap-omitted-->
    <title>App Index Page</title>
    <link href=/PathBase/js/dynacomp.950584fd.js rel=prefetch>
    <link href=/PathBase/css/app.4140d910.css rel=preload as=style>
    <link href=/PathBase/css/chunk-common.0b339111.css rel=preload as=style>
    <link href=/PathBase/js/app.c06d38c6.js rel=modulepreload as=script>
    <link href=/PathBase/js/chunk-big-vendors.24e19969.js rel=modulepreload as=script>
    <link href=/PathBase/js/chunk-common.5a328198.js rel=modulepreload as=script>
<!--where is chunk-common|app.*.css-->
</head>

<body><noscript>...</noscript>
    <div id=app></div>
    <script type=module src=/PathBase/js/chunk-big-vendors.24e19969.js></script>
    <!--Where is chunk-common|app.*.css-->
    <script>!function () { var e = document, t = e.createElement("script"); if (!("noModule" in t) && "onbeforeload" in t) { var n = !1; e.addEventListener("beforeload", function (e) { if (e.target === t) n = !0; else if (!e.target.hasAttribute("nomodule") || !n) return; e.preventDefault() }, !0), t.type = "module", t.src = ".", e.head.appendChild(t), t.remove() } }();</script>
    <script src=/PathBase/js/chunk-big-vendors-legacy.24e19969.js nomodule></script>
</body>

</html>
```
Any additional comments? (optional)
Potentially I have an issue w/my custom vue.config, but know that issues has prevailed over several months of CLI updates;
@note had provided vue.config.js and public/index.html but getting **414 Request-URI Too Large**? ping me for that info
vue.config.js
```
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
    chunks: ['index', 'chunk-big-vendors'],
    reminder:
      process.env.NODE_ENV == 'development'
        ? '<h6>Remember! There is no node-modules/ in dev/</h6>'
        : ''
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
    chunks: ['index-plugin', 'chunk-big-vendors'],
    reminder:
      process.env.NODE_ENV == 'development'
        ? '<h6>Remember! There is no node-modules/ in dev/</h6>'
        : ''
  }
};

const opBase =
  '/var/www/TAPPADS/vegrds-7109/public_html/acap-dev/plugins/BasePath/';

// @todo 01/20 the `npm run server` yields nothing w/this config file in place?
module.exports = {
  publicPath:
    process.env.NODE_ENV == 'production'
      ? '/BasePath/'
      : '/BasePathDev/',
  publicPath:
    process.env.NODE_ENV == 'production'
      ? '/BasePath/'
      : '/BasePathDev/',
  outputDir:
    process.env.NODE_ENV == 'production' ? `${opBase}prod/` : `${opBase}dev/`,
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
    console.log('splitChunks', '\n', config.optimization.get('splitChunks'));
  },
  productionSourceMap: true
};
```
public/index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <!--custom-crap-omitted-->
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>

  <body>
    <noscript>
      <strong>Oops! We're now JavaScript intensive. To continue, please enable javascript for this domain and hit refresh.</strong>
    </noscript>
    <%= htmlWebpackPlugin.options.reminder %>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```


e.g. some background/context of how you ran into this bug.
Issue Preview
Version
4.2.3

Reproduction link
https://github.com/CNSKnight/vue-cli-plugins-recipes-plugin-pwa

Environment info
  System:
    OS: Linux 4.15 Ubuntu 18.04.4 LTS (Bionic Beaver)
    CPU: (8) x64 Intel(R) Core(TM) i7-4810MQ CPU @ 2.80GHz
  Binaries:
    Node: 12.14.1 - ~/.nvm/versions/node/v12.14.1/bin/node
    Yarn: Not Found
    npm: 6.14.4 - ~/.nvm/versions/node/v12.14.1/bin/npm
  Browsers:
    Chrome: 78.0.3904.97
    Firefox: 74.0
  npmPackages:
    @vue/babel-helper-vue-jsx-merge-props:  1.0.0 
    @vue/babel-plugin-transform-vue-jsx:  1.1.2 
    @vue/babel-preset-app:  4.2.3 
    @vue/babel-preset-jsx:  1.1.2 
    @vue/babel-sugar-functional-vue:  1.1.2 
    @vue/babel-sugar-inject-h:  1.1.2 
    @vue/babel-sugar-v-model:  1.1.2 
    @vue/babel-sugar-v-on:  1.1.2 
    @vue/cli-overlay:  4.2.3 
    @vue/cli-plugin-babel: ^4.2.3 => 4.2.3 
    @vue/cli-plugin-e2e-nightwatch: ^4.2.3 => 4.2.3 
    @vue/cli-plugin-eslint: ^4.2.3 => 4.2.3 
    @vue/cli-plugin-router:  4.2.3 
    @vue/cli-plugin-unit-jest: ^4.2.3 => 4.2.3 
    @vue/cli-plugin-vuex:  4.2.3 
    @vue/cli-service: ^4.2.3 => 4.2.3 
    @vue/cli-shared-utils:  4.2.3 
    @vue/component-compiler-utils:  3.1.1 
    @vue/eslint-config-prettier: ^6.0.0 => 6.0.0 
    @vue/preload-webpack-plugin:  1.1.1 
    @vue/test-utils: ^1.0.0-beta.32 => 1.0.0-beta.32 
    @vue/web-component-wrapper:  1.2.0 
    eslint-plugin-vue: ^6.2.2 => 6.2.2 
    jest-serializer-vue:  2.0.2 
    vue: ^2.6.11 => 2.6.11 
    vue-eslint-parser:  7.0.0 
    vue-hot-reload-api:  2.3.4 
    vue-jest:  3.0.5 
    vue-loader:  15.9.0 
    vue-router: ^3.1.6 => 3.1.6 
    vue-style-loader:  4.1.2 
    vue-template-compiler: ^2.6.11 => 2.6.11 
    vue-template-es2015-compiler:  1.9.1 
    vuex: ^3.1.3 => 3.1.3 
    vuex-map-fields: ^1.4.0 => 1.4.0 
    vuex-persist: ^2.2.0 => 2.2.0 
  npmGlobalPackages:
    @vue/cli: 4.2.3
Steps to reproduce
$ vue-cli-service build --modern

What is expected?
completed build output - eg:

<!DOCTYPE html>
<html>

<head>
    <meta charset=utf-8>
    <meta http-equiv=X-UA-Compatible content="IE=edge">
    <meta name=viewport content="width=device-width,initial-scale=1">
    <!--custom-crap-omitted-->
    <title>vue-cli-plugins-recipes-plugin-pwa</title>
    <link href=/js/dynacomp.aba7a1c9.js rel=prefetch>
    <link href=/css/app.c0b4efd0.css rel=preload as=style>
    <link href=/js/app.61f06452.js rel=modulepreload as=script>
    <link href=/js/chunk-vendors.86d5e37a.js rel=modulepreload as=script>
    <link href=/css/app.c0b4efd0.css rel=stylesheet>
</head>

<body><noscript><strong>Oops! We're now JavaScript intensive. To continue, please enable javascript for this domain and
            hit refresh.</strong></noscript>
    <div id=app></div>
    <script type=module src=/js/chunk-vendors.86d5e37a.js></script>
    <script type=module src=/js/app.61f06452.js></script>
    <script>!function() {var e=document,t=e.createElement("script"); if(!("noModule" in t)&&"onbeforeload" in t) {var n=!1; e.addEventListener("beforeload",function(e) {if(e.target===t) n=!0; else if(!e.target.hasAttribute("nomodule")||!n) return; e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()} }();</script>
    <script src=/js/chunk-vendors-legacy.d2d26338.js nomodule></script>
    <script src=/js/app-legacy.699ad9ab.js nomodule></script>
</body>

</html>
What is actually happening?
post pre-load script and stylesheet links tags missing, while modulepreload and preload tags are injected:

<!DOCTYPE html>
<html>

<head>
    <meta charset=utf-8>
    <meta http-equiv=X-UA-Compatible content="IE=edge">
    <meta name=viewport content="width=device-width,initial-scale=1">
    <!--custom-crap-omitted-->
    <title>App Index Page</title>
    <link href=/PathBase/js/dynacomp.950584fd.js rel=prefetch>
    <link href=/PathBase/css/app.4140d910.css rel=preload as=style>
    <link href=/PathBase/css/chunk-common.0b339111.css rel=preload as=style>
    <link href=/PathBase/js/app.c06d38c6.js rel=modulepreload as=script>
    <link href=/PathBase/js/chunk-big-vendors.24e19969.js rel=modulepreload as=script>
    <link href=/PathBase/js/chunk-common.5a328198.js rel=modulepreload as=script>
<!--where is chunk-common|app.*.css-->
</head>

<body><noscript>...</noscript>
    <div id=app></div>
    <script type=module src=/PathBase/js/chunk-big-vendors.24e19969.js></script>
    <!--Where is chunk-common|app.*.css-->
    <script>!function () { var e = document, t = e.createElement("script"); if (!("noModule" in t) && "onbeforeload" in t) { var n = !1; e.addEventListener("beforeload", function (e) { if (e.target === t) n = !0; else if (!e.target.hasAttribute("nomodule") || !n) return; e.preventDefault() }, !0), t.type = "module", t.src = ".", e.head.appendChild(t), t.remove() } }();</script>
    <script src=/PathBase/js/chunk-big-vendors-legacy.24e19969.js nomodule></script>
</body>

</html>

More Info:
Potentially I have an issue w/my custom vue.config, but know that issues has prevailed over several months of CLI updates; @note had provided vue.config.js and public/index.html but getting 414 Request-URI Too Large? ping me for that info vue.config.js

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
    chunks: ['index', 'chunk-big-vendors'],
    reminder:
      process.env.NODE_ENV == 'development'
        ? '<h6>Remember! There is no node-modules/ in dev/</h6>'
        : ''
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
    chunks: ['index-plugin', 'chunk-big-vendors'],
    reminder:
      process.env.NODE_ENV == 'development'
        ? '<h6>Remember! There is no node-modules/ in dev/</h6>'
        : ''
  }
};

const opBase =
  '/var/www/TAPPADS/vegrds-7109/public_html/acap-dev/plugins/BasePath/';

// @todo 01/20 the `npm run server` yields nothing w/this config file in place?
module.exports = {
  publicPath:
    process.env.NODE_ENV == 'production'
      ? '/BasePath/'
      : '/BasePathDev/',
  publicPath:
    process.env.NODE_ENV == 'production'
      ? '/BasePath/'
      : '/BasePathDev/',
  outputDir:
    process.env.NODE_ENV == 'production' ? `${opBase}prod/` : `${opBase}dev/`,
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
    console.log('splitChunks', '\n', config.optimization.get('splitChunks'));
  },
  productionSourceMap: true
};

public/index.html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <!--custom-crap-omitted-->
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>

  <body>
    <noscript>
      <strong>Oops! We're now JavaScript intensive. To continue, please enable javascript for this domain and hit refresh.</strong>
    </noscript>
    <%= htmlWebpackPlugin.options.reminder %>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
…

Built with vue-cli · Check out source on GitHub