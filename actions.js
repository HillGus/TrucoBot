(function() {

    var request = require('request');

    module.exports.call = function(endpoint, method, body) {
        request({
            url: `https://slack.com/api/${endpoint}`,
            method: method,
            json: true,
            body: body,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${global.token}`,
                charset: 'utf-8'
            }
        })
    }
    
    
    module.exports.answer = function(res, body) {
    
        res.status(200);
        res.type('json');
    
        if (body.type === 'url_verification')
            res.json({'challenge': body.challenge});
    
        res.end();
    }
})();