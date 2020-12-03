const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

module.exports = function (trgIp, trgPort) {
  return new Promise((resolve, reject) => {
    // [trgIp, trgPort] = '127.0.0.1:10801'.split(':');

    const MY_HOST = '0.0.0.0';
    const MY_PORT = 8005;

    let postCount = 0;
    let recvCount = 0;
    let startTimes = [];

    socket.on('message', (message, remote) => {
      startTimes[recvCount] = Date.now() - startTimes[recvCount];
      recvCount++;
    });

    try {
      socket.bind(MY_PORT, MY_HOST);
    } catch (e) {
      if (!e.code === 'ERR_SOCKET_ALREADY_BOUND') throw e;
    }

    const timer = setInterval(() => {
      const data = WatchBuffer1()
      socket.send(data, 0, data.length, trgPort, trgIp, (err, bytes) => {
        startTimes[postCount] = Date.now();
        postCount++;
        if (err) {
          reject(err);
        }
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      resolve(startTimes)
    }, 3500);


    // https://hackmd.io/@yoG90kkvSRmw42HiR0pozw/H1V3vcVTf?type=view
    const strToByte = str => str.match(/.{2}/g).map(s => parseInt(s, 16))
    function WatchBuffer1() {
      const port = trgPort.toString(16).padStart(4, '0').match(/.{2}/g)
      const ip = trgIp.split('.').map(v => Number(v).toString(16).padStart(2, '0'))
      const bytes = [['01'], ['0200'], port, ip, ['00000000'], ['00000000'], ['02'], ['00'], port, ip, ['00000000'], ['00000000'], ['0000'], ['0000']]
      return Buffer.concat(bytes.map(byte => Buffer.from(byte.map(s => strToByte(s)).flat())))
    }
  })
}