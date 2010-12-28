var socket = new io.Socket(null, {port: 80});

$(document).ready(function() {
    socket.connect();
    socket.on("message", function(obj){
        console.log("message");
        update(obj.message);
    });
});

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


