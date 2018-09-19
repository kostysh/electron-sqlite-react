const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sharedModule = {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    electron: '2.0.9'
                                }
                            }
                        ], 
                        '@babel/preset-react'
                    ]
                }
            }
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: ['url-loader']
        }
    ]
};

module.exports = {
    electronRebuildConfig: {
        // force: true
    },
    plugins: [
        [
            '@electron-forge/plugin-webpack', {
                mainConfig: {
                    entry: {
                        index: [
                            '@babel/polyfill',
                            path.resolve(__dirname, 'src/index.js')
                        ]
                    },
                    module: sharedModule,
                    plugins: [
                        new CopyWebpackPlugin([
                            {
                                from: path.resolve(__dirname, 'src/assets'),
                                to: path.resolve(__dirname, '.webpack/assets')
                            }
                        ])
                    ],
                    output: {
                        filename: '[name].js'
                    }
                },
                renderer: {
                    config: {
                        module: merge.smart({
                            rules: [
                                {
                                    test: /\.css$/,
                                    use: ['style-loader', 'css-loader']
                                },
                                {
                                    test: /\.(svg)$/,
                                    use: ['svg-loader']
                                }
                            ]
                        }, sharedModule),
                        resolve: {
                            extensions: ['.js', '.json'],
                        }
                    },
                    prefixedEntries: process.env.NODE_ENV === 'production' ? [] : ['react-hot-loader/patch'],
                    entryPoints: [
                        {
                            html: path.resolve(__dirname, 'src/renderer/index.html'),
                            js: path.resolve(__dirname, 'src/renderer/index.js'),
                            name: 'main_window'
                        }
                    ]
                }
            }
        ]
    ],
    packagerConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'pandora-market'
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: [
                'darwin'
            ]
        },
        {
            name: '@electron-forge/maker-deb',
            config: {}
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {}
        }
    ],
    publishers: []
};
