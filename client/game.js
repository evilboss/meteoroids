// map from key names to keycodes that count as that key
var keys = {
  up: [38, 87],
  down: [40, 83],
  left: [37, 65],
  right: [39, 68],
  space: 32,
  esc: 27,
  '1': 49
};

Game = function (canvas) {
  var self = this;

  self.canvas = canvas;
  self.ctx = canvas.getContext("2d");
  self.lastFrameTime = null;
  self.things = [];
  self.keyCodesPressed = {}; // map from keycode (as string) to true or false
  self.keysPressed = {}; // map from key name (eg, 'up') to true
  self.mousePos = [0, 0]; // mouse position in canvas pixels
  self.paused = false; // is game paused?
  self.addedThings = [];
  self.ended = false;

  self.ship = new Ship({game: this});
  self.things.push(self.ship);

  self.things.push(new RockSpawner({ game: this }));
};

_.extend(Game.prototype, {
  start: function () {
    var self = this;

    self.lastFrameTime = (+ new Date)/1000;

    self.bindEventHandlers();

    requestAnimationFrame(_.bind(this.nextFrame, this));
  },

  end: function () {
    var self = this;
    self.ended = true;
  },

  bindEventHandlers: function () {
    var self = this;
    var codeToName = {};

    _.each(keys, function (codes, name) {
      if (! (codes instanceof Array))
        codes = [codes];
      _.each(codes, function (code) {
        codeToName[code] = name;
      });
    });

    var recomputeKeysPressed = function () {
      self.keysPressed = {};
      _.each(self.keyCodesPressed, function (pressed, code) {
        if (pressed)
          self.keysPressed[codeToName[code]] = true;
      });
    }

    $(window).keydown(function (evt) {
      if (_.has(codeToName, evt.which)) {
        evt.preventDefault();
        if (self.keyCodesPressed[evt.which])
          return;
        self.keyCodesPressed[evt.which] = true;
        recomputeKeysPressed();

        var method = 'press_' + codeToName[evt.which];
        self[method] && self[method].call(self);
      }
    });

    $(window).keyup(function (evt) {
      if (_.has(codeToName, evt.which)) {
        self.keyCodesPressed[evt.which] = false;
        evt.preventDefault();
        recomputeKeysPressed();
      }
    });

    $(window).mousemove(function (evt) {
      var rect = self.canvas.getBoundingClientRect();
      self.mousePos = [
        evt.clientX - rect.left,
        evt.clientY - rect.top
      ];
    });

  },

  nextFrame: function () {
    var self = this;
    var ctx = self.ctx;

    var now = (+ new Date)/1000;
    var dt = now - self.lastFrameTime;
    self.lastFrameTime = now;

    if (dt > 1.0)
      // While using debugger, proceed at 10 fps
      dt = .1;

    _.each(self.keysPressed, function (pressed, key) {
      if (pressed) {
        var method = "hold_" + key;
        if (self[method])
          self[method].call(self);
      }
    });

    self.things.push.apply(self.things, self.addedThings);
    self.addedThings = [];

    if (! self.paused) {
      _.each(self.things, function (thing) {
        thing.update && thing.update(dt, self.keysPressed);
      });
    }

    if (self.ended)
      return; // if the game is over, avoid drawing one last frame

    self.ctx.clearRect(0,0, DIM_X, DIM_Y);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, self.canvas.getAttribute("width"),
                 self.canvas.getAttribute("height"));

    var newThings = [];
    _.each(self.things, function (thing) {
      var mouseOverThing = thing.intersectsPoint &&
        thing.intersectsPoint(self.mousePos);

      thing.draw && thing.draw(ctx, mouseOverThing);
      if ((! thing.live) || thing.live(now))
        newThings.push(thing);
    });
    self.things = newThings;

    self.drawHud();
    requestAnimationFrame(_.bind(this.nextFrame, this));
  },

  drawHud: function () {
    var self = this;
    var ctx = self.ctx;
    ctx.fillStyle = "black";
    ctx.font = "bold 16px Helvetica";
    var banner = (self.paused ? "PAUSED " : "") + this.things.length + " " +
      _.keys(self.keysPressed).join(' ');
    ctx.fillText(banner, 15, 25);
  },

  addThing: function (thing) {
    var self = this;
    self.addedThings.push(thing);
  },

  hold_space: function () {
    var self = this;
    self.ship.tryFire();
  },

  press_esc: function () {
    var self = this;
    self.paused = ! self.paused;
  }
});