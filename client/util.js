// Return a random real uniformly distributed in [min, max).
rand = function (min, max) {
  return min + Math.random() * (max - min);
};

// Return a random integer uniformly distributed in [min, max].
randint = function (min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

// Return an array of points for a random asteroid-like polygon,
// bounded by a circle of the given radius.
randomPoly = function (radius) {
  var angles = new Array(_.random(7,14));

  for (var i = 0; i < angles.length; i++ ) {
    angles[i] = (2 * Math.PI * i / angles.length + Math.random() * 0.2);
  }
  angles.sort();

  return _.map(angles, function (angle) {
    var x = radius * Math.cos(angle) * (0.4 + (Math.random() * 0.6));
    var y = radius * Math.sin(angle) * (0.4 + (Math.random() * 0.6));
    return [x, y];
  });
};

inherit = function (subclass, superclass) {
  var f = function () {};
  f.prototype = superclass.prototype;
  subclass.prototype = new f;
};

// Return x if it is within [min, max]. Otherwise return min or max.
clamp = function (x, min, max) {
  if (x < min)
    return min;
  if (x > max)
    return max;
  return x;
};

// Return a random choice from an array.
choose = function (choices) {
  return choices[randint(0, choices.length - 1)];
};