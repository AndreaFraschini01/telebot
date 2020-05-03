require('dotenv').config();
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const db = require('./database');
const bot = new Telegraf(process.env.BOT_TOKEN);

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('./logs/debug.log', {flags : 'a'});
var log_stdout = process.stdout;

console.log = function(d) { //Override console.log per salvare su file
    log_file.write(util.format(d) + '\n'); //Salva su file...
    log_stdout.write(util.format(d) + '\n'); //Stampa su terminale
};

bot.use(commandParts());
    //Middleware per loggare i comandi
bot.use(async (ctx, next)=>{
    try {
        await next();
    }
    catch (error) {
        let timestamp = new Date().toLocaleString();
        console.log(`(${timestamp}): ${error}`);
    }
})

const startCommand = require('./bot-commands/start');
startCommand(bot);

const quoteCommand = require('./bot-commands/quote');
quoteCommand(bot, db);

const listCommand = require('./bot-commands/list');
listCommand(bot, db);

const quotesofCommand = require('./bot-commands/quotesof');
quotesofCommand(bot, db);

const helpCommand = require('./bot-commands/help');
helpCommand(bot, db);

console.log(`(${new Date().toLocaleString()}) BOT AVVIATO ...`);
bot.launch();
