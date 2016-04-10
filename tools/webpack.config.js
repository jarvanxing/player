/*
* @Author: xilie
* @Date:   2016-03-20 04:09:59
* @Last Modified by:   xilie
* @Last Modified time: 2016-04-08 20:55:51
*/
import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

const WATCH = global.WATCH || false;
const DEBUG = true;
const VERBOSE = true;
const DefinePlugin = webpack.DefinePlugin;
const BannerPlugin = webpack.BannerPlugin;

const CSS_LOADER = DEBUG ? 'css-loader' : 'css-loader?minimize';
const __SERVER_PATH__ = 'http://127.0.0.1:1616'

const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  DEBUG: DEBUG,
  __BROWSER__: false,
  __SERVER__: false,
  __SERVER_PATH__: JSON.stringify(__SERVER_PATH__)
};

const getFinalFileName = function(name = '[name]', type = 'js') {
  return DEBUG ? `${name}.${type}?[hash]` : `${name}.[hash].${type}`
}

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

// const nodeModulesPath = path.resolve(__dirname, './node_modules/');
// const distPath = path.resolve(__dirname, './dist/');
// const srcPath = path.resolve(__dirname, './src/');

const config = {
  context: path.resolve(__dirname, '../src'),
  output: {
  	path: path.resolve(__dirname, '../build'),
    // publicPath: './',
    filename: getFinalFileName(),
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: /node_modules/,
      },
    ],
    loaders: [{
      test: /\.swf/,
      loader: 'file-loader?name=assets/[name].[ext]'
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/,
      loader: 'url-loader?limit=10000&name=assets/[name]_[hash].[ext]'
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  eslint: {
    // configFile: path.resolve(__dirname, './.eslintrc.js'),
    // useEslintrc: false,
    cache: true,
    fix: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new BannerPlugin('/**' + new Date() + '**/', { raw: true, entryOnly: false }),
    ...(WATCH && [
      new webpack.HotModuleReplacementPlugin()
    ]),
    new webpack.NoErrorsPlugin()
  ]
};


const browserConfig = Object.assign({}, config, {
  plugins: [
    ...config.plugins,
    ...(!DEBUG && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: { screw_ie8: true, warnings: VERBOSE}})
    ])
  ],

  module: {
    loaders: [...config.module.loaders, {
      test: /\.css$/,
      loader: `${CSS_LOADER}!postcss-loader`
    }]
  },

  postcss: [ autoprefixer({ browsers: ['last 5 versions', 'Explorer >= 9', '> 1%']}) ]
});


const playerConfig = Object.assign({}, browserConfig, {
  target: 'web',
  entry: {
    player: [
      ...(WATCH && [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
      ]),
      '../src/player/index.js'
    ]
  }
});

const websiteConfig = Object.assign({}, browserConfig, {
  target: 'web',
  entry: {
    client: [
      ...(WATCH && [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
      ]),
      '../src/client/index.js'
    ]
  }
});

export default [websiteConfig];
