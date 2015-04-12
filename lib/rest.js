/* 
    rest.js
    amid

    Created by Tom de Grunt on 2010-10-03 in mongodb-rest
    New version Copyright (c) 2013 Mariano Fiorentino, Andrea Negro	
		This file is part of amid.
*/ 

var express = require('express');
var nodeExcel = require('excel-export');
var ObjectID = require('mongodb').ObjectID;

var mongo = require("mongodb"),
    app = module.parent.exports.app,
    config = module.parent.exports.config,
    util = require("./util"),
    BSON = mongo.BSONPure;

//return all db/collection
app.get('/db/:showCollList?', function(req, res) {
   
 
    var dab = new Array();
    var max=0;
    var maxColl=0;
    var presColl=0;
    var db = new mongo.Db('admin', new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));

    //array return  
    var ret = Array();
    db.open(function(err, db) {
        db.authenticate(config.db.username, config.db.password, function () {
            
            db.executeDbCommand({'listDatabases':1}, function(err,doc) {
    
                dat=doc.documents;
                var dab=dat[0]['databases'];

                try {
                    
                    if (req.params.showCollList == 'onlyDbList') {
                        
                        for (var i = 0; i < dab.length; i++) {

                            ret.push(dab[i]['name']);
                        }
                        res.send(ret);  
                        
                    } else if (checkExistsDb(dab, req.params.showCollList)) {
                        setMaxDb(1);
                        getCollectionList(req.params.showCollList, config);
                        
                    } else {
                        throw new Exception ('Element non present');
                    }
                } catch (e) {
                    
                    for (var i = 0; i < dab.length; i++) {

                        var namedb = dab[i]['name'];
                        setMaxDb(dab.length-1);
                        getCollectionList(namedb, config);
                    }
                }
            });
        });
    });
	
    function checkExistsDb(listDatabases, name){
        
        for (var i = 0; i < listDatabases.length; i++) {

            if  (listDatabases[i]['name'] == name) return true
        }
        return false;
    }
    
    
    function getCollectionList(namedb, config){

        var db = new mongo.Db(namedb, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
        db.open(function(err, db){
        
            db.authenticate(req.query.username, req.query.password, function callback(){
 
                db.collectionNames(function(err,replies) {
 
                    out=0;
                    replies.forEach(function(document) {
                        if (document.name.indexOf("\.indexes") == -1) {  
                            writeBack(namedb + '/'  + document.name.replace(".","/"));
                        }
                        if(out === (replies.length-1)){
                            setPres();
                        }
                        out++;
                        writeEnd();
                    });
                });
// 
            });
        });
    }
    
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
        }
	}
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

   var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
    db.open(function(err,db) {
	

        db.authenticate(config.db.username, config.db.password, function () {

             db.collection(req.params.collection, function(err, collection) {
                
                var operationModule  = require ('./operations/'+operation);
                operationModule.send (collection, query, options, util, req, res, db,err);
		//db.close();
            });
        });
    });
});    

/**
 * Insert
 */
app.post('/:db/:collection', function(req, res) {
  if(req.body) {
    var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
    db.open(function(err, db) {
      db.authenticate(config.db.username, config.db.password, function () {
        db.collection(req.params.collection, function(err, collection) {
	  //copre bug extjs 
	  if(req.body["id"]==null) {
	          delete req.body["id"];
	  }
          // We only support inserting one document at a time
          var toInsert = Array.isArray(req.body) ? req.body[0] : req.body;
	  toInsert._id = new ObjectID();
	  
          collection.insert(toInsert, function(err, docs) {
            res.header('Location', '/'+req.params.db+'/'+req.params.collection+'/'+toInsert._id.toHexString());
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



/*
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
     
 * Delete
 */
app.delete('/:db/:collection/:id', function(req, res) {
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
