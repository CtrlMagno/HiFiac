const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    login: "./src/Pages/login/index.ts",
    signup: "./src/Pages/signup/index.ts",
    home: "./src/Pages/home/appContainer.ts",
    landing: "./src/Pages/landing/index.ts",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".css"],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/Pages/login/index.html",
      filename: 'index.html',
      chunks: ['login']
    }),
    new HtmlWebpackPlugin({
      template: "./src/Pages/signup/index.html",
      filename: 'signup',
      chunks: ['signup']
    }),
    new HtmlWebpackPlugin({
      template: "./src/Pages/home/home.html",
      filename: 'home',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      template: "./src/Pages/landing/index.html",
      filename: 'landing',
      chunks: ['landing']
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    hot: true,
    port: 8080,
    historyApiFallback: {
      rewrites: [
        { from: /^\/signup$/, to: '/signup.html' },
        { from: /^\/home$/, to: '/home.html' },
        { from: /^\/landing$/, to: '/landing.html' },
        { from: /./, to: '/index.html' }
      ]
    },
    open: true
  },
}