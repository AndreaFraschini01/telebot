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
                    $addToSet: { 
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
                        //callback(null);
                        console.log(err);
                    }
                    else{
                        callback(res.modifiedCount);
                    }
                    client.close();
                }
            );
        }
    });
}

//Ritorna un array e il
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
            
            groups.find({_id: idChat}).project({_id: 0, quotes: {$slice:[pagina*5, 5]}})
            .toArray(function(err, res){
                if(err){
                    console.log(err);
                }
                else{
                    if(res){
                        console.dir(res);
                        callback(res.quotes, {continues: true, numPages:5});
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