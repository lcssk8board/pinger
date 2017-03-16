const Koa = require('koa');
const static = require('koa-static');
const ping = require('ping');
const path = require('path');

const sleep = ms => 
    new Promise(res => 
        setTimeout(res, ms));

const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const staticPath = path.join(__dirname, 'static');
const host = '8.8.8.8';

async function pingHost(client){
    while(true){
        await sleep(1000);
        const pong = await ping.promise.probe(host);
        const data = {
            timestamp: new Date(),
            pongTime: pong.time,
            alive: pong.alive
        };

        client.emit("pong", data);
    }
}

app.use(static(staticPath));

io.on('connection', function(client){ 
    pingHost(client);
});

server.listen(3000);