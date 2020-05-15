# Bot di telegram

Questo è un programma scritto in node.js per testare **telegraf.js** (che permette di creare
bot di telegram) e per ricordarmi come funzionano GIT e _GitHub_.

## Cosa fa per adesso il bot

Essenzialmente ti "cita" i messaggi e te li salva in un database MongoDB.

### comando /quote

Rispondendo ad un qualsiasi messaggio con questo comando
il bot salva **testo**, **nome**, **cognome**, **data** e **ora** nel database e
risponde con la citazione. È gestito il caso in cui la citazione sia già stata inserita.

### comando /list

Il bot risponde con un messaggio contenente tutta la lista delle citazioni
del gruppo/chat a pagine di 5 messaggi. In fase di ottimizzazione.

### comando /quotesof <@username>

Il bot risponde con un messaggio contenente tutta la lista delle citazioni
di un utente appartenente al gruppo.

### comando /help

Il bot ti dice cosa può fare.
