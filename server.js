<<<<<<< HEAD
/* 
=======
/*
>>>>>>> 82799d756d0733e2a14aa5e970886bdcad1e97ca
    server.js
    amid

    Created by Tom de Grunt on 2010-10-03 in mongodb-rest
<<<<<<< HEAD
    New version Copyright (c) 2013 Mariano Fiorentino, Andrea Negro	
		This file is part of amid.
*/ 
=======
    New version Copyright (c) 2013 Mariano Fiorentino, Andrea Negro
                This file is part of amid.
*/
>>>>>>> 82799d756d0733e2a14aa5e970886bdcad1e97ca
var fs = require("fs");
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
<<<<<<< HEAD
 
=======

>>>>>>> 82799d756d0733e2a14aa5e970886bdcad1e97ca

var config = { "db": {
  'port': 27017,
  'host': "localhost"
  },
  'server': {
    'port': 3000,
<<<<<<< HEAD
	'timeout': 120,
=======
        'timeout': 120,
>>>>>>> 82799d756d0733e2a14aa5e970886bdcad1e97ca
    'address': "0.0.0.0"
  },
  'flavor': "regular",
  'debug': true
};

try {
  config = JSON.parse(fs.readFileSync(process.cwd()+"/config.json"));
} catch(e) {
  // ignore
}
module.exports.config = config;
<<<<<<< HEAD

=======
>>>>>>> 82799d756d0733e2a14aa5e970886bdcad1e97ca
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('death', function(worker) {
    console.log('worker ' + worker.pid + ' died');
  });
} else {
  // Worker processes have a http server.
<<<<<<< HEAD
  
  
=======


>>>>>>> 82799d756d0733e2a14aa5e970886bdcad1e97ca
    var express = require('express');
    var bodyParser  = require('body-parser');
    var app = module.exports.app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Bind to a port
    require('./lib/main');
    require('./lib/command');
<<<<<<< HEAD
    require('./lib/rest');  
    app.listen(config.server.port, config.server.address);
    app.on('connection', function(socket) {

		socket.setTimeout(config.server.timeout * 1000);
=======
    require('./lib/rest');
    app.listen(config.server.port, config.server.address);
    app.on('connection', function(socket) {

                socket.setTimeout(config.server.timeout * 1000);
>>>>>>> 82799d756d0733e2a14aa5e970886bdcad1e97ca
    });
}
