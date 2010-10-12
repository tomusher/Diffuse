var http = require('http'),
    fs = require('fs'),
    sys = require('sys'),
    connect = require('connect'),
    io = require('./lib/socket.io')
    url = require('url');

function templates(app) {
    app.get('/', function(req, res){
        var path = url.parse(req.url).pathname;
        fs.readFile(__dirname + path, function(err, data){
            if(err) return send404(res);
            res.writeHead(200, {'Content-Type': path == 'json.js'? 'text/javascript':'text/html'});
            res.write(data, 'utf8');
            res.end();
        });
    });
}
send404 = function(res){
   res.writeHead(404);
   res.write('404');
   res.end();
};

server = connect.createServer(
    connect.staticProvider({ root: __dirname+'/static', cache: false })
);
server.listen('8040');
var redis_sub = require("./lib/redis-client").createClient();
var redis_req = require("./lib/redis-client").createClient();

var io = io.listen(server);
io.on('connection', function(client){
    redis_sub.subscribeTo('*',
        function(channel, message, subscriptionPattern) {
            var output = "[" + channel;
            if(subscriptionPattern)
                output += " (from pattern '" + subscriptionPattern + "')";
            output += "]: " + message;
            redis_req.get(message, function(err, value){
                sys.puts(value);
                client.broadcast({message: JSON.parse(value)});
            });
        });
});

