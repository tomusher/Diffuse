var socket = new io.Socket(null, {port: 80});
var active;
var channel = "firstplan";
var call = Array();
$(document).ready(function() {
    socket.connect();
    socket.on("message", function(obj){
        call[obj.method](obj.value);
    });

    $("#set-channel").submit(set_channel);
});

call['new_mote'] = function(value) {
    if(value.channel == self.channel) {
        active = value.message;
        update(active);
    }
}

function set_channel() {
    temp_channel = $("input", this).val();
    socket.send({method: 'plan_exists', value: temp_channel}); 
    call['plan_exists'] = function(value) {
        if(value) {
            self.channel = temp_channel;
            $("#set-channel").fadeOut();
        }
    }
    return false;
}

function message(obj){
    var el = document.createElement('p');
    el.innerHTML = obj.message;
    console.log(obj.message);
    document.getElementById('messages').appendChild(el);
}

function update(obj) {
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
    socket.send({method: "mote_response", value: JSON.stringify(obj)});
}
