
//  a class for managing a pool of requests

function RequestPool(poolsize) {
	var i;
	var pool = this.pool = new Array(poolsize);
	for (i = 0; i < poolsize; i++) {
		pool[i] = new XMLHttpRequest();
		pool[i].inuse = false;
	}

  this.requests = 0;
  this.timeouts = 0;
}

//  Send off a request in a free request from the pool.

RequestPool.prototype.sendrequest = 
function(url, method, payload, completion, errorhandler, timeout) {

  //  if no error handler given, insert a default one

  if (!errorhandler) {
    errorhandler = function(errortext) {
      //  some kind of default error handler could go here
    }
  }

  timeout = timeout || 5000;  // default timeout value in ms

  //  find an unused request

	var request = null;
	for (var i = 0; i < this.pool.length; i++) {
		if (!this.pool[i].inuse) {
			request = this.pool[i];
			break;
		}
	}	

	if (!request) return false;    // all requests in use

  request.inuse = true;
  request.pool = this;

  var ajaxTimeout = setTimeout(function() {
    request.abort;
    request.inuse = false;
    request.pool.timeouts++;
    errorhandler("timeout");
  }, timeout);

	request.onreadystatechange = function() {
		if (request.readyState==4 && request.status==200) {
      clearTimeout(ajaxTimeout);  
	    request.inuse = false;
      var u = url;
      var m = method;
      var p = payload;
	    completion(request.responseText);
		}
  }

	request.open(method, url, true);  // true is for asynchronous
	request.send(payload);
  this.requests++;

  return true;
}

//  report some statistics about the request pool

RequestPool.prototype.stats = function() {
  var stats = new Object();

  stats.requests = this.requests;
  stats.timeouts = this.timeouts;

  var outstanding = 0;
  for (var i = 0; i < this.pool.length; i++) {
    if (this.pool[i].inuse) outstanding++;
  }
  stats.outstanding = outstanding;
  
  return stats;
}
