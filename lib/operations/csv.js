exports.send =  function (collection, query, options, util, req, res,db,err) {

                            collection.find(query, options, function(err, cursor) {

                                cursor.toArray( function(err, docs){

                                       var result = [];
                                       var keys = Object.keys(docs[0]);
                                      
                                       var serv=[];
                                       for (a in keys) {
                                          	serv.push(keys[a]);
                                       }
                                       result.push(serv.join(';'));                                                                        
                                       docs.forEach(function(doc){
                                           					
                                                var serv=[];
                                                for (a in keys) {
                                                        serv.push(doc[keys[a]]);
                                                }
                                                result.push(serv.join(';'));
                                       });

                                       res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                                       res.setHeader("Content-Disposition", "attachment; filename=" + "Report.csv");
                                       res.send(result.join("\n"));
                                       db.close();
                              });
                            });
}

