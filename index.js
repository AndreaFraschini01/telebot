var app = require('express')();

app.get('/', function(req, res){
    let ip = req.ip.substring(7, req.ip.length);
    res.send('Questo è il tuo indirizzo IP: ' + ip);
});

app.listen(9090, function(){
    console.log("Server listening on port 9090")
})