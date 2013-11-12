DIM_X = null;
DIM_Y = null;

Meteor.startup(function () {
  DIM_X = $(window).width();
  DIM_Y = $(window).height();

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  canvas.setAttribute("width", DIM_X);
  canvas.setAttribute("height", DIM_Y);

  $('#canvasContainer').append(canvas);

  /*var*/ game = new Game(canvas);
  game.start();
});
