
function SeatService() {
}

  // change to take both rocket and seat, or just seat if it knows its own rocket,
  //  which it probably should because these are rocket seats, they can't exist on
  //  their own

SeatService.prototype.claimSeat = function(seat, callback) {
  rpc("claimseat", { "seatnumber": seat.number },
    function(response) {
      if (response == "OK") {
        callback("OK");
      }
      else {
        callback("ERROR");
      }
    },
    function(error) {
      callback("ERROR");
      //rocket.unclaimSeat(seatnumber);
    }
  );
}

// Shouldn't this take a completion?

SeatService.prototype.unclaimSeat = function(seat) {
  rpc("unclaimseat", { "seatnumber": seat.number },
    function(response) {
    }
  );
}

SeatService.prototype.seatStatus = function(completion) {
  rpc("seatstatus", { /* no params */ }, completion);
}

SeatService.prototype.emptySeats = function(completion) {
  rpc("emptyseats", { /* no params */ }, completion);
}
