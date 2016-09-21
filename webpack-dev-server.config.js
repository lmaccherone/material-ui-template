const webpack = require('webpack')
const path = require('path')
const buildPath = path.resolve(__dirname, 'src/www')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const cookie = {
  name: "pendo.sess",
  value: process.env.PENDO_SESS
}
const header = {
  Cookie: cookie.name + "=" + cookie.value
}

const config = {
  //Entry point to the project
  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/app/app.jsx'),
  ],
  //Webpack config options on how to obtain modules
  resolve: {
    //When requiring, you don't need to add these extensions
    extensions: ['', '.js', '.jsx', '.md', '.txt'],
    //alias: {
    //  //material-ui requires will be searched in src folder, not in node_modules
    //  'material-ui/lib': path.resolve(__dirname, '../src'),
    //  'material-ui': path.resolve(__dirname, '../src'),
    //},
    //Modules will be searched for in these directories
    modulesDirectories: [
      // We need /docs/node_modules to be resolved before /node_modules
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, 'src/app/components/raw-code'),
      path.resolve(__dirname, 'src/app/components/markdown'),
    ],
  },
  //Configuration for dev server
  devServer: {
    contentBase: 'src/www',
    devtool: 'eval',
    hot: true,
    inline: true,
    port: 3000,
    proxy: {
      '/api/*': {target: 'http://localhost:1338', secure: false},
    }
  },
  devtool: 'source-map',
  //Output file config
  output: {
    path: buildPath,    //Path of output file
    filename: 'app.js',  //Name of output file
  },
  plugins: [
    //Used to include index.html in build folder
    new HtmlWebpackPlugin({
      inject: false,
      template: path.join(__dirname, '/src/www/index.html'),
      filename: 'index.html'
    }),
    //Allows for sync with browser while developing (like BorwserSync)
    new webpack.HotModuleReplacementPlugin(),
    //Allows error warninggs but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    // The below was commented out after I found out that the fetch polyfill didn't work on Safari
    //new webpack.ProvidePlugin({
    //  'Promise': 'es6-promise',
    //  'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    //}),
  ],
  externals: {
    fs: 'js', // To remove once https://github.com/benjamn/recast/pull/238 is released
  },
  module: {
    //eslint loader
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, '../src')],
        exclude: [
          path.resolve(__dirname, '../src/svg-icons'),
        ],
      },
    ],
    //Allow loading of non-es
    loaders: [
      {
        test: /\.jsx$/,
        loaders: [
          'react-hot',
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      //{
      //  test: /\.js$/,
      //  loaders: [
      //    "transform?brfs",
      //    'babel-loader',
      //  ],
      //  exclude: /node_modules/,
      //},
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader',
        include: path.resolve(__dirname, 'src/app/components/raw-code'),
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      { test: /\.cjsx$/, loaders: ['coffee', 'cjsx']},
      { test: /\.coffee$/, loader: 'coffee' },
    ],
    //postLoaders: [
    //  {
    //    loader: "transform?brfs"
    //  }
    //],
  },
  resolve: {
    extensions: ["", ".cjsx", ".coffee", ".js", ".jsx", ".json", ".txt", ".md", ".css"]
  },
  eslint: {
    configFile: '../.eslintrc',
  },
}

module.exports = config
