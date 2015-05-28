var http = require('http');
var querystring = require('querystring');
var util = require('util');

var maxData = 1024;  // 1kb

http.createServer(function(req, res) {
	if (req.method === 'POST') {
		var postData = '';

		req.on('data', function(chunk) {
			postData += chunk;

			// バッファ制限
			if (postData.length > maxData) {
				var dataSize = postData.length;
				postData = '';
				this.pause();
				res.writeHead(413);  // 413エラー（リクエストサイズがでかい）を返す
				res.end('Too large data (' + dataSize + 'byte) is posted.');
			}
		}).on('end', function() {
			// クエリをオブジェクトに変換する
			var postDataObject = querystring.parse(postData);
			console.log(postData);
			res.end('post data : \n' + util.inspect(postDataObject));
		});
	}
}).listen(80);