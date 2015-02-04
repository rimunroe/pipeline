var pipeline = require('../dist/pipeline.js');
var _ = require('lodash');

app = pipeline({debug: true});

app.create.helper('multiply', function () {
  var args = ( 1 <= arguments.length) ? [].slice.call(arguments) : [];
  return _.reduce(args, function (product, arg) {
    return product * arg;
  }, 1);
});

app.start();

// console.log('product: ', app.helpers.multiply(1,2,3,4,5);)
