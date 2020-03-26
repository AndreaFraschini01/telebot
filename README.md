# Bot di telegram [PROTOTIPO]

Questo è un programma scritto in node.js per testare **telegraf.js** (che permette di creare 
bot di telegram) e per ricordarmi come funzionano GIT e *GitHub*.  

## Cosa fa per adesso il bot

Essenzialmente ti "cita" i messaggi e te li salva in un database MongoDB.

### comando /quote

Rispondendo ad un qualsiasi messaggio con questo comando
il bot salva **testo**, **nome**, **cognome**, **data** e **ora** nel database e
risponde con la citazione (se tutto è andato per il meglio).

### comando /list

Il bot risponde con un messaggio contenente tutta la lista delle citazioni
del gruppo/chat.

### comando /help

Il bot ti dice cosa può fare. Ovviamente.

## Cosa farà

Le citazioni per adesso vengono mostrate tutte se si fa il comando /list
ma in futurò implementerò la paginazione e aggiungerò magari una funzione
di ricerca.
