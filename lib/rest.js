/* 
    rest.js
    mongodb-rest

    Created by Tom de Grunt on 2010-10-03.
    Copyright (c) 2010 Tom de Grunt.
		This file is part of mongodb-rest.
*/ 


//remember to change the require to just 'log4js' if you've npm install'ed it
var log4js = require('log4js');

var express = require('express');
var nodeExcel = require('excel-export');
var ObjectID = require('mongodb').ObjectID;

//by default the console appender is loaded
//log4js.loadAppender('console');
//you'd only need to add the console appender if you
//had previously called log4js.clearAppenders();
//log4js.addAppender(log4js.appenders.console());
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('/tmp/cheese.log'), 'cheese');

var logger = log4js.getLogger('cheese');
logger.setLevel('DEBUG');



var mongo = require("mongodb"),
    app = module.parent.exports.app,
    config = module.parent.exports.config,
    util = require("./util"),
    BSON = mongo.BSONPure;


        
/*
app.get('/Excel/:db/:collection/:id?', function(req, res){
	
console.log("Creo excel");

   var query = req.query.query ? JSON.parse(req.query.query, function (key, value) {
    var a;
    if (typeof value === 'string') {
        a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
        }
    }
    return value;
  }) : {};


 var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
        db.open(function(err,db) {
                db.authenticate(config.db.username, config.db.password, function () {

                         db.collection(req.params.collection, function(err, collection) {

			    collection.find(query, function(err, cursor) {

			        cursor.toArray(function(err, docs){
			        var result = [];
                                          
					conf ={};
				        conf.cols=[];
					var keys = Object.keys(docs[0]);

					for (a in keys) {
						conf.cols.push(  {caption:keys[a], type:'string'});
    					}
					       
            				docs.forEach(function(doc){
						var serv=[];
						for (a in keys) {
			                                serv.push(doc[keys[a]]);
                                        	}						
				            	result.push(serv);
			                });

					conf.rows=result;
					var results = nodeExcel.execute(conf);
					res.setHeader('Content-Type', 'application/vnd.openxmlformats');
					res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
					res.end(results, 'binary');

        		      });
    			    });

     			});
     		
		});
	});
});

*/


