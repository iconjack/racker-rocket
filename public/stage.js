// A Stage object represents a canvas on which Actors appear.

function Stage(context, bgcolor, bgimage) {
  this.context = context;
  this.bgcolor = bgcolor || "rgb(0,0,0)";
  this.bgimage = bgimage;
  this.bgalpha = 1.0;
  this.bgoffsetx = this.bgoffsety = 0.0;
  this.components = [];
  this.visible = true;

  var that = this;

  context.canvas.addEventListener("click",
      function clickHandler(clickEvent) {
      var loc = getClickLocation(that.context.canvas, clickEvent); // [x,y] relative to canvas
      var x = loc[0], y = loc[1];

      for (i = 0; i < that.components.length; i++) {
        if (that.components[i].hittest(that.context, x, y)) {
          that.components[i].click(that.context, x, y);
        }
      }
    },
    false);
}

Stage.prototype.draw = function(actor) {
  this.context.save();

  // if no actor given, draw whole stage
  if (!actor) {
    this.context.save();
    this.context.fillStyle = this.bgcolor;
    this.context.fillRect(0.0, 0.0, canvas.width, canvas.height);
    this.context.restore();

    if (this.bgimage) {
      this.context.save();
      var alpha = this.context.globalAlpha;
      this.context.globalAlpha = alpha * this.bgalpha;
      this.context.drawImage(this.bgimage, -this.bgoffsetx, -this.bgoffsety);
      this.context.restore();
    }
    actor = this;  // from here on out we'll treat the stage as an ordinary Actor
  }
  // draw just the given actor if visible
  else {
    if (actor.visible) {
      actor.draw(this.context);
    }
  }

  for (var i = 0; i < actor.components.length; i++) {
    this.context.save();
    this.draw(actor.components[i]);
    this.context.restore();
  }

  this.context.restore();
}
