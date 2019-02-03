const request = require('request');
const utils = require('./utils');

const call = function(endpoint, method, body) {
    request({
        url: `https://slack.com/api/${endpoint}`,
        method: method,
        json: true,
        body: body,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${global.token}`
        }
    }, function (error, response, body) {
        console.log('\nSlack response: \n');
        console.log('error:', error); 
        console.log('statusCode:', response && response.statusCode); 
        console.log('body:', body); 
        console.log(`\n${utils.line()}\n`);
    });
}

const message = function(text, channel) {

    call('chat.postMessage',
        'POST',
        {
            text: text,
            channel: channel,
            username: global.bot_name
        }
    );
}

const ephemeral = function(text, channel, user) {

    call('chat.postEphemeral',
        'POST',
        {
            text: text,
            channel: channel,
            user: user,
            username: global.bot_name
        }
    );
}

const reply = function(text, channel, thread_ts) {

    call('chat.postMessage',
        'POST',
        {
            text: text,
            channel: channel,
            thread_ts: thread_ts,
            username: global.bot_name
        }
    );
}


const answer = function(res, body) {

    res.status(200);
    res.type('json');

    if (body.type === 'url_verification')
        res.json({'challenge': body.challenge});

    res.end();
}

module.exports = {
    call: call,
    message: message,
    answer: answer,
    ephemeral: ephemeral,
    reply: reply
}