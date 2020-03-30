var mongodb = require("mongodb");

exports.inserisciCitazione = function (idChat, quote, callback){
    var mongoClient = mongodb.MongoClient(process.env.DB_URL, {useUnifiedTopology: true});
    mongoClient.connect(function(err, client){
        console.log("Inserimento citazione: collegamento...")
        if (err) {
            console.log("Impossibile connettersi al database", err);
        }
        else{
            console.log("Connessione al database stabilita");
            var db = client.db(process.env.DB_NAME);
            var groups = db.collection("groups");
            alreadyExists(quote, function(result){
                if(result==0){
                    groups.updateOne({_id: idChat}, 
                        { 
                            $push: { 
                                quotes: {
                                    text: quote.text,
                                    author: quote.author, 
                                    date: quote.date 
                                } 
                            } 
                        }, 
                        {
                            upsert: true
                        }, 
                        function(err, res){
                            if(err){
                                callback(null);
                            }
                            else{
                                callback(result);
                            }
                            client.close();
                        }
                    );
                }
                else{
                    callback(result = null);
                }
            })
        }
    });
}


exports.listaCitazioni = function(idChat, pagina, callback){
    var mongoClient = mongodb.MongoClient(process.env.DB_URL, {useUnifiedTopology: true});
    mongoClient.connect(function(err, client){
        console.log("Recupero lista citazioni...")
        if (err) {
            console.log("Impossibile connettersi al database", err);
        }
        else{
            console.log("Connessione al database stabilita");
            var db = client.db(process.env.DB_NAME);
            var groups = db.collection("groups");
            
            groups.findOne({_id: idChat}, {quotes: true}, function(err, res){
                if(err){
                    console.log(err);
                }
                else{
                    if(res){
                        let next = res.quotes.slice((pagina+1)*5, 5+(pagina+1)*5);
                        callback(res.quotes.slice(pagina*5, 5+pagina*5), next.length);
                    }
                    else{
                        callback(null);
                    }
                }
                client.close();
            });
        }
    });
}



function alreadyExists(citazione, callback){
    var mongoClient = mongodb.MongoClient(process.env.DB_URL, {useUnifiedTopology: true});

    mongoClient.connect(function(err, client){
        console.log("Controllo nuova citazione...");
        if (err) {
            console.log("Impossibile connettersi al database", err);
        }
        else{
            console.log("Connessione al database stabilita");
            var db = client.db(process.env.DB_NAME);
            var groups = db.collection("groups");
            groups.find({ quotes: { $in: [ citazione ]}}).count(function(err, res){
                if(err){
                    console.log("Errore nella query count o altro");
                    callback(null)
                }
                else{
                    console.log(res);
                    callback(res);
                }
            });

        }
    });
    // db.groups.find({ quotes: { $in: [ { text: "", author: "", date: "" } ]}}).count()
}