require('dotenv').config();
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
var db = require('./database');
const bot = new Telegraf(process.env.BOT_TOKEN)


bot.command('list', (ctx)=>{
    let pagina = {c: 0};
    db.listaCitazioni(ctx.chat.id, function(res){
        if(res.length == 0){
            ctx.reply("Non ci sono citazioni salvate nella chat");
        }
        else{
            stampaLista(ctx, res, pagina)
        }
    });
})



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
            db.inserisciCitazione(idChat, {text, author, date: data}, function(modified){
                if(modified == 0){ //se non ci sono record modificati vuol dire che era già stata inserita
                    ctx.reply("Il messaggio è già stato citato");
                }
                else{
                    //Rispondi con il messaggio formattato in markdown
                    ctx.replyWithMarkdown(`_${text}_\n- ${author.replace('_', '\\_')} ${data}`);
                }
            });
        }
    }else{
        //Gestione caso in cui il messaggio non sia una risposta
        ctx.reply("Si, ma linka un messagio bro");
    }
    
});

bot.help((ctx)=>{
    let helpmsg="Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!\nUtilizza il comando /list per vedere la lista delle citazioni";
    ctx.reply(helpmsg);
});

function stampaLista(ctx, array, pagina){
    
    numPages = Math.ceil(array.length/5.0); //Calcola il numero delle pagine
    let sliced = array.slice(pagina.c*5, (pagina.c + 1)*5); //Crea la pagina

    let msg = "";

    //Crea il messaggio con la lista delle citazioni
    sliced.forEach(cit => {
        msg+=`_${cit.text}_\n•${cit.author.replace('_', '\\_')} ${cit.date}\n\n`;
    });

    if(pagina.c+1<numPages){

        //Se non sei nell'ultima pagina stampa la lista con il bottone
        const message = ctx.replyWithMarkdown(msg, Markup.inlineKeyboard([
            Markup.callbackButton(`📖Altre citazioni... (${pagina.c+ 1}/${numPages})`, 'next')
        ]).extra());

        //Quando si preme il bottone
        bot.action('next', function(ctx){
            //Cancella la pagina precedente
            ctx.deleteMessage(message.message_id);
            pagina.c++;
            stampaLista(ctx, array, pagina); //Ripeti finché non sei all'ultima pagina
        });
    }
    else{
        //Stampa l'ultima pagina senza bottone
        ctx.replyWithMarkdown(msg);
        pagina.c = 0; //Resetta il contatore delle pagine
    }
} 

bot.launch();