
exports.send =  function (collection, query, options, util, req, res,db, err) {


//
//.count(function (e, count)


  collection.find(query).count(function (e, count) {
      console.log(count);
	res.send(""+count);
    });




/*collection.find(query, options).count(function (e, count){

		    console.log('Total matches: ' + count);
		    res.connection.setTimeout(0);
                    res.header('Content-Type', 'application/json');
                    res.send(""+count);
		    db.close(); 	
    });*/
}
