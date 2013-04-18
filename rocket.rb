require 'rubygems'
require 'sinatra'
require 'json'
require 'net/http'

# This is a tiny web service in Sinatra, written as the backend for the
# "Racker Rocket" app I wrote as part of the Rackspace interview process.

#  A GET request to / serves up the home page.

get '/' do
  headers "Content-Type" => "text/html; charset=utf-8"  
  send_file File.join(settings.public_folder, 'rocket.html')
end

#  These two methods get the and put the rocket-seat occupation status
#  by querying a simle key-value pair storage service running on GAE.

BASEURL = "http://key-value-pairs.appspot.com"

def get_seat_status
  url = BASEURL + "?seatstatus"
  Net::HTTP.get URI.parse url
end

def put_seat_status(status)
  url = BASEURL + "?seatstatus=" + status
  Net::HTTP.get URI.parse url
end

#  The dispatch table for the various remote procedure calls, as a hash.
#  Method names are the keys; functions (lambdas) are the values.

dispatch_table = {

  :emptyseats => lambda {|param|
    put_seat_status "0000000000"
    "OK"
  },

  :claimseat => lambda {|params|
    seatnumber = params['seatnumber'].to_i
    status = get_seat_status
    if status[seatnumber] == '1'
      "ERROR already occupied"
    else
      status[seatnumber] = '1'
      put_seat_status status
      "OK"
    end
  },

  :unclaimseat => lambda {|params|
    seatnumber = params['seatnumber'].to_i
    status = get_seat_status
    if status[seatnumber] == '0'
      "ERROR already unoccupied"
    else
      status[seatnumber] = '0'
      put_seat_status status
      "OK"
    end
  },

  # return bitstring of seat statuses

  :seatstatus => lambda {|params|
    get_seat_status
  }
}

# dispatch a remote procedure call (rpc) based on the method name

post '/rpc' do
  headers "Content-Type" => "text/plain; charset=utf-8"

  begin
    json = JSON.parse(URI.unescape(request.body.read))
    method, params = json['method'], json['params']
    method = method.to_sym
    if dispatch_table.has_key?(method)
      routine = dispatch_table[method]
      answer = routine.call(params)
    end
  rescue
    answer = "ERROR"
  end

  answer.to_json.to_s
end
