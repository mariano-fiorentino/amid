var nodeExcel = require('excel-export');

exports.send =  function (collection, query, options, util, req, res,db,err) {

    collection.find(query,options ,function(err, cursor) {

        cursor.toArray( function(err, docs){
            
            if(docs==null){
                return null;
            }
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
            res.connection.setTimeout(0);
            res.end(results, 'binary');
			db.close();
        });
    });
}
