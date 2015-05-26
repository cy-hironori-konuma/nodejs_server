var http = require('http');
var static = require('node-static');

// 公開するディレクトリとオプションを指定
// ./content ディレクトリを公開して、30秒キャッシュさせる
var file = new static.Server('./content', {cache: 30});

http.createServer(function(req, res) {
	req.on('end', function() {
		file.serve(req, res, function(err, result) {
			if (err) {
				// エラーが発生した場合
				res.writeHead(err.status, err.headers);
				res.end(err.message);
			}
		});
	}).resume();  // resumeがないとendイベントが発生しない
}).listen(80);

console.log('Server is running...');