var http = require('http');
var url = require('url');

http.createServer(function(req, res) {
	var x = url.parse(req.url);

	var options = {
		host: x.hostname,
		port: x.port || 80,
		path: x.path,
		method: req.method,
		headers: req.headers
	};

	var svrReq = http.request(options, function(svrRes) {
		res.writeHead(svrRes.statusCode, svrRes.headers);
		svrRes.pipe(res);
	});

	req.pipe(svrReq);
}).listen(8080);