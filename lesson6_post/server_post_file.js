var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var form = fs.readFileSync('form_file.html');

var uploadDir = './uploads';

http.createServer(function(req, res) {
	if (req.method === 'GET') {
		// フォームを表示する
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(form);
	} else if (req.method === 'POST') {
		// IncomingFormインスタンスを作成
		var incoming = new formidable.IncomingForm();

		// ファイルのアップロード先を指定
		incoming.uploadDir = uploadDir;

		// ファイルを受信したタイミングで発生するfileイベント
		incoming.on('file', function(field, file) {
			if (file.size === 0) {
				return;
			}
			res.write('Received ' + file.name + '.\n');
		});

		// multipartのデータからファイルを抽出
		// input type='text' の内容がfieldsに input type='file'の内容がfilesに渡され
		incoming.parse(req, function(err, fields, files) {
			console.log(fields, files);

			if (err) {
				res.writeHead(err.status);
				res.end(err.message);
				return;
			}

			var oldPath = files.inputfile._writeStream.path;
			var newPath = uploadDir + '/' + fields.inputtext;

			// ファイル名を変更
			fs.rename(oldPath, newPath);

			res.end('Received all files.');
		});
	}
}).listen(80);