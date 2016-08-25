const path = require('path');

module.exports = [
  {
    name: "extension",
    entry: [path.resolve(__dirname, 'client', 'src', 'components', 'App.jsx'), 'whatwg-fetch'],
    output: {
      path: __dirname + '/client/dist',
      filename: 'bundle.js'
    },
    // devServer: {
    //   inline: true,
    //   contentBase: __dirname + '/client/dist',
    //   port: 8100
    // },
    module: {
      loaders: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          include: /client/,
          loaders: ['react-hot', 'babel']
        }
      ],
    },
    externals: {
      "jquery": "jQuery",
      "Chrono": "Chrono",
      "artyom": "artyom",
      "moment": "moment"
    }    
  },
  {
    name: "web",
    entry: ['./web/index.jsx', './web/dist/styles/main.scss'],
    output: {
      path: __dirname + '/web/dist',
      filename: 'bundle.js'
    },
    // devServer: {
    //   inline: true,
    //   contentBase: __dirname+'/web/dist',
    //   port: 8100
    // },
    module: {
      loaders: [
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          include: /web/,
          loaders: ['react-hot', 'babel']
        },
        {
          test: /\.scss$/,
          loader: 'style!css!sass'
        }
      ]
    }
  }
];


