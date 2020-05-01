// Comando che ritorna una lista NON paginata di citazioni di un particolare utente

module.exports = (bot, db)=>{
    bot.command("quotesof", ctx=>{
        let username = ctx.state.command.args.replace('@', '');
        console.log("quotes of:",username);
        db.citazioniUtente(ctx.chat.id, username, function(res){
            if(res){
                let msg = `💥*TUTTE LE PERLE DI ${username}*💥\n\n`;
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