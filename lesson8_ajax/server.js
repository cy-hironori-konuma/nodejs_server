var http = require('http');
var path = require('path');
var xml2js = require('xml2js');
var profiles = require('./profiles.js');

var mimes = {
	xml: 'applicaion/xml',
	json: 'application/json'
};

http.createServer(function(req, res) {
	var dirname = path.dirname(req.url);  // urlからディレクトリを抽出
	var extname = path.extname(req.url);  // urlから拡張子を抽出
	var basename = path.basename(req.url, extname);  // urlから最後の/以降を抽出

	// 拡張子から.を削除
	extname = extname.replace('.', '');

	if (dirname === '/profile' && basename in profiles) {
		res.writeHead(200, {'Content-Type': mimes[extname]});

		if (extname === 'xml') {
			// 拡張子がxmlの場合、オブジェクトをxmlに変換してレスポンスを返す
			var builder = new xml2js.Builder({rootName:'profile'});
			res.end(builder.buildObject(profiles[basename]));
		} else {
			// 拡張子がxml以外の場合、Json形式でレスポンスを返す
			res.end(JSON.stringify(profiles[basename]));
		}
		return;
	}

	res.writeHead(404);
	res.end('Not Found.');
}).listen(80);