global.token = process.env.token;

var http = require('http');
var finalhandler = require('finalhandler');
var express = require('express');
var bodyParser = require('body-parser');

var actions = require('./actions');

var router = express();
router.use(bodyParser.json());

router.post("/", function(req, res, next) {

    let body = req.body;
    console.log(`Request: ${JSON.stringify(body)}`);

    actions.answer(res, body);

    let ev = body.event;

    console.log(`Evento: ${JSON.stringify(ev)}`);

    if (ev.type === "app_mention")
        actions.call('chat.postMessage', 
             'POST', 
             {
                 text: `Hi <@${ev.user}>`, 
                 channel: ev.channel, 
                 username: "Truco Bot",
                 thread_ts: ev.ts
            }
        );
});

var server = http.createServer(function(req, res) {
    router(req, res, finalhandler(req, res))
});

server.listen(3000);
