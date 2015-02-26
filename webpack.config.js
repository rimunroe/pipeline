var path = require('path');

module.exports = {
  entry: path.join(__dirname, "src", "main.js"),
  output: {
    libraryTarget: "umd",
    library: "pipeline"
  },
  externals: {
    _: "lodash",
    react: "React"
  }
};
