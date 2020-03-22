require('dotenv').config();
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('quote', (ctx)=>{
    if(ctx.message.reply_to_message){
        
        let {text, from, date} = ctx.message.reply_to_message;
        let data = new Date(1000*date);
        ctx.replyWithMarkdown(`_${text}_\n- ${from.username} ${data.toLocaleDateString()} ${data.toLocaleTimeString()}`);
    }else{
        ctx.reply("Si, ma linka un messagio bro");
    }
    
});

bot.help((ctx)=>{
    ctx.reply("Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!");
});

bot.launch();