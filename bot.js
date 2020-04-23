require('dotenv').config();
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
var db = require('./database');
const bot = new Telegraf(process.env.BOT_TOKEN)
var arraydicitazioni = [];
let last_message = null;

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



bot.command('list', (ctx)=>{
    let pagina = {c: 0};
    last_message = null;

    db.listaCitazioni(ctx.chat.id, function(res){
        arraydicitazioni = res;
        stampaLista(ctx, arraydicitazioni, pagina);
    });
});

async function stampaLista(ctx, bar, page){
    let numPages = Math.ceil(bar.length/5.0); //Calcola il numero delle pagine
    let sliced = bar.slice(page.c*5, (page.c + 1)*5); //Crea la pagina
    

    let tastoNext = Markup.inlineKeyboard([
        Markup.callbackButton(`➡Next 📖${page.c+1}/${numPages}`, 'n')
    ]).extra();
    //console.log(tastoNext.reply_markup.inline_keyboard);
    //console.log(`${page.c+1}/${numPages}`);

    let msg = "";
    //Crea il messaggio con la lista delle citazioni
    sliced.forEach(cit => {
        msg+=`_${cit.text}_\n•${cit.author.replace('_', '\\_')} ${cit.date}\n\n`;
    });

    if(page.c == 0){ //Se è la prima pagina non c'è nessun messaggio da modificare
        if(page.c+1<numPages){
            last_message = await ctx.replyWithMarkdown(msg, tastoNext);
        }
        else{
            last_message = await ctx.replyWithMarkdown(msg);
            page.c = 0; //Resetta il contatore delle pagine
            arraydicitazioni = [];
        }
        
    }
    else{
        if(page.c+1<numPages){
                ctx.editMessageText(msg, 
                    { 
                        message_id: last_message.message_id,
                        parse_mode: 'Markdown', 
                        reply_markup: {inline_keyboard: tastoNext.reply_markup.inline_keyboard} 
                    });
            }
            else{
                
                ctx.editMessageText(msg, {message_id: last_message.message_id, parse_mode: 'Markdown'});
                page.c = 0; //Resetta il contatore delle pagine
                arraydicitazioni = [];
            }
    }
    
    bot.action('n', (contesto)=>{
        page.c++;
        stampaLista(contesto, arraydicitazioni, page);
    });
}

bot.help((ctx)=>{
    let helpmsg="Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!\nUtilizza il comando /list per vedere la lista delle citazioni";
    ctx.reply(helpmsg);
});

bot.launch();