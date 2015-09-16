exports.send =  function (collection, query, options, util, req, res,db, err) {

    collection.find(query).count(function (e, count) {
        res.send(""+count);
        db.close(); 
    });
}
