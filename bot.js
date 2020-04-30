require('dotenv').config();
const Telegraf = require('telegraf');
const commandParts = require('telegraf-command-parts');
const db = require('./database');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(commandParts());

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

bot.launch();