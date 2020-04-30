module.exports = (bot, db)=>{
    bot.command('quote', (ctx)=>{
        if(ctx.message.reply_to_message){ //Controlla che il messaggio sia una risposta
            //Ricava le informazioni che interessano (messaggio, mittente, data e id della chat)
            let {text, from, date, chat} = ctx.message.reply_to_message;
    
            //Controlla la validità del messaggio
            if (text == undefined) {
                ctx.reply("Mi spiace, ma per adesso posso solo salvare testo 😥");
            }
            else{
                let idChat = chat.id;
                let author = from.username;
    
                //Formatta la data
                let data = new Date(1000*date);
                data = `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`;
    
                //Inserisci la citazione nel database
                db.inserisciCitazione(idChat, {text, author, date: data}, function(upserted, modified){
                    if(modified == 0 && upserted == 0){ //se non ci sono record aggiunti vuol dire che era già stata inserita
                        ctx.reply("Il messaggio è già stato citato");
                    }
                    else{
                        //Rispondi con il messaggio formattato in markdown
                        ctx.replyWithMarkdown(`_${text}_\n- ${author.replace('_', '\\_')} ${data}`);
                    }
                });
            }
        }else{
            //Gestione caso in cui il messaggio non sia una risposta oppure il bot non ha i permessi
            ctx.reply("Non ci sono");
        }
        
    });
}