const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    configureWebpack: {
        entry: {
        detailsPlugin: ['./src/details-plugin.js'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index-plugin.html',
                title: 'Webpack Recipe Details Plugin App',
                inject: 'body',
                filename: 'index-plugin.html'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common'
            })
        ],
        output: {
            chunkFilename: '[name].bundle.js',
        }
    }
}