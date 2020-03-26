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
                        callback(error = err);
                    }
                    else{
                        callback(result = res);
                    }
                    client.close();
                });
        }
    });
}


exports.listaCitazioni = function(idChat, callback){
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
                        callback(res.quotes);
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