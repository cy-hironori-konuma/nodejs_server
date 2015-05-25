var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.html': 'text/html'
};

var cache = {
	store: {},
	maxSize: 10 * 1024 * 1024,  // キャッシュできる最大ファイルサイズ10MB（バイト単位）
	maxAge: 60 * 60 * 1000,  // キャッシュの有効期限1時間（ミリ秒単位）
	clean: function(now) {
		var that = this;  // thisをforEachで使うために退避
		Object.keys(this.store).forEach(function(file) {
			if (now > that.store[file].timestamp + that.maxAge) {
				delete that.store[file];
			}
		});
	}
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

		var headers = {
			'Content-Type': mimeTypes[path.extname(f)]
		};

		// readStreamオブジェクトを生成してストリーミングを可能にすることで、
		// ファイルのデータをメモリに全てロードしてからレスポンスを返すことを防ぐ
		// イベントハンドラを設定する
		// ただしopen, errorイベントは一度しか発生しないのでonceを使う
		var stream = fs.createReadStream(f).once('open', function(){
			// readStreamの開始時に実行される処理
			res.writeHead(200, headers);
			// stream.pipe() はストリームを可能にし、ストリームが終了するとres.end()を実行してくれる
			this.pipe(res);
		}).once('error', function() {
			// readStreamでエラーが発生した場合の処理
			console.log(e);
			res.writeHead(500);
			res.end('Server Error.');
		});

		// キャッシュさせる
		fs.stat(f, function(err, stats) {
			// 最大キャッシュサイズより小さいか判定
			if (stats.size < cache.maxSize) {
				var bufferOffset = 0;
				cache.store[f] = {
					// BufferはNode.js内でバイナリデータを扱うためのクラス
					// 扱うファイルのバッファサイズを指定してインスタンスを生成する
					content: new Buffer(stats.size),
					timestamp: Date.now()
				};

				// dataイベントは、コールバック関数にBufferインスタンス（断片データ）を返す
				// ストリームのデフォルトバッファサイズは64kb
				stream.on('data', function(data) {
					// contentのbufferOffsetバイト目から始まる位置へコピーしてキャッシュデータを足す
					data.copy(cache.store[f].content, bufferOffset);
					bufferOffset += data.length;
					console.log(f + ' : ' + bufferOffset);
				});
			}
		});
	});

	cache.clean(Date.now());
}).listen(80);
