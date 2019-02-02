(function() {

    var request = require('request');

    module.exports.call = function(endpoint, method, body) {
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
	  console.log('\n' + new Array(100).join('=') + '\n');
	});
    }
    
    
    module.exports.answer = function(res, body) {
    
        res.status(200);
        res.type('json');
    
        if (body.type === 'url_verification')
            res.json({'challenge': body.challenge});
    
        res.end();
    }
})();