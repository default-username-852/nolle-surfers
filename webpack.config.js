const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports =
function foo(env, argv) {
  return {
    entry: './src/index.tsx',
    devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|glb|mp3)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        //template: '"!!html-loader!src/index.html",',
        title: 'nØlle-surfers',
        template: 'src/index.html',
        favicon: 'assets/icon.png',
      }),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.glb'],
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devServer: {
      client: {
        overlay: true,
        progress: true,
      },
      compress: true,
      hot: true,
    }
  };
};
