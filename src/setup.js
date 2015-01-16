var isNode = typeof window == 'undefined';

var _ = isNode ? require('lodash') : this._;

var pipeline = {};
