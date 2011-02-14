var socket = new io.Socket(null);
var active;
var channel;
var session_id;
socket.on('connect', function(obj){
    socket.send({event: "clientConnect", data: session_id});
});
socket.on('message', function(obj){
    console.log(obj);
    if(typeof obj != 'string' && 'event' in obj) {
        $(document).trigger(obj.event, obj.data);
    }
});
socket.connect();

$(document).ready(function() {
    session_id = $.cookie('connect.sid');
    console.log(session_id);
    $(document).bind('setPlan', set_plan);
    $(document).bind('newMote', function(event, data) {
        if(data.channel===channel) {
            update_mote(data.message);
        }
    });
    $("#set-channel").submit(plan_exists);
});

/* Triggers */
function plan_exists() {
    temp_channel = $("input", this).val();
    socket.send({event: 'planExists', data: temp_channel}); 
    return false;
}

/* Events Responses */
function set_plan(event, data) {
    if(data) {
        self.channel = "plan:"+data.plan_id;
        $("#set-channel").fadeOut();
        update_mote(data.latest_mote);
    }
}

function update_mote(obj) {
    active = obj;
    script = $("<script>");
    script.attr("src", "templates/"+active.content_type+".js");
    script.attr("type", "text/javascript");
    $("head").append(script);
    $.get("templates/"+active.content_type+".html", function(template) {
        output = $.mustache(template, active);
        $("body").html(output);
        fn = window[active.content_type];
        if(typeof fn === 'function') {
            fn();
        }
    });
}

function respond(obj) {
    socket.send({event: "newResponse", data:
        {mote_id: active.pk, plan: channel, message: obj}});
}
