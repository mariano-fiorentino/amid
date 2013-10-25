
	
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




d=new Date() -2;

var date = new Date();
date.setDate(date.getDate() - 1);
    
query={
       "time":{"$gte": date}
    };


docs=db.application_seach.find(query).toArray();


		var obj= docs;
		var keys = [];

		for(var k in obj){
		 var a = Object.keys(obj[k]);
		for (var i=0; i<a.length; i++) {
	    // Iterates over numeric indexes from 0 to 5, as everyone expects
			if(!keys[a[i]])
			if(a[i]!="_id")
                                        if(a[i]!="time")
						  keys.push(a[i]);
			}
		}

            	//res.header('Content-Type', 'application/json');
                var b=keys.unique();
		  print(JSON.stringify(b));
	
