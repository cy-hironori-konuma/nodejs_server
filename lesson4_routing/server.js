var http = require('http');
var path = require('path');

// ページ毎にルーティングを設定
var pages = [
	{route: '/', output: 'route sample'},
	{route: '/about/this', output: 'Node multi level routing!!'},
	{route: '/about/node', output: 'About Node!!'},
	{route: '/another page', output: function() {return 'This is ' + this.route;}}
];

// サーバを作成
http.createServer(function(req, res) {
	var lookup = decodeURI(req.url);
	
	pages.forEach(function(page) {
		if (page.route === lookup) {
			// ルーティングに当てはまるページがあればoutputを出力
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(typeof page.output === 'function' ? page.output() : page.output);
		}
	});

	// レスポンスが完了しているか判定
	if (!res.finished) {
		res.writeHead(404);
		res.end('Not Found!!');
	}
}).listen(80);
