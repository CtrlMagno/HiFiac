const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/Pages/home/appContainer.ts",
  output: {
    filename: "bundle.js",
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
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
        ],
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "public"),
        ],
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
      template: "./src/Pages/home/home.html",
      inject: true,
      filename: 'index.html'
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
      publicPath: "/"
    },
    hot: true,
    port: 8080,
    historyApiFallback: true,
    devMiddleware: {
      publicPath: "/"
    }
  },
};