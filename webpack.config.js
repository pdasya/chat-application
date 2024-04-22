const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const EslintPlugin = require('eslint-webpack-plugin');

const baseConfig = {
  entry: path.resolve(__dirname, "src/index.ts"),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
        filename: "index.html",
        favicon: 'src/assets/favicons/chat_favicon_32x32.png',
    }),
    new CleanWebpackPlugin(),
    // new CopyPlugin({
    //     patterns: [
    //       {
    //         from: path.resolve(__dirname, "src/components/view/img"),
    //         to: "img", // Updated to simplify the 'to' path
    //       },
    //     ],
    // }),
    new EslintPlugin({ extensions: ['ts'] }),
  ],
  resolve: {
    alias: {
      img: path.join(__dirname, "src", "components", "view", "img"),
    },
    extensions: ['.ts', '.js']
  },
  // devServer: {
  //   open: true,
  //   host: "localhost",
  // },
  module: {
    rules: [
      {
        test: /\.(jpg|png|svg|jpeg|gif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts$/i,
        use: "ts-loader",
      },
    ],
  },
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  // eslint-disable-next-line global-require
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
