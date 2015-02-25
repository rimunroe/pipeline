
var _locationArray = function (location) {
  // todo: check for dubious items like undefined in the location array
  if (_.isArray(location)) {
    return _.clone(location);
  } else if (_.isString(location)) {
    return _.pull(location.split('.'), '');
  }
};

var _getRef = function (obj, location) {
  if (!obj) return undefined;
  var loc = _locationArray(location);
  var slot = obj;
  for (var key in loc) {
    if (slot[key]) {
      slot = slot[key];
    }
  }
  return slot;
};
