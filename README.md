# Bot di telegram [PROTOTIPO]

Questo è un programma scritto in node.js per testare **telegraf.js** (che permette di creare 
bot di telegram) e per ricordarmi come funzionano GIT e *GitHub*.  

## Cosa fa per adesso il bot

Essenzialmente ti "cita" i messaggi e te li salva in un database MongoDB.

### comando /quote

Rispondendo ad un qualsiasi messaggio con questo comando
il bot salva **testo**, **nome**, **cognome**, **data** e **ora** nel database e
risponde con la citazione. È gestito il caso in cui la citazione sia già stata inserita.

### comando /list

Il bot risponde con un messaggio contenente tutta la lista delle citazioni
del gruppo/chat a pagine di 5 messaggi. In fase di ottimizzazione.

### comando /lecitdi <@username>

Il bot risponde con un messaggio contenente tutta la lista delle citazioni
di un utente appartenente al gruppo.

### comando /help

Il bot ti dice cosa può fare.

## Cosa farà

Il bot è in fase di completamento, tra non molto riscriverò
il codice per renderlo più leggibile ed inizierò lo sviluppo della web app per gestire
i file di log.
