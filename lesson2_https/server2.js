/**
 * HTTPとHTTPSサーバをつくる
 */

var http = require('http');
var https = require('https');
var fs = require('fs');

var ssl_server_key = './server_key.pem';
var ssl_server_crt = './server_crt.pem';

// httpsのオプションを設定
var options = {
	key: fs.readFileSync(ssl_server_key),
	cert: fs.readFileSync(ssl_server_crt)
};

// httpサーバオブジェクトを作成
// 第1引数にrequestListener関数を設定
// req : http.IncomingMessage のインスタンス
// res : http.ServerResponse のインスタンス
http.createServer(function(req, res) {
	res.writeHead(200, {'content-type': 'text/plain'});
	res.end('HTTPとHTTPSサーバーできた！！\nこれはHTTP');
}).listen(80);  // 80番ポートでlisten

console.log('Server running at http://127.0.0.1/');

// httpsサーバオブジェクトを作成
// 第2引数にrequestListener関数を設定
// req : https.IncomingMessage のインスタンス
// res : https.ServerResponse のインスタンス
https.createServer(options, function(req, res) {
	res.writeHead(200, {'content-type': 'text/plain'});
	res.end("HTTPとHTTPSサーバできた！！\nこれはHTTPS");
}).listen(443);  // 443ポートでlisten

console.log('Server running at https://127.0.0.1/');