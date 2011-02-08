var http = require('http'),
    fs = require('fs'),
    sys = require('sys'),
    events = require('events'),
    connect = require('connect'),
    io = require('./lib/socket.io'),
    url = require('url'),
    async = require('async'),
    handler = require('./handler'),

    redis = require("./lib/node_redis"),
    redis_sub = redis.createClient(),
    redis_req = redis.createClient();


server = connect.createServer();
server.use(connect.router(templates));
server.use(connect.staticProvider({ root: __dirname+'/static', cache: false }));
server.use(connect.bodyDecoder());
server.listen('8040');

io = io.listen(server);

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

function plan_exists(client, plan_access_code) {
    async.waterfall([
        function(callback) {
            plan_access_code_key = "plan:"+plan_access_code;
            redis_req.get(plan_access_code_key, function(err, plan_id) {
                callback(null, plan_id);
            });
        },
        function(plan_id, callback) {
            plan_id_latest_key = "plan:"+plan_id+":latest_mote";
            redis_req.get(plan_id_latest_key, function(err, latest_mote_id) {
                callback(null, latest_mote_id, plan_id)
            });
        },
        function(latest_mote_id, plan_id, callback) {
            if(latest_mote_id!=null) {
                redis_req.get(latest_mote_id, function(err, latest_mote) {
                    callback(null, latest_mote, plan_id)}
                );
            } else {
                client.send({event: 'setPlan', data: null});
            }
        },
        function(latest_mote, plan_id, callback) {
            client.send({   event: 'setPlan', 
                            data: {    'plan_id': 'plan:'+plan_id, 
                                        'latest_mote': JSON.parse(latest_mote)
                            }
                        });
        }
    ]);
}

function mote_response(client, data) {
    plan_access_code = data.plan;
    mote_id = data.mote_id;
    message = data.message;
    redis_req.get(plan_access_code+":id", function(err, data) {
        plan_id = data; 
        redis_req.hset(plan_id+":"+mote_id, client.sessionId, message, redis.print);
    });
}

send404 = function(res){
   res.writeHead(404);
   res.write('404');
   res.end();
};

var handler = new handler(io, redis_sub);
handler.subscribe();
handler.on('newMote', function(channel, mote_key) {
    redis_req.get(mote_key, function(err, value){
        io.broadcast({event: 'new_mote', data: {channel: channel, message: JSON.parse(value)}});
    });
});
handler.on('planExists', function(client, data) {
    sys.puts(data);
    plan_exists(client, data);
});
io.on('connection', function(client) {
    sys.puts("New client: "+client);
    client.on('message', function(message) {
        sys.puts("Client: "+client.sessionId+" sent message: "+message);
        handler.emit(message.event, client, message.data);
    });
});
