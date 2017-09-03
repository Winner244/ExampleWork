var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var glob = require('glob');

/**
 * npm install webpack webpack-dev-server glob babel-loader babel-core babel-preset-es2015 json-loader style-loader \
 *  less less-loader css-loader babel-plugin-transform-runtime react-hot-loader@1.3.0 file-loader babel-preset-react --save-dev
 **/

// Check `production` or `--production` in cli arguments
var isProduction = process.argv.splice(2).filter(a => a.match(/(--)?production/) !== null).length > 0;

var globPromise = function (pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};

Promise.all([
        // Index less
        globPromise(`./app/*/less/index-public.less`),

        // Index js. Core module at first
        globPromise(`./app/*/client.js`)
            .then(files => files.sort(file => file.indexOf('app/core/') !== -1 ? -1 : 1)),

        // Widgets. Only widgets with php file. Filter /path/MY_WIDGET/MY_WIDGET.js
        globPromise(`./app/*/widgets/*/*.+(js|jsx|php)`)
            .then(files => {
                let phpWidgets = files
                    .filter(file => file.match(/\.php$/))
                    .map(file => file.match(/([^\/]+)\.php$/)[1]);

                return files
                    .filter(file => file.match(/\.jsx?$/))
                    .filter(file => phpWidgets.indexOf(file.match(/([^\/]+)\.jsx?$/)[1]) !== -1)
                    .filter(file => file.match(/([^\/]+)\.jsx?$/)[1] === file.match(/([^\/]+)\/[^\/]+?$/)[1]);
            })
    ])
    .then(result => {
        // entries
        let entry = {
            'style-public': result[0],
            site: './app/site/site',
            index: result[1]
        };
        result[2].forEach(file => {
            let name = file.match(/([^\/]+)\.jsx?$/)[1];
            entry[name] = file;
        });

        // Add hot replacement modules
        if (!isProduction) {
            Object.keys(entry).forEach(key => {
                entry[key] = []
                    .concat(entry[key])
                    .concat(!isProduction ? 'webpack/hot/only-dev-server' : []);
            });
            entry.index.push('webpack-dev-server/client?http://localhost:5005/');
        }

        let config = {
            entry: entry,
            output: {
                path: `${__dirname}/public/`,
                publicPath: isProduction ? '/' : 'http://localhost:5005/',
                filename: 'assets/bundle-[name].js',
                chunkFilename: 'assets/bundle-[name].js'
            },
            devtool: isProduction ? 'sourcemap' : 'eval',
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        loaders: [
                            'react-hot',
                            'babel?' + JSON.stringify({
                                cacheDirectory: true,
                                plugins: isProduction ? ['babel-plugin-transform-runtime'] : '',
                                presets: ['es2015', 'react']
                            })
                        ],
                        exclude: /node_modules(\/|\\+)(?!jii)/
                    },
                    {
                        test: /\.jsx?$/,
                        loader: 'eslint',
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.json$/,
                        loader: 'json'
                    },
                    {
                        test: /\.less$/,
                        loaders: ['style', 'css', 'less']
                    },
                    {
                        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                        loader: 'file-loader',
                        query: {
                            name: 'fonts/[name].[ext]'
                        }
                    }
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: isProduction ? '"production"' : '""',
                        JII_NO_NAMESPACE: '1',
                    }
                }),
                isProduction && new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                !isProduction && new webpack.HotModuleReplacementPlugin(),
                new webpack.optimize.CommonsChunkPlugin('index', 'assets/bundle-index.js'),
            ]
                .filter(v => v)
        };

        if (isProduction) {
            webpack(config, (err, stats) => {
                if (err) {
                    throw new Error(err);
                }
                console.error(stats.compilation.errors.map(e => String(e)).join('\n'));
            });
        } else {
            new WebpackDevServer(
                webpack(config),
                {
                    hot: true,
                    inline: true,
                    contentBase: './public',
                    historyApiFallback: true,
                    proxy: {
                        '**': 'http://localhost'
                    },
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    stats: {
                        chunks: false,
                        colors: true
                    }
                }
            ).listen(5005, 'localhost', function (err) {
                if (err) {
                    throw new Error(err);
                }

                console.log('Listening at http://localhost:5005');
            });
        }
    })
    .catch(e => console.log(e));
