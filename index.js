const fs = require('fs');
const http = require('http');
const finalhandler = require('finalhandler');
const express = require('express');
const bodyParser = require('body-parser');

const actions = require('./actions');
const utils = require('./utils');
const game = require('./game.js');

const router = express();
router.use(bodyParser.json());

global.token = process.env.token;
global.bot_name = 'Hill Bot';
const games = {};


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

    console.log(`${utils.line()}\n`);

    let body = req.body;
    let ev = body.event;
    console.log(`Request: ${JSON.stringify(body, null, 2)}\n`);
    console.log(`Evento: ${JSON.stringify(ev, null, 2)}`);

    actions.answer(res, body);


    if (ev.type === 'app_mention')
        actions.call('chat.postMessage', 
             'POST', 
             {
                 text: `Hi <@${ev.user}>`, 
                 channel: ev.channel, 
                 username: global.bot_name
            }
        );

    if (ev.type === 'message') {
        
        const message = ev.text.toLowerCase();
        const jogo = games[ev.channel];

        if (message === '.fodinha') {

            if (!jogo) {
                games[ev.channel] = new game.Game(ev.channel);
                actions.message('Uma partida de fodinha está sendo preparada...\n\n'
                                + 'Para entrar digite `.entrar`.\n'
                                + 'Para começar a partida digite `.começar`.\n',
                                ev.channel);
            } else {
                actions.message(`<@${ev.user}>, já existe uma partida de fodinha nesse canal.`, 
                                ev.channel);
            }
        }

        if (message === '.entrar') {

            if (jogo) {
                
                const added = jogo.addPlayer(ev.user);

                if (!added)
                    actions.reply('Você já está numa partida de fodinha nesse canal.', 
                                    ev.channel, 
                                    ev.ts);
                else if (added === game.ALREADY_PLAYING)
                    actions.reply('Já existe uma partida de fodinha sendo jogada nesse canal.', 
                                    ev.channel,
                                    ev.ts);
                else if (added === game.ADDED)
                    actions.reply('Você foi adicionado numa partida de fodinha nesse canal.',
                                    ev.channel,
                                    ev.ts);
                    console.log(utils.line());
            } else {
                actions.reply('Não existe nenhuma partida de fodinha sendo preparada nesse canal.', 
                                ev.channel,
                                ev.ts);
            }
        }

        if (message === '.sair') {

            if (jogo) {
                
                if (jogo.isPlaying(ev.user)) {

                    jogo.removePlayer(ev.user);
                    actions.reply('Você foi removido da partida de fodinha desse canal.',
                                ev.channel,
                                ev.ts);
                } else {

                    actions.reply('Você não está em nenhuma partida de fodinha nesse canal.',
                                ev.channel,
                                ev.ts);
                }
            } else {
                actions.reply('Não existe nenhuma partida de fodinha sendo preparada nesse canal.', 
                                ev.channel,
                                ev.ts);
            }
        }

        if (message === '.comecar') {

            if (jogo) {

                if (jogo.players().length) {

                    actions.message('Os jogadores dessa partida serão:\n'
                                + `<@${jogo.players().map(player => player.name()).join('>, <@')}>\n`
                                + 'Aguarde enquanto fazemos os ajustes finais...',
                                ev.channel);

                    jogo.start();
                    jogo.players().forEach(player => {
                        actions.ephemeral(`As suas cartas são: ${player.hand().join(', ')}`, jogo.channel(), player.name());
                    });
                } else {

                    actions.reply('A partida não começará pois ninguém entrou ainda.',
                                ev.channel,
                                ev.ts);
                }
            } else {
                actions.reply(`<@${ev.user}>, não existe nenhuma partida de fodinha sendo preparada nesse canal.`,
                                ev.channel,
                                ev.reply);
            }
        }

        if (message === '.cancelar') {

            if (jogo) {

                if (!jogo.players().length) {

                    delete games[ev.channel];
                    actions.message('A partida de fodinha desse canal foi cancelada.',
                                    ev.channel);
                } else {

                    actions.reply('A partida de fodinha desse canal não pode ser cancelada pois já possui jogadores, '
                                + 'peça para que eles digitem `.sair` e tente novamente.',
                                ev.channel,
                                ev.ts);
                }
            }
        }
    }
});

var server = http.createServer(function(req, res) {
    router(req, res, finalhandler(req, res))
});

server.listen(8912, '0.0.0.0');
