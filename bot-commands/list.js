// Comando che ritorna una lista paginata contenente tutte le citazioni di una chat
// NOTA: il codice contiene ripetizioni, però bot.action dà problemi con i metodi

module.exports = (bot, db)=>{
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
}