PolySprite = function (options) {
  var self = this;

  if (! _.has(options, 'poly'))
    throw new Error("'poly' required");
  if (! _.has(options, 'game'))
    throw new Error("'game' required");

  self.game = options.game;
  self.pos = options.pos || [0, 0];
  self.vel = options.vel || 0;
  self.angle = options.angle || 0;
  self.angleVel = options.angleVel || 0;
  self.poly = options.poly;
  self.rot = options.rot || 0;
  self.rotSpeed = options.rotSpeed || 0;
  self.dead = false; // set to true to remove object
  self.lastTimeOnScreen = (+ new Date)/1000;

  // radius of bounding circle (centered at (0,0))
  self.boundingRadius = Math.sqrt(_.max(_.map(self.poly, function (point) {
    return point[0] * point[0] + point[1] * point[1];
  })));
};

_.extend(PolySprite.prototype, {
  update: function (dt, keys) {
    var self = this;
    self.pos[0] += Math.cos(self.angle) * self.vel * dt;
    self.pos[1] += Math.sin(self.angle) * self.vel * dt;
    self.angle += self.angleVel * dt;
    self.rot += self.rotSpeed * dt;
  },

  draw: function (ctx, selected) {
    var self = this;

    ctx.save();
    ctx.strokeStyle = "black";

    ctx.translate(self.pos[0], self.pos[1])
    ctx.rotate(self.rot);

    ctx.beginPath();
    for (var i = 0; i < self.poly.length; i++) {
      if (i === 0)
        ctx.moveTo(self.poly[i][0], self.poly[i][1]);
      else
        ctx.lineTo(self.poly[i][0], self.poly[i][1]);
    };
    ctx.closePath();

    ctx.stroke();

    if (selected) {
      ctx.fillStyle = "red";
      ctx.fill();
    }

    ctx.restore();
  },

  isOnScreen: function () {
    var self = this;

    return !(self.pos[0] + self.boundingRadius < 0 ||
             self.pos[0] - self.boundingRadius > DIM_X ||
             self.pos[1] + self.boundingRadius < 0 ||
             self.pos[1] - self.boundingRadius > DIM_Y);
  },

  live: function (now) {
    var self = this;

    if (self.dead)
      return false;

    if (self.isOnScreen()) {
      self.lastTimeOnScreen = now;
      return true;
    }
    else if (now - self.lastTimeOnScreen > 2) {
      // totally offscreen for two seconds. it can go away
      return false;
    }
    return true;
  },

  intersectsPoint: function (point) {
    var self = this;

    // Have to account for current position and rotation.
    var tx = point[0] - self.pos[0];
    var ty = point[1] - self.pos[1];

    if (tx * tx + ty * ty > self.boundingRadius * self.boundingRadius)
      // outside of bounding circle; can't intersect. save cpu
      return false;

    var cosRot = Math.cos(-self.rot);
    var sinRot = Math.sin(-self.rot);
    var rx = tx * cosRot - ty * sinRot;
    var ry = tx * sinRot + ty * cosRot;

    return isPointInPoly(self.poly, [rx, ry]);
  }
});