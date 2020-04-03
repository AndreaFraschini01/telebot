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
            
            groups.findOne({_id: idChat}, {quotes: true}, function(err, res){
                if(err){
                    console.log(err);
                }
                else{
                    if(res){
                        let len = res.quotes.length
                        let next = len - (pagina +1)*5 > 0;
                        let index = pagina*5;
                        let numPagine = Math.ceil(len/5.0);
                        console.log({next:res.quotes.length - (pagina +1)*5, index:index});
                        callback(res.quotes.slice(index, index+5), {continues: next, numPages:numPagine});
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