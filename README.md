# Test bot di telegram e repository remota

Questo è un programma scritto in node.js per testare i **bot di telegram**, ricordarmi
come si scrive in **markdown** un file readme e come funziona *github*.  
Mi piace veramente tanto la semplicità con cui si riesce a scrivere un file di testo con markdown

## Cosa fa per adesso

Essenzialmente ti "cita" i messaggi. Rispondendo ad un qualsiasi messaggio con il comando /quote
il bot invierà una citazione con tanto di autore, data e orario.
Per adesso le citazioni non vengono salvate.

## Cosa farà

Le citazioni saranno salvate in un DB di MongoDB e sarà quindi necessario salvare
una lista di citazioni per ogni gruppo e chat. Non so ancora come implementare questa cosa
ma non dovrebbe essere difficile.
