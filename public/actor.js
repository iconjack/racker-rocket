
//  actor.js
//  
//  These screen objects (Actors) have the following interface:
//
//  ctor(x, y, scalar, angle)
//  draw(context)               draw themselves 
//  hittest(context,x,y)  
//  visible   (property)        true/false
//  components                  array of sub-actors
//  click(x,y)                  called when a click has occurs at (x,y) (relative)

//  Important note about the .draw and .hittest methods:
//  They will be called with a context that has already
//  had position, scale and rotation applied.

//  Actors are drawn full-size inside the square [-1,1] x [-1,1].
//  They know their own position, scale, and angle.

function Actor(x, y, scalar, angle) {
  this.x = x || 0.0;;
  this.y = y || 0.0;
  this.scalar = scalar || 1.0;
  this.angle = angle || 0.0;
  this.visible = true;
  this.components = [];
}

// Get an Actor's matrix from its position, scale and rotation.
//  This is accomplished by multiplying the three matrices. 
// Note: matrix multiplication is not commutative in general,
// but we're dealing with a special case (by design).
//  Translation is applied first, because we want our position relative
// to the container; then we apply scale and rotation. But even a scaling
// matrix and a rotation matrix are not commutative. However, in the case
// where the scaling is uniform in both dimensions, i.e. sx = sy, it is.
//
//  The full homogeneous transformation matrix is
//
//      s*(cos a)  s*(sin a)  tx
//     -s*(cos a)  s*(cos a)  ty
//          0         0       1
//
//   but canvas only needs the top two rows (6 entries).
//

Actor.prototype.matrix = function() {
  var sin = Math.sin(this.angle);
  var cos = Math.cos(this.angle);
  var s = this.scalar;
  var tx = this.x, ty = this.y;
  return [ s*cos, s*sin, tx,
          -s*sin, s*cos, ty  ];
}

// Apply position, scale and rotation of this Actor to the given context.
// Modifies the context in situ.

Actor.prototype.transform = function(context) {
  with (context) {
    translate(this.x, this.y);
    scale(this.scalar/2, this.scalar/2);
    rotate(this.angle);
  }
}

// Fallback draw method. If there's a path method defined,
// this will draw a gray outline around it.

Actor.prototype.draw = function(context) {
  if (typeof this.path === 'function') {
    with (context) {
      this.transform(context);
      this.path(context);
      lineWidth = .01;
      strokeStyle = 'gray';
      stroke();
    }
  }
}

// Fallback draw method. If there's a path method defined,
// this will check if the given x,y are in the interior.

Actor.prototype.hittest = function(context, x,y) {
  if (typeof this.path === 'function') {
    with (context) {
      save();
      this.transform(context);
      this.path(context);
      restore();
      return isPointInPath(x, y);
    }
  }
}

