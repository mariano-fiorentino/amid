exports.send =  function (collection, query, options, util, req, res, db,err) {
console.log(options);
    collection.find(query, options, function(err, cursor) {

        cursor.toArray(function(err, docs){
        var result = [];

        if(req.params.id) {
            
            if(docs.length > 0) {
                
                result = util.flavorize(docs[0], "out");
                res.header('Content-Type', 'application/json');
                res.send(result);
                db.close();
            } else {
                res.send(404);
                db.close();
            }
        } else {
            
            if (docs) {
                
                    docs.forEach(function(doc){
                        result.push(util.flavorize(doc, "out"));
                    });
            }
            res.connection.setTimeout(0);
            res.header('Content-Type', 'application/json');
            res.send(result);
            db.close();
        }
        });
    });
}
