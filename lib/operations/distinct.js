exports.send =  function (collection, query, options, util, req, res,db,err) {

    collection.distinct(options.fields, query, options, function(err, cursor) {
        
        res.header('Content-Type', 'application/json');
        cursor = cursor.filter(function(e){return e}); 
        res.send(cursor);
        db.close();
    });
}
