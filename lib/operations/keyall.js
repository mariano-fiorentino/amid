exports.send =  function (collection, query, options, util, req, res, err) {

	Array.prototype.contains = function(v) {
	    for(var i = 0; i < this.length; i++) {
        	if(this[i] === v) return true;
	    }
	    return false;
	};

	Array.prototype.unique = function() {
		var arr = [];
		for(var i = 0; i < this.length; i++) {
		        if(!arr.contains(this[i])) {
	        	    	arr.push(this[i]);
	       		}
	    	}
    		return arr; 
	}

var keys=[
  "_id",
  "Ticket",
  "Application",
  "Method",
  "Scripts",
  "Request",
  "Response",
  "Error",
  "IP_ADDRESS",
  "time",
  "ticket",
  "Username",
  "Password",
  "loginname",
  "TIME_ROME",
  "brand"
];
            	//res.header('Content-Type', 'application/json');
            	res.send(keys.unique());          
  	});
}
