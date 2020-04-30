var mongodb = require("mongodb");

//Inserisci nel DB l'id di una chat con l'array di citazioni associato (tutti i casi sono gestiti)
exports.inserisciCitazione = function (idChat, quote, callback){
    var mongoClient = mongodb.MongoClient(process.env.DB_URL, {useUnifiedTopology: true});

    mongoClient.connect(function(err, client){
        console.log("Inserimento citazione: collegamento...")

        if (err) {
            console.log("Impossibile connettersi al database", err);
        }
        else{
            console.log("Connessione al database stabilita");
            //Ricava la collection
            var db = client.db(process.env.DB_NAME);
            var groups = db.collection("groups");

            //Aggiorna solo un record
            groups.updateOne({_id: idChat}, 
                { 
                    $addToSet: {  //Tratta l'array come un insieme matematico (no duplicati)
                        quotes: {
                            text: quote.text,
                            author: quote.author, 
                            date: quote.date 
                        } 
                    } 
                }, 
                {
                    upsert: true  //Se non esiste il record, aggiungilo
                }, 
                function(err, res){
                    if(err){
                        //callback(null);
                        console.log(err);
                    }
                    else{
                        //Ritorna il numero di documenti aggiunti e il numero di record modificati
                        callback(res.upsertedCount, res.modifiedCount);
                    }
                    client.close();
                }
            );
        }
    });
}


exports.listaCitazioni = function(idChat, page, callback){
    var mongoClient = mongodb.MongoClient(process.env.DB_URL, {useUnifiedTopology: true});

    mongoClient.connect(function(err, client){
        //console.log("Recupero lista citazioni...")
        if (err) {
            //console.log("Impossibile connettersi al database", err);
        }
        else{
            //console.log("Connessione al database stabilita");

            //Ricava la collection
            var db = client.db(process.env.DB_NAME);
            var groups = db.collection("groups");
            
            //Trova un solo record.
            groups.findOne({_id: idChat}, {
                projection: { _id: false, quotes: {$slice:[page*5, 5]} }
            }, function(err, res){
                if(err){
                    console.log(err);
                }
                else{
                    if(res) callback(res.quotes);
                    else callback(null);
                }
            });
        }
    });
}


exports.citazioniUtente = function(idChat, username, callback){
    var mongoClient = mongodb.MongoClient(process.env.DB_URL, {useUnifiedTopology: true});

    mongoClient.connect(function(err, client){
        //console.log("Recupero lista citazioni...")
        if (err) {
            //console.log("Impossibile connettersi al database", err);
        }
        else{
            //console.log("Connessione al database stabilita");

            //Ricava la collection
            var db = client.db(process.env.DB_NAME);
            var groups = db.collection("groups");
            
            //Trova un solo record.
            groups.aggregate([
                {
                    $match:{
                        _id: idChat
                    }
                },
                {
                    $project: {
                        _id: 0,
                        quotes: {
                            $filter: {
                                input: '$quotes',
                                as: 'quotes',
                                cond: {$eq: ['$$quotes.author', username]}
                            }
                        }
                    }
                }
            ]).toArray(function(err, res){
                if(err){
                    callback(null);
                }
                else{
                    if(res) callback(res[0].quotes);
                    else callback(null);
                }
            });
        }
        client.close();
    });
}