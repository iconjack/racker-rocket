
// Make a remote procedure call.
//  method  is the name of the remote method
//  params  is a dictionary containing the parameters to the remote function
//  completion  is a (local) function called when the remote procedure responds
// The completion function should take a single parameter, the response.
//  A successful call will come back with a return value expected to be in JSON,
//  which we parse before calling the completion routine.
//  If there's an error getting the response, errorhandler will be called with
//  a string describing the error.

//  TODO  generalize this by letting user to set up an endpoint instead of hardcoded

function rpc(method, params, completion, errorhandler, timeout) {

    completion = completion || function() {};

    var payload = {"method": method, "params": params};
    payload = encodeURI(JSON.stringify(payload));

    var url = "/rpc";  // relative URL; see RFC 1808

    //  enhance their completion routine with JSON parsing

    var enhancedCompletion = function(response) {
        response = JSON.parse(response);
        completion(response);
    }

    var success = requestpool.sendrequest(url, "POST", payload, enhancedCompletion, errorhandler, timeout);
    if (!success) alert("remote function call failed");
}
