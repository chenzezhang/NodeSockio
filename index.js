
let express = require('express');
let app = express();

app.use(express.static(__dirname + '/client'));

// 监听3000端口
const server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('http://%s:%s', host, port, ',启动成功');
});

const socket = require('./socket');

socket(server);
