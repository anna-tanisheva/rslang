/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require ('eslint-webpack-plugin');
const CopyWebpackPlugin = require ('copy-webpack-plugin')

const baseConfig = {
    entry: path.resolve(__dirname, './src/index.ts'),
    mode: 'development',
    module: {
        rules: [
            {
              test: /\.html$/,
              use: [
                {
                  loader: "html-loader",
                  options: { minimize: false },
                }
              ]
            },
            {
              test: /\.s[ac]ss$/i,
              use: [
                // Creates 'style' nodes from JS string
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
                {
                  loader: 'sass-resources-loader',
                  options: {
                    resources: [
                      'src/styles/vars.scss',
                      // 'src/styles/mixins.scss'
                    ]
                  }
                }
              ],
            },
            {
                test: /\.[tj]s$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
              test: /\.png|\.svg|\.jpg|\.jpeg$|\.ico$/,
              loader: "file-loader",
              options: {
                name: '[name].[ext]',
                outputPath: 'images'
              }
            },
            {
              test: /\.mp3$/,
              loader: "file-loader",
              options: {
                name: '[name].[ext]',
                outputPath: 'sounds'
              }
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new ESLintPlugin({extensions: ['ts', 'js']}),
        // new CopyWebpackPlugin({ patterns: [{ from: path.resolve(__dirname, './src/assets/images'), to: path.resolve(__dirname, 'dist/images') }] }),
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};