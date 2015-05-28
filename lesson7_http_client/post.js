/**
 * POSTでリクエストを投げて、取得したデータをコンテンツをコンソールに表示する
 * 引数にURLを指定した場合、そのURLのコンテンツを取得する
 */

var http = require('http');

// デフォルトのリクエスト先の情報定義
var urlOptions = {
	host: 'localhost',
	path: '/',
	port: '80',
	method: 'POST'
};

var request = http.request(urlOptions, function(res) {
	res.on('data', function(chunk) {
		console.log(chunk.toString());
	}).on('error', function(err) {
		console.log('エラー : ' + err.message);
	});
});

process.argv.forEach(function(postItem, index) {
	if (index > 1) {
		request.write(postItem);
	}
});

request.end();