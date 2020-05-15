// Comando che risponde con un messaggio che descrive i comandi

module.exports = (bot) => {
	bot.help((ctx) => {
		ctx.replyWithMarkdown(
			"•Rispondi ad un messaggio col comando /quote per salvare la citazione per i posteri!\n\
•Utilizza il comando /list per vedere la lista delle citazioni.\n\
•Tagga un membro del gruppo dopo il comando /quotesof per visualizzare tutte le sue citazioni!\n\
⚠ASSICURATI CHE IO POSSA VEDERE I MESSAGGI⚠"
		);
	});
};
