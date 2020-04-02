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

        let idChat = chat.id;
        let author = from.username;
        let data = new Date(1000*date);

        data = `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`

        //console.log(idChat);
        //INSERIRE NEL DATABASE SE IL GRUPPO È NUOVO
        //db.groups.update({_id: idChat}, { $push: { quotes: { text: text, author: from.username, date: date } } })
        db.inserisciCitazione(idChat, {text, author, date: data}, function(risultato){
            console.log("Cosa è qui", risultato);
            if(risultato == 0){
                ctx.replyWithMarkdown(`_${text}_\n- ${author.replace('_', ' ')} ${data}`);
            }
            else{
                ctx.reply("Il messaggio è già stato citato");
            }
        });
    }else{
        ctx.reply("Si, ma linka un messagio bro");
    }
    
});

bot.help((ctx)=>{
    ctx.reply("Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!");
});

function stampaLista(ctx, pagina){
    db.listaCitazioni(ctx.chat.id, pagina.c, function(res, next){
        let msg = "";
        if(res){
            res.forEach((cit)=>{
                msg+=`_${cit.text}_\n- ${cit.author.replace('_', ' ')} ${cit.date}\n\n`;
            });
            if(next){
                const message = ctx.replyWithMarkdown(msg, Markup.inlineKeyboard([
                    Markup.callbackButton('➡Next', 'next')
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
            }
        }
        else{
            ctx.reply("Non ci sono citazioni salvate in questa chat");
        }
    });
}

bot.launch();