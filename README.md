Name
----

AMID - Another.js Mongo Internet Driver 

Description
-----------

Node.js REST interface for MongoDB, we modified mongodb-rest (https://github.com/tdegrunt/mongodb-rest) to manage more operation:

- counting elements 
- "distinct" operations 
- excel/csv export
- list of available db collection
- list of keys of a specific query
- Multithreading support

It's now also possible to search by date range and are managed sort operations.
On this link there is an availabe a GUI that use AMID to query data over mongo collections:

[amidGUI](https://github.com/mariano-fiorentino/amidGUI)

Installation
------------

Installation is now via npm: `npm install amid`.
After that you can just issue `amid-rest` on the command line and the server should start.

Realtime monitoring with Nagios, MongoDB and AMID Rest Interface
------------

Here is shown an example of a monitoring system that integrate Nagios, MongoDB and AMID Rest Interface, to have a realtime monitoring of both services and application logs.

Application's datas arrives on MongoDB thanks to TD-Agent that is a service that can send logs data from file directly to a Mongo instance.
Datas in Mongo collections are exposed through a rest interface with AMID.

Nagios queries services status with the NRPE client - or with ssh remote commands - installed on monitored servers, and the status of the applications with AMID, searching every minute errors in the differents Mongo collections.

The resulting status of services and applications is sent to a Grafite server to have realtime graphing on Grafana, while the collected logs are available for searching thanks to a web application (AMID GUI).

![http://www.noframeworks.com/wp-content/uploads/2015/07/Architettura_2.png](http://www.noframeworks.com/wp-content/uploads/2015/07/Architettura_2.png)

The follows is a partial  list  of the involved components: 

* [https://www.mongodb.org](https://www.mongodb.org)
* [http://docs.treasuredata.com/articles/td-agent](http://docs.treasuredata.com/articles/td-agent)
* [https://www.nagios.org](https://www.nagios.org)
* [http://www.thruk.org](http://www.thruk.org/)
* [http://graphite.wikidot.com](http://graphite.wikidot.com)
* [https://github.com/shawn-sterling/graphios](https://github.com/shawn-sterling/graphios)
* [http://grafana.org](http://grafana.org)
* [https://github.com/mariano-fiorentino/amidGUI](https://github.com/mariano-fiorentino/amidGUI)


Notes
-----

Supported REST requests:

* `GET /db/collection` - Returns all documents
* `GET /db/collection?query=%7B%22isDone%22%3A%20false%7D` - Returns all documents satisfying query
* `GET /db/collection?query=%7B%22isDone%22%3A%20false%7D&limit=2&skip=2` - Ability to add options to query (limit, skip, etc)
* `GET /db/collection/id` - Returns document with _id_
* `GET db ` - List all collection/document
* `GET /db/collection/?operation=key` - List all key of collection
* `GET /db/collection/?operation=excel&query=%7B%22isDone%22%3A%20false%7D` - export query in excel
* `GET /db/collection/?sort=[{"property":null,"direction":"ASC"}]` - Returns all document soted by ASC
* `GET /db/collection?query=%7B%22isDone%22%3A%20false%7D&operation=count` - Count elements 
* `GET /db/collection?operation=distinct&fields=Market&sort=[{"property":null,"direction":"ASC"}]` - Distinct and sort operation
* `GET /db/collection/?sort={"creationDate":-1}&skip=100&limit=100` - Example to sort by the field "creationdate", -1 is for ASC sorts, 1 means DESC sorts
* `POST /db/collection` - Insert new document in collection (document in POST body)
* `PUT /db/collection/id` - Update document with _id_ (updated document in PUT body)
* `DELETE /db/collection/id` - Delete document with _id_



Content Type:

* Please make sure `application/json` is used as Content-Type when using POST/PUT with request body's.

Dependencies:

*  "express": "~4.0.0",
*  "morgan": "~1.0.0",
*  "body-parser": "~1.0.0",
*  "method-override": "~1.0.0",
*  "mongodb": "~1.4.0",
*  "jade": "~1.9.4",
*  "log4js": "~0.6.0",
*  "excel-export": "~0.4.0"



Credits
-------

* [MongoDB Driver](http://github.com/christkv/node-mongodb-native)
* [Express](http://expressjs.com/)
* [npm](http://npmjs.org/)
* [mongodb-rest](https://github.com/tdegrunt/mongodb-rest)

Authors
------------

* Mariano Fiorentino
* Andrea Negro
