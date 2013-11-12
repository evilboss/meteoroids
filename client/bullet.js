var stages = [
  {fuze: .4, kids: 5, speed: 1.5},
  {fuze: .5, kids: 10, speed: .5},
  {fuze: .25, kids: 5, speed: .25},
  {fuze: .25, kids: 0, speed: .1}
];

Bullet = function (options) {
  var self = this;

  self.stage = options.stage || 0;

  self.fuze = stages[self.stage].fuze;
  self.sourceTime = options.sourceTime || (+ new Date)/1000;

  PolySprite.call(self, {
    game: options.game,
    pos: options.pos,
    vel: 500 * stages[self.stage].speed,
    angle: options.angle,
    poly: [
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1]
    ]
  });
};

inherit(Bullet, PolySprite);

_.extend(Bullet.prototype, {
  update: function (dt, keys) {
    var self = this;

    PolySprite.prototype.update.call(self, dt, keys);

    for (var i = 0; i < self.game.things.length; i++) {
      var thing = self.game.things[i];

      if (thing instanceof Rock && thing.intersectsPoint(self.pos)) {
        thing.hitByBullet(self);
        self.dead = true;
        break;
      }
    }

    self.fuze -= dt;
    if (self.fuze < 0) {
      self.dead = true;
      if (self.stage + 1 === stages.length)
        return;

      var kids = stages[self.stage].kids;
      var offset = (self.sourceTime * 3) % (Math.PI * 2)
      for (var i = 0; i < kids; i++) {
        self.game.addThing(new Bullet({
          game: self.game,
          pos: _.clone(self.pos),
          angle: self.angle + offset + i / kids * Math.PI * 2,
          stage: self.stage + 1,
          sourceTime: self.sourceTime
        }));
      }
    }
  }
});
