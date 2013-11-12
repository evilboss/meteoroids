RockSpawner = function (options) {
  var self = this;

  self.game = options.game;
  self.nextSpawnTime = null;
  self.lastInterval = 1.0;
};

_.extend(RockSpawner.prototype, {
  update: function (dt, keys) {
    var self = this;

    var now = (+ new Date) / 1000;
    if (self.nextSpawnTime === null)
      self.nextSpawnTime = now;

    while (self.nextSpawnTime <= now) {
      if (Math.random() > .5)
        var pos = [
          choose([-50, DIM_X + 50]),
          Math.floor(Math.random() * DIM_Y)
        ];
      else
        var pos = [
          Math.floor(Math.random() * DIM_X),
          choose([-50, DIM_Y + 50])
        ];

      self.game.addThing(new Rock({
        game: self.game,
        pos: pos
      }));

      var interval = self.lastInterval * .99;
      if (interval < .1)
        interval = .1;
      self.nextSpawnTime += interval;
      self.lastInterval = interval;
    }
  }
});