var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.html': 'text/html'
};

var cache = {};

/**
 * 配信データをキャッシュさせる
 * @param  {String}   f  ファイルパス
 * @param  {Function} cb コールバック関数
 */
function cacheAndDeliver(f, cb) {
	fs.stat(f, function(err, stats) {
		// ファイルの最終更新時を取得
		var lastChanged = Date.parse(stats.ctime);
		
		// ファイルがキャッシュされている場合、ファイルの最終更新時とキャッシュ時間を比較
		var isUpdated = (cache[f]) && lastChanged > cache[f].timestamp;

		// キャッシュの有無とファイルの更新を判定
		if (!cache[f] || isUpdated) {
			// ファイルがキャッシュされていなければファイルを読み込む
			fs.readFile(f, function(err, data) {
				if (!err) {
					// キャッシュするデータとキャッシュ時のタイムスタンプを格納
					cache[f] = {content: data, timestamp: Date.now()};
				}

				// 読み込んだファイルデータを返す
				cb(err, data);
			});
			return;
		}

		console.log(f + ' をキャッシュから読み込みます。');
		// キャッシュされているファイルデータを返す
		cb(null, cache[f].content);
	});
}

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
		cacheAndDeliver(f, function(err, data) {
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