require("dotenv").config();
const Telegraf = require("telegraf");
const commandParts = require("telegraf-command-parts");
const db = require("./database");
const bot = new Telegraf(process.env.BOT_TOKEN);

var fs = require("fs");
var util = require("util");
var log_file = fs.createWriteStream("./logs/debug.log", { flags: "a" });
var log_stdout = process.stdout;

console.log = function (mess) {
	//Override di console.log per salvare su file
	const data = new Date().toLocaleString();
	const logRecord = {
		date: data,
		message: mess,
	};
	log_stdout.write(util.format(`(${data}) ${mess}`) + "\n"); //Stampa su terminale
	log_file.write(util.format(JSON.stringify(logRecord)) + ","); //Salva su file...
};

bot.use(commandParts());

const startCommand = require("./bot-commands/start");
startCommand(bot);

const quoteCommand = require("./bot-commands/quote");
quoteCommand(bot, db);

const listCommand = require("./bot-commands/list");
listCommand(bot, db);

const quotesofCommand = require("./bot-commands/quotesof");
quotesofCommand(bot, db);

const helpCommand = require("./bot-commands/help");
helpCommand(bot, db);

console.log("BOT AVVIATO ...");
bot.launch();
