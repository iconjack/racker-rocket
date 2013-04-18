
//  class Rocket < Actor
//
//  Defines the behavior of a Rocket and it constituant parts 
//  such as Seat
//

Rocket.prototype = new Actor();

function Rocket(x, y, scalar, angle, seatservice)
{
  Actor.apply(this, arguments);
  this.seatservice = seatservice;

  this.seats = [new Seat(-0.12, -0.36, .16, 0.0), 
                new Seat(-0.20, -0.14, .16, 0.0),
                new Seat(-0.25, +0.08, .16, 0.0),
                new Seat(-0.23, +0.30, .16, 0.0),
                new Seat(-0.20, +0.52, .16, 0.0),
                new Seat(+0.20, +0.52, .16, 0.0),
                new Seat(+0.23, +0.30, .16, 0.0),
                new Seat(+0.25, +0.08, .16, 0.0),
                new Seat(+0.20, -0.14, .16, 0.0),
                new Seat(+0.12, -0.36, .16, 0.0) ];


  this.components = this.components.concat(this.seats);           

  //  Each seat knows what Rocket it belongs to and its seat number.
  //  These parameters could/should be part of the constructor.

  for (var i = 0; i < this.seats.length; i++) {
    this.seats[i].rocket = this;
    this.seats[i].number = i;
  } 

  var that = this;         //  http://stackoverflow.com/questions/4886632

  // update all non-pending seats
  function updateSeats(bitstring) {
    for (var i = 0; i < that.seats.length; i++) {
      if (that.seats[i].status != "PENDING") {
        that.seats[i].status = bitstring[i] == '1' ? "OCCUPIED" : "UNOCCUPIED";
      }
    }
  }

  //  poll the seat service periodically to keep the UI up to date

  setInterval(function() {
    seatservice.seatStatus(updateSeats)
  }, 500);
}

Rocket.prototype.emptySeats = function() {
  this.seatservice.emptySeats();
}

Rocket.prototype.path = function(context) {
  with (context) {
    beginPath();
    moveTo(-.3,.8);
    quadraticCurveTo(-0.8,-0.1, 0, -.8);
    quadraticCurveTo(0.8,-0.1, 0.3, .8);
    closePath();
  }
}

Rocket.prototype.draw = function(context) {
  with (context) {
    this.transform(context);

    this.path(context);
    strokeStyle = "#EA1000";
    lineWidth = 0.012;
    //stroke();

    fillStyle = '#C8B595';
    fill();    

    // the fins
    save();
    translate(-0.65,+0.95);
    drawfin();
    restore();
    save();
    translate(+0.65,+0.95);
    scale(-1,1);
    drawfin();
    restore();

    // the cone

    save();
    this.path(context);
    clip();
    beginPath();
    arc(0, -3.0, 2.45, 0, 2*Math.PI);
    fillStyle = 'red';
    fill();
    strokeStyle = 'black';
    lineWidth = 0.05;
    stroke();
    restore();
  }

  function drawfin() {
    with (context) {
      save();
      fillStyle = "#EA1000";
      strokeStyle = "rgb(0, 0, 0)";
      lineWidth = 0.003;
      beginPath();
      moveTo(0,0);
      bezierCurveTo(0,0,-0.0728,-0.26219,-0.0207,-0.49326);
      bezierCurveTo(0.0258,-0.69989,0.0776,-0.79454,0.11496,-0.86295);
      bezierCurveTo(0.15566,-0.93745,0.19596,-1.01866,0.22162,-0.99375);
      bezierCurveTo(0.24722,-0.96885,0.28482,-0.77442,0.30152,-0.60567);
      bezierCurveTo(0.31822,-0.43692,0.29252,-0.25506,0.29252,-0.25506);
      bezierCurveTo(0.29252,-0.25506,0.21962,-0.21876,0.15682,-0.16316);
      bezierCurveTo(0.09952,-0.11246,0.0,0.0,0.0,0.0);
      closePath();
      stroke();
      fill();
      stroke();
      restore();
    }
  }
}

//  x, y  in local coordinates

Rocket.prototype.click = function(context, x, y) {
  var i;
  with (context) {
    save();
    this.transform(context);

    for (i = 0; i < this.components.length; i++) {
      if (this.components[i].hittest(context,x,y)) {
        this.components[i].click(context, x, y);
      }
    }
    restore();
  }
}
