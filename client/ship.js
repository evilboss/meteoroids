Ship = function (options) {
  var self = this;

  self.lastShotTime = 0;

  PolySprite.call(self, {
    game: options.game,
    pos: [DIM_X / 2, DIM_Y / 2],
    poly: [
      [7, 0],
      [-7, -5],
      [-7, 5]
    ]
  });
};

inherit(Ship, PolySprite);

_.extend(Ship.prototype, {
  update: function (dt, keys) {
    var self = this;

    if (keys.up)
      self.vel += 1200 * dt;
    if (keys.down)
      self.vel -= 1200 * dt;
    if (keys.left)
      self.angleVel -= 30 * dt;
    if (keys.right)
      self.angleVel += 30 * dt;

    // Drag
    // XXX should depend on dt..
    self.vel *= .95;
    self.angleVel *= .9;

    // Maximum velocity
    self.vel = clamp(self.vel, -200, 300);
    self.angleVel = clamp(self.angleVel, -6, 6);

    self.rot = self.angle;
    PolySprite.prototype.update.call(this, dt, keys);
  },

  tryFire: function () {
    var self = this;

    // limit firing rate
    var now = (+ new Date) / 1000;
    if (now - self.lastShotTime < .1)
      return;
    self.lastShotTime = now;

    var b = new Bullet({
      game: self.game,
      pos: _.clone(self.pos),
      angle: self.angle
    });
    self.game.things.push(b);
  }
});