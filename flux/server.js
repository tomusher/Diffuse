var http = require('http'),
    fs = require('fs'),
    sys = require('sys'),
    connect = require('connect'),
    io = require('./lib/socket.io')
    url = require('url');

function respond(app) {
    app.post('/', function(req, res) {
        console.log(req.body);
        res.writeHead(200, 'Content-Type text/html');
        res.end();
    });
}

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

server = connect.createServer();
server.use("/respond", connect.router(respond));
server.use(connect.router(templates));
server.use(connect.staticProvider({ root: __dirname+'/static', cache: false }));
server.use(connect.bodyDecoder());
server.listen('8040');
var redis = require("./lib/node_redis");
var redis_sub = redis.createClient();
var redis_req = redis.createClient();

var io = io.listen(server);
redis_sub.psubscribe('*');
redis_sub.on("pmessage", function(pattern, channel, message) {
    var output = "[" + channel;
    if(pattern)
        output += " (from pattern '" + pattern + "')";
    output += "]: " + message;
    redis_req.get(message, function(err, value){
        sys.puts(value);
        io.broadcast({message: JSON.parse(value)});
    });
});


io.on('connection', function(client) {
    sys.puts("New client: "+client);

    client.on('message', function(message) {
        sys.puts("Client: "+client.sessionId+" sent message: "+message);
    });
});
