global.token = process.env.token;

var http = require('http');
var finalhandler = require('finalhandler');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var actions = require('./actions');

var router = express();
router.use(bodyParser.json());

var index = '';
fs.readFile('./index.html', function(err, html) {
	if (err) {
		console.log(err);
	}
	index = html;
});

router.get('/', function(req, res, next) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(index);
	res.end();
});

router.post("/trucobot", function(req, res, next) {

    console.log(new Array(100).join('=') + '\n');

    let body = req.body;
    console.log(`Request: ${JSON.stringify(body, null, 2)}\n`);

    actions.answer(res, body);

    let ev = body.event;

    console.log(`Evento: ${JSON.stringify(ev, null, 2)}`);

    if (ev.type === "app_mention")
        actions.call('chat.postMessage', 
             'POST', 
             {
                 text: `Hi <@${ev.user}>`, 
                 channel: ev.channel, 
                 username: "Truco Bot"
            }
        );
});

var server = http.createServer(function(req, res) {
    router(req, res, finalhandler(req, res))
});

server.listen(8912, '0.0.0.0');
