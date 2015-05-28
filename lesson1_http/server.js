/**
 * httpサーバをつくる
 */

// httpモジュール呼び出し
var http = require('http');

// httpサーバオブジェクトを作成
// 第1引数にrequestListener関数を設定
// req : http.IncomingMessage のインスタンス
// res : http.ServerResponse のインスタンス
http.createServer(function(req, res) {
	res.writeHead(200, {'content-type': 'text/plain'});
	res.write('サーバーできた！！');
	setTimeout(3000, function(){
		res.end();
	});
	//res.end('サーバーできた！！');
}).listen(80);  // 80番ポートでlisten

console.log('Server running at http://127.0.0.1/');