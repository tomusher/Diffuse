var socket = new io.Socket(null, {port: 8040});
var active;
var channel = "plan:1";
var call = Array();
(function( $ ){
    $.customEventHandler = function() {
        handler = {};

        socket.connect();
        socket.on('message', function(obj){
            console.log(obj);
            if('event' in obj) {
                $(handler).trigger(obj.event, obj.data);
            }
        });

        handler._trigger = function(event, data) {
            socket.send({"event" : event, "data" : data});
        }

        return handler;
    }
})( jQuery );

$(document).ready(function() {
    var customEventHandler = $.customEventHandler();
    $(customEventHandler).bind('setPlan', set_plan);
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
        self.channel = data.plan_id;
        $("#set-channel").fadeOut();
        update(data.latest_mote);
    }
}

function update(obj) {
    active = obj;
    script = $("<script>");
    script.attr("src", "templates/"+obj.content_type+".js");
    script.attr("type", "text/javascript");
    $("head").append(script);
    $.get("templates/"+obj.content_type+".html", function(template) {
        output = $.mustache(template, obj);
        $("body").html(output);
        fn = window[obj.content_type];
        if(typeof fn === 'function') {
            fn();
        }
    });
}

function respond(obj) {
    socket.send({event: "mote_response", data:
        {mote_id: active.pk, plan: channel, message: JSON.stringify(obj)}});
}