//return all db/collection
app.get('/:db?', function(req, res) {
console.log("Lista db");
	var dab = new Array();
	var max=0;
	var maxColl=0;
	var presColl=0;
	var db = new mongo.Db('admin', new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
	db.open(function(err, db) {
      		db.authenticate(config.db.username, config.db.password, function () {
        		db.executeDbCommand({'listDatabases':1}, function(err,doc) {
  	
				dat=doc.documents;
				var dab=dat[0]['databases'];
				for (var i = 0,  len = dab.length; i < len; i++) {
					var namedb = dab[i]['name'];				
					setMaxDb(dab.length-1);
		   			var db = new mongo.Db(namedb, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
		   			db.open(function(err, db){	
		   				db.authenticate(req.query.username, req.query.password, function callback(){
			 				db.collectionNames(function(err,replies) {
								 out=0;
								 replies.forEach(function(document) {                       
									if (document.name.indexOf("\.indexes") ==-1) {	
										writeBack(document.name.replace(".","/"));
									}
									if(out=== (replies.length-1)){
										setPres();
									}
									//out = out +1;
									out++;
									writeEnd();
                						});
                         				});

						});
					});
				}
	
  			});
  		});
  	});
	
	//array return	
	var ret = Array();
        //max num of db	
	function setMaxDb(num){
                max=num;
        }
        //set when end to check all collection
	function setPres(){
		presColl++;
	}

	//insert into array collection name
	function writeBack(par){
		ret.push(par);
	}

	//print all databese/collection after check all
	function writeEnd(){
		 if(presColl===max){
		    res.send(ret);	
                    //res.send(ret);
                 }
	}
	//setTimeout(function(){res.send(ret);}, 1000);

});






//return key of collection
app.get('/:db/:collection/:id?', function(req, res) {
   var query = req.query.query ? JSON.parse(req.query.query, function (key, value) {
    var a;
    if (typeof value === 'string') {
        a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
        }
    }
    return value;
  }) : {};

  // Providing an id overwrites giving a query in the URL
  if (req.params.id) {
    query = {'_id': new BSON.ObjectID(req.params.id)};
  }
  var options = req.params.options || {};

  var test = ['limit','sort','fields','skip','hint','explain','snapshot','timeout'];

  for( o in req.query ) {
    if( test.indexOf(o) >= 0 ) {
	try {
		options[o] = JSON.parse(req.query[o]);
	} catch (e) {
		options[o] = req.query[o];
	}
    } 
  }
  var operation = req.query.operation || 'find';
console.log("query " + JSON.stringify(options));

   var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
    db.open(function(err,db) {
	

        db.authenticate(config.db.username, config.db.password, function () {

             db.collection(req.params.collection, function(err, collection) {
                
                var operationModule  = require ('./operations/'+operation);
		console.log("operation!");
                operationModule.send (collection, query, options, util, req, res, db,err);
		//db.close();
            });
        });
    });
});    





    
/*
//return key of collection
app.get('/:db/:collection/key', function(req, res) {
	var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
	db.open(function(err,db) {
		db.authenticate(config.db.username, config.db.password, function () {

			 db.collection(req.params.collection, function(err, collection) {

			       var cursor = collection.find().limit(1);
				cursor.each(function(err, item) {
					if(item!=null){
						var keys = Object.keys(item);
						res.send(keys);
					}
						
				});
			});
			

		});

	});

});

app.get('/:db/:collection/distinct?', function(req, res) {
  var query = req.query.query;
  var options = req.query.options ? JSON.parse(req.query.options) : {};


  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
  db.open(function(err, db) {
    db.authenticate(config.db.username, config.db.password, function () {
      db.collection(req.params.collection, function(err, collection) {

        collection.distinct(query, options, function(err, cursor) {

              res.header('Content-Type', 'application/json');
              res.send(cursor);
        });
      });
    });
  });
});

//return total number of record by query
app.get('/:db/:collection/count/:id?', function(req, res) {


  var query = req.query.query ? JSON.parse(req.query.query, function (key, value) {
    var a;
    if (typeof value === 'string') {
        a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
        }
    }
    return value;
  }) : {};

        var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
        db.open(function(err,db) {
                db.authenticate(config.db.username, config.db.password, function () {

                         db.collection(req.params.collection, function(err, collection) {

				collection.find(query, function(err, cursor){
 
			            cursor.count(function(err, count){
		 	                	console.log('Total matches: ' + count);
						res.send(""+count);
            				});
            			});

                        });


                });

        });

});
*/
/*
app.get('/:db/:collection/:id?', function(req, res) { 

  var query = req.query.query ? JSON.parse(req.query.query, function (key, value) {
    var a;
    if (typeof value === 'string') {
        a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
        }
    }
    return value;
  }) : {};

console.log("query "+query);
  // Providing an id overwrites giving a query in the URL
  if (req.params.id) {
    query = {'_id': new BSON.ObjectID(req.params.id)};
  }
  var options = req.params.options || {};

  var test = ['limit','sort','fields','skip','hint','explain','snapshot','timeout'];

  for( o in req.query ) {
    if( test.indexOf(o) >= 0 ) {
      options[o] = req.query[o];
    } 
  }

  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
  db.open(function(err,db) {

    db.authenticate(config.db.username, config.db.password, function () {

      db.collection(req.params.collection, function(err, collection) {

        collection.find(query, options, function(err, cursor) {

          cursor.toArray(function(err, docs){
            var result = [];          
            if(req.params.id) {
              if(docs.length > 0) {
                result = util.flavorize(docs[0], "out");
                res.header('Content-Type', 'application/json');
                res.send(result);
              } else {
                res.send(404);
              }
            } else {
              docs.forEach(function(doc){
                result.push(util.flavorize(doc, "out"));
              });
              res.header('Content-Type', 'application/json');
              res.send(result);
            }
            db.close();
          });
        });
      });
    });
  });
});
*/

/**
 * Insert
 */
app.post('/:db/:collection', function(req, res) {
    console.log(req.body);
  if(req.body) {
    var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
    db.open(function(err, db) {
      db.authenticate(config.db.username, config.db.password, function () {
        db.collection(req.params.collection, function(err, collection) {
	
 	  var objectId = new ObjectID();
	  req.body._id=objectId;
	 
	  //copre bug extjs 
	  if(req.body["id"]==null)
	          delete req.body["id"];

          	// We only support inserting one document at a time
          collection.insert(Array.isArray(req.body) ? req.body[0] : req.body, function(err, docs) {
            
            res.header('Location', '/'+req.params.db+'/'+req.params.collection+'/'+docs[0]._id.toHexString());
            res.header('Content-Type', 'application/json');
            res.send('{"ok":1}', 201);
            db.close();
          });
        });
      });
    });
  } else {
    res.header('Content-Type', 'application/json');
    res.send('{"ok":0}',200);
  }
});

/**
 * Update
 */
app.put('/:db/:collection/:id', function(req, res) {
  var spec = {'_id': new BSON.ObjectID(req.params.id)};
console.log("query " + JSON.stringify(req.body));

  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
  db.open(function(err, db) {
    db.authenticate(config.db.username, config.db.password, function () {
      db.collection(req.params.collection, function(err, collection) {

         collection.update(spec, req.body, true, function(err, docs) {
console.log("query " + JSON.stringify(err));

          res.header('Content-Type', 'application/json');
          res.send('{"ok":1}');
          db.close();
        });

      });
    });
  });
});




app.put('/:db/:collection', function(req, res) {


console.log("update " + JSON.stringify(req.body));
console.log("id " + JSON.stringify(req.body._id));
  var spec = {'_id': new BSON.ObjectID(req.body._id)};
          //copre bug extjs 
          
	if(req.body["id"]==null)  
		delete req.body["id"];

	 delete req.body["_id"];

  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
  db.open(function(err, db) {
    db.authenticate(config.db.username, config.db.password, function () {
      db.collection(req.params.collection, function(err, collection) {

         collection.update(spec, req.body, true, function(err, docs) {

          res.header('Content-Type', 'application/json');
          res.send('{"ok":1}');
          db.close();
        });

      });
    });
  });
});

app.del('/:db/:collection', function(req, res) {
  var spec = {'_id': new BSON.ObjectID(req.body._id)};

  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
  db.open(function(err, db) {
    db.authenticate(config.db.username, config.db.password, function () {
      db.collection(req.params.collection, function(err, collection) {
        collection.remove(spec, function(err, docs) {
          res.header('Content-Type', 'application/json');
          res.send('{"ok":1}');
          db.close();
        });
      });
    });
  });
});
     


/**
 * Distinct
 */
/*
app.get('/:db/:collection/distinct?', function(req, res) {
  var query = req.query.query;
  var options = req.query.options ? JSON.parse(req.query.options) : {};

 	console.log(query);
    	console.log(options);
  res.header('Content-Type', 'application/json');
  res.send('{"ok":1}');

  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
  db.open(function(err, db) {
    db.authenticate(config.db.username, config.db.password, function () {
      db.collection(req.params.collection, function(err, collection) {

        collection.distinct(query, options, function(err, cursor) {

          cursor.toArray(function(err, docs){
            var result = [];          
            if(req.params.id) {
              if(docs.length > 0) {
                result = util.flavorize(docs[0], "out");
                res.header('Content-Type', 'application/json');
                res.send(result);
              } else {
                res.send(404);
              }
            } else {
              docs.forEach(function(doc){
                result.push(util.flavorize(doc, "out"));
              });
              res.header('Content-Type', 'application/json');
              res.send(result);
            }
            db.close();
          });

        });
      });
    });
  });
});
*/


/**
 * Delete
 */
app.del('/:db/:collection/:id', function(req, res) {
  var spec = {'_id': new BSON.ObjectID(req.params.id)};
 
  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
  db.open(function(err, db) {
    db.authenticate(config.db.username, config.db.password, function () {
      db.collection(req.params.collection, function(err, collection) {
        collection.remove(spec, function(err, docs) {
          res.header('Content-Type', 'application/json');
          res.send('{"ok":1}');
          db.close();
        });
      });
    });
  });
});
