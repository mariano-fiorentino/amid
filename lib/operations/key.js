exports.send =  function (collection, query, options, util, req, res, db,err) {

    var fs=require('fs');
    var pathfile=require('path').resolve(__dirname, 'cache/'+collection.collectionName+'Key');

    fs.stat(pathfile, function(err, stat) {

        if (!err) {
        
            var text = JSON.parse(require('fs').readFileSync(pathfile,'utf8'));
            res.send(text);

        } else {
            //either pull data from mongo or serve 404 error
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

            collection.find( ).toArray(function(err, items) {	
                var obj= items;
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
                res.send(keys.unique());
                db.close();
            });
        }
    });
};
  	
