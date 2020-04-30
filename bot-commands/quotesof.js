module.exports = (bot, db)=>{
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
}