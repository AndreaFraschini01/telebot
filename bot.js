require('dotenv').config();
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const db = require('./database');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(commandParts());
bot.command('/start', ctx=>{
    ctx.reply("Ciao! Sono il bot delle citazioni super simpy! Ricordati di darmi i pieni poteri e i mezzi di produzione se no io i messaggi come li vedo eeeh?");
});
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

bot.command('list', (ctx)=>{
    let pagina = 0;
    db.listaCitazioni(ctx.chat.id, pagina, function(res){
        // arraydicitazioni = res;
        // stampaLista(ctx, arraydicitazioni, pagina);
        if(res){
            let message = "";

            if(res.length > 0){
                res.forEach(q => {
                    message += `_"${q.text}"_\n•${q.author.replace('_', '\\_')} ${q.date}\n\n`;
                });

                ctx.reply(message, 
                {
                    parse_mode: 'Markdown', 
                    reply_markup: {inline_keyboard: [[{text: "Altre cit ➡", callback_data:"next"}]]} 
                });
            }
            else{
                ctx.reply("Non ci sono citazioni salvate");
                pagina = 0;
            }
        }
        else{
            ctx.reply("Non ci sono citazioni salvate in questa chat");
        }
    });

    bot.action('next', ctx=>{
        pagina++;
        db.listaCitazioni(ctx.chat.id, pagina, function(res){
            // arraydicitazioni = res;
            // stampaLista(ctx, arraydicitazioni, pagina);
            let message = "";
    
            if(res.length > 0){
                res.forEach(q => {
                    message += `_"${q.text}"_\n•${q.author.replace('_', '\\_')} ${q.date}\n\n`;
                });
    
                ctx.editMessageText(message, 
                {
                    parse_mode: 'Markdown', 
                    reply_markup: {inline_keyboard: [[{text: "Altre cit ➡", callback_data:"next"}]]} 
                });
            }
            else{
                ctx.editMessageText("🛑FINE🛑");
                pagina = 0;
            }
        });
    });
});

bot.command("quotesof", ctx=>{
    let username = ctx.state.command.args.replace('@', '');
    db.citazioniUtente(ctx.chat.id, username, function(res){
        if(res){
            let msg = `_TUTTE LE PERLE DI ${username.replace('_', '\\_')}_\n`;
            if(res.length > 0){
                res.forEach(q => {
                    msg += `_"${q.text}"_\n•${q.author.replace('_', '\\_')} ${q.date}\n\n`;
                });
                ctx.replyWithMarkdown(msg);
            }
            else{
                ctx.reply(`Sembra che ${username} non abbia citazioni...`);
            }
        }
        else{
            ctx.reply("Non ci sono citazioni salvate in questa chat");
        }
    });
});

bot.help((ctx)=>{
    ctx.replyWithMarkdown(
"•Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!\n\
•Utilizza il comando /list per vedere la lista delle citazioni.\n\
•Tagga un membro del gruppo dopo il comando /quotesof per visualizzare tutte le sue citazioni!\n\
⚠ASSICURATI CHE IO POSSA VEDERE I MESSAGGI⚠");
});

bot.launch();