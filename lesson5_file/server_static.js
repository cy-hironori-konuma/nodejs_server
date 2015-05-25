var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.html': 'text/html'
};

http.createServer(function(req, res) {
	var lookup = path.basename(decodeURI(req.url)) || 'index.html';
	var f = 'content/' + lookup;

	// ファイルの有無を取得
	fs.exists(f, function(exists) {
		// ファイルの有無を判定
		if (!exists) {
			res.writeHead(404);
			res.end('Not Found.');
			return;
		}

		// ファイル読込
		fs.readFile(f, function(err, data) {
			// コンテンツ配信とエラーハンドリング
			if (err) {
				res.writeHead(500);
				res.end('Server Error.');
				return;
			}

			console.log('file: ' + f);

			var headers = {
				'Content-Type': mimeTypes[path.extname(f)]
			};

			res.writeHead(200, headers);  // ヘッダー情報付与
			res.end(data);  // コンテンツ配信
		});
	});
}).listen(80);