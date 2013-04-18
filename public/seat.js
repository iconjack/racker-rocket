// class Seat < Actor

Seat.prototype = new Actor();

function Seat(x, y, scalar, angle) {

  Actor.apply(this, arguments);

  this.status = 'UNKNOWN';
}

Seat.prototype.path = function(context) {
  with (context) {
    beginPath();
    arc(0, 0, 1, 0, 2*Math.PI);   // also known as a circle
    closePath();
  }
}

Seat.fillstyles = { 'UNKNOWN': '#026F8C', 'UNOCCUPIED': '#A8B05A', 'OCCUPIED': '#000000', 'PENDING': '#E1FF00' };

Seat.prototype.draw = function(context) {
  with (context) {
    this.transform(context);
    this.path(context);
    strokeStyle = 'black';
    lineWidth = .1; 
    stroke();
    fillStyle = Seat.fillstyles[this.status];
    fill();
  }
}

//  Seat.prototype.hittest would go here,
//  but it turns out there's no reason to override Actor.

Seat.prototype.click = function(context, x, y) {
  if (this.status == "UNOCCUPIED") {
    this.status = "PENDING";
    var that = this;
    this.rocket.seatservice.claimSeat(this, function(result) {
      that.status = result == "OK" ? "OCCUPIED" : "UNOCCUPIED";
    });
  }
}
