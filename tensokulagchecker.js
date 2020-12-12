var http = require('http');
var check = require('./lagcheck');

Array.prototype.sum = function () {
  return this.reduce((v, acc) => acc + v);
};

Array.prototype.average = function () {
  const len = this.length;
  return this.sum() / len
};


// // HTTPサーバーのイベントハンドラを定義
http.createServer(async function (req, res) {

  // HTTPヘッダを出力
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });

  // レスポンスの中身を出力
  const [ip, port] = req.url.match(/ipport=(.+)/)[1].split(':');
  const lags = await check(ip, port);
  const lagMean = ('' + (lags.average() / 16.6)).substr(0, 3).padEnd(2, 0);
  res.end('' + lagMean);

}).listen(8012, '127.0.0.1');