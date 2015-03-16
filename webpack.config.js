var path = require('path');

module.exports = {
  entry: path.join(__dirname, "src", "main.js"),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'pipeline.js',
    libraryTarget: "umd",
    library: "pipeline"
  },
  plugins: []
};
