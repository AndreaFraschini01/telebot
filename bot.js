require('dotenv').config();
const Telegraf = require('telegraf');
const TelegrafInlineMenu = require('telegraf-inline-menu')
var db = require('./database');

const mainMenu = new TelegrafInlineMenu('Main Menu');
const fooMenu = new TelegrafInlineMenu('Foo Menu');
const barMenu = new TelegrafInlineMenu('Bar Menu');
 
mainMenu.submenu('Open Foo Menu', 'foo', fooMenu);
fooMenu.submenu('Open Bar Menu', 'bar', barMenu);
barMenu.simpleButton('Premimi', 'something', {
    doFunc: (ctx)=> ctx.reply("CULO")
});

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(mainMenu.init());

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

bot.command('list', (ctx)=>{
    //console.log(ctx);
    console.log(ctx.chat.id);
    var citazioni = db.listaCitazioni(ctx.chat.id, 0,function(citazioni, next){
        let msg = "";
        if(citazioni){
            citazioni.forEach(cit => {
                msg+=`_${cit.text}_\n- ${cit.author.replace('_', ' ')} ${cit.date}\n\n`;
            });
        }
        else{
            msg = "Non ci sono citazioni salvate in questa chat";
        }
        if(next){
            msg += "PROSSIMO"
        }
        ctx.replyWithMarkdown(msg);
    });
});



bot.help((ctx)=>{
    ctx.reply("Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!");
});

bot.launch();