// Comando che ritorna il messaggio iniziale

module.exports = (bot) => {
	bot.command("/start", (ctx) => {
		ctx.reply(
			"Ciao! Sono il bot delle citazioni. Usa il comando /help per una lista dei comandi e assicurati che io possa vedere i messaggi!"
		);
	});
};
