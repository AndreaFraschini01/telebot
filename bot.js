require('dotenv').config();
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
var db = require('./database');
const bot = new Telegraf(process.env.BOT_TOKEN)
var arraydicitazioni = [];

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

const tastoNext = Markup.inlineKeyboard([
    Markup.callbackButton('next', 'n')
]).extra()

bot.command('list', (ctx)=>{
    let pagina = {c: 0};
    db.listaCitazioni(ctx.chat.id, function(res){
        arraydicitazioni = res;
        faiCose(ctx, arraydicitazioni, pagina);
    });
});


function faiCose(ctx, bar, page){

    let numPages = Math.ceil(bar.length/5.0); //Calcola il numero delle pagine
    let sliced = bar.slice(page.c*5, (page.c + 1)*5); //Crea la pagina
    
    console.log(`${page.c+1}/${numPages}`);

    let msg = "";
    //Crea il messaggio con la lista delle citazioni
    sliced.forEach(cit => {
        msg+=`_${cit.text}_\n•${cit.author.replace('_', '\\_')} ${cit.date}\n\n`;
    });

    //Madonna che schifo sta roba, però la lascio visto che va
    try {
        if(page.c+1<numPages){
            ctx.editMessageText(msg, tastoNext);
        }
        else{
            console.log("BASTA CAZZO");
            ctx.editMessageText(msg);
            page.c = 0; //Resetta il contatore delle pagine
            arraydicitazioni = []; //Resetta il cristo.
        }
    } catch{
        if(page.c+1<numPages){
            ctx.reply(msg, tastoNext);
        }
        else{
            console.log("EIACULAZIONE PRECOCE");
            ctx.reply(msg);
            page.c = 0; //Resetta il contatore delle pagine
            arraydicitazioni = []; //Resetta il cristo.
        }
    }

    bot.action('n', (contesto)=>{
        page.c++;
        faiCose(contesto, arraydicitazioni, page);
    });
}

bot.help((ctx)=>{
    let helpmsg="Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!\nUtilizza il comando /list per vedere la lista delle citazioni";
    ctx.reply(helpmsg);
});

bot.launch();