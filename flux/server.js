var http = require('http'),
    io = require('./lib/socket.io');
    server = http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("Test");
    });

var socket = io.listen(server);

socket.on('connection', function(client) {
    client.on('message', function() {
    });
};
