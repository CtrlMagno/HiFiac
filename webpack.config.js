const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pages = [
  { name: 'landing', entry: './src/pages/landing/index.ts', template: './src/pages/landing/index.html' },
  { name: 'login', entry: './src/pages/login/index.ts', template: './src/pages/login/index.html' },
  { name: 'signup', entry: './src/pages/signup/index.ts', template: './src/pages/signup/index.html' },
  { name: 'home', entry: './src/pages/home/appContainer.ts', template: './src/pages/home/home.html' },
  { name: 'user', entry: './src/pages/user/index.ts', template: './src/pages/user/index.html' },
  { name: 'EditProfile', entry: './src/pages/Edit Profile/index.ts', template: './src/pages/Edit Profile/index.html' },
];

const entry = {};
pages.forEach(page => {
  entry[page.name] = page.entry;
});

module.exports = {
  mode: 'development',
  entry,
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[path][name][ext]'
        }
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@flux': path.resolve(__dirname, 'src/flux')
    }
  },
  plugins: [
    ...pages.map(page => new HtmlWebpackPlugin({
      filename: `${page.name}.html`,
      template: page.template,
      chunks: [page.name],
    })),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets'
        }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: '/',
      serveIndex: true,
      watch: true
    },
    hot: true,
    port: 8080,
    open: {
      target: ['landing.html']
    }
  },
}
