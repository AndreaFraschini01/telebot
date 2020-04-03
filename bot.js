require('dotenv').config();
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
var db = require('./database');
const bot = new Telegraf(process.env.BOT_TOKEN)


bot.command('list', (ctx)=>{
    let pagina = {c: 0};
    try {
        stampaLista(ctx, pagina);
    } catch (error) {
        console.log(error);
    }
})



bot.command('quote', (ctx)=>{
    if(ctx.message.reply_to_message){
        let {text, from, date, chat} = ctx.message.reply_to_message;

        if (text == undefined) {
            ctx.reply("Mi spiace, ma per adesso posso solo salvare testo 😥");
        }
        else{
            let idChat = chat.id;
            let author = from.username;
            let data = new Date(1000*date);

            data = `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`;

            db.inserisciCitazione(idChat, {text, author, date: data}, function(modified){
                if(modified == 0){
                    ctx.reply("Il messaggio è già stato citato");
                }
                else{
                    ctx.replyWithMarkdown(`_${text}_\n- ${author.replace('_', '\\_')} ${data}`);
                }
            });
        }
    }else{
        ctx.reply("Si, ma linka un messagio bro");
    }
    
});

bot.help((ctx)=>{
    let helpmsg="Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!\nUtilizza il comando /list per vedere la lista delle citazioni";
    ctx.reply(helpmsg);
});

function stampaLista(ctx, pagina){
    db.listaCitazioni(ctx.chat.id, pagina.c, function(res, next){
        let msg = "";
        if(res){
            res.forEach((cit)=>{
                msg+=`_${cit.text}_\n•${cit.author.replace('_', '\\_')} ${cit.date}\n\n`;
            });
            if(next.continues){
                const message = ctx.replyWithMarkdown(msg, Markup.inlineKeyboard([
                    Markup.callbackButton(`📖Altre citazioni... (${pagina.c+ 1}/${next.numPages})`, 'next')
                ]).extra());

                bot.action('next', (ctx)=>{
                    ctx.deleteMessage(message.message_id);
                    pagina.c++;
                    try {
                        stampaLista(ctx, pagina);
                    } catch (error) {
                        console.log(error);
                    }
                    
                })
            }
            else{
                ctx.replyWithMarkdown(msg);
                pagina.c = 0;
            }
        }
        else{
            ctx.reply("Non ci sono citazioni salvate in questa chat");
        }
    });
}

bot.launch();