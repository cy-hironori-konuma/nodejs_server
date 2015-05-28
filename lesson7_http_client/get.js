/**
 * GETでリクエストを投げて、取得したデータをコンソールに表示する
 * 引数にURLを指定した場合、そのURLのコンテンツを取得する
 */

var http = require('http');
var url = require('url');

// デフォルトのリクエスト先の情報定義
var urlOptions = {
	host: 'www.yahoo.co.jp',
	path: '/',
	port: '80'
};

if (process.argv[2]) {
	if (!process.argv[2].match('http://')) {
		process.argv[2] = 'http://' + process.argv[2];
	}

	// url.parse(URL)が返すオブジェクトは、http.getがとる引数のオブジェクトと同じプロパティを持つ
	urlOptions = url.parse(process.argv[2]);
}

http.get(urlOptions, function(res) {
	console.log(urlOptions);
	res.on('data', function(chunk) {
		console.log(chunk.toString());
	}).on('error', function(err) {
		console.log('Error : ' + err.message);
	});
});