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

Installation
------------

Installation is now via npm: `npm install amid`.
After that you can just issue `amid-rest` on the command line and the server should start.

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
* `POST /db/collection` - Insert new document in collection (document in POST body)
* `PUT /db/collection/id` - Update document with _id_ (updated document in PUT body)
* `DELETE /db/collection/id` - Delete document with _id_



Content Type:

* Please make sure `application/json` is used as Content-Type when using POST/PUT with request body's.

Dependencies:

* Are all indicated in package.json. So far I indicate the lowest version with which I tested the code. Sadly this can result in non-working code when later versions are used.


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
