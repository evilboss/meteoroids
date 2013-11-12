Rock = function (options) {
  var self = this;

  // for "whole" we guarantee that (0, 0) isn't a vertex. for
  // "fragment" polygons we guarantee that (0, 0) is the first vertex.
  self.kind = options.kind || "whole";

  // we require that every line segment from (0, 0) to a vertex is
  // entirely inside the polygon.

  PolySprite.call(self, {
    game: options.game,
    pos: options.pos || [DIM_X / 2, DIM_Y / 2],
    vel: options.vel || Math.random() * 100,
    angle: options.angle || Math.random() * 2 * Math.PI,
    poly: options.poly || randomPoly(randint(40, 70)),
    rot: options.rot || 0,
    rotSpeed: options.rotSpeed || Math.random() * 6 - 3
  });
};

inherit(Rock, PolySprite);

_.extend(Rock.prototype, {
  update: function (dt, keys) {
    var self = this;

    PolySprite.prototype.update.call(self, dt, keys);

    if (self.intersectsPoint(self.game.ship.pos)) {
      alert("death comes for the archbishop");
      self.game.end();
    }
  },

  hitByBullet: function (bullet) {
    var self = this;

    if (self.poly.length === 3) {
      // Down to a single triangle. Subdivide into three triangles.
      var center = [
        (self.poly[0][0] + self.poly[1][0] + self.poly[2][0]) / 3,
        (self.poly[0][1] + self.poly[1][1] + self.poly[2][1]) / 3
      ];

      for (var i = 0; i < 3; i++) {
        var verts = [center];
        for (var j = 0; j < 2; j++)
          verts.push(self.poly[(i + j) % 3]);

        self.game.addThing(new Rock({
          game: self.game,
          kind: "small",
          pos: _.clone(self.pos),
          vel: self.vel + rand(25, 100),
          angle: self.angle + rand(-Math.PI/2, Math.PI/2),
          poly: verts,
          rot: self.rot,
          rotSpeed: self.rotSpeed + rand(-Math.PI/2, Math.PI/2),
        }));
      }

      self.dead = true;
      return;
    }

    // Shatter
    var vertCount = self.poly.length;
    for (var i = (self.kind === "whole" ? 0 : 1);
         i < vertCount - (self.kind !== "whole" ? 1 : 0); ) {
      var howMany = randint(2, _.min([vertCount - i +
                                      (self.kind === "whole" ? 1 : 0), 5]));
      if (howMany >= vertCount - 1)
        continue; // nope, try again (otherwise would output same fragment)

      var verts = [[0, 0]];
      for (var j = 0; j < howMany; j++) {
        var idx = i + j;
        if (idx === vertCount)
          idx = (self.kind === "whole" ? 0 : 1)
        verts.push(self.poly[idx]);
      }

      self.game.addThing(new Rock({
        game: self.game,
        kind: "small",
        pos: _.clone(self.pos),
        vel: self.vel + rand(25, 100),
        angle: self.angle + rand(-Math.PI/2, Math.PI/2),
        poly: verts,
        rot: self.rot,
        rotSpeed: self.rotSpeed + rand(-Math.PI/2, Math.PI/2),
      }));

      i += howMany - 1;
    }

    self.dead = true;
  }
});