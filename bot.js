require('dotenv').config();
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('text', (ctx)=>{
    ctx.reply('Ma salve! al momento non sono ancora programmato ma tra non molto lo sarò!')
});

bot.launch();