$(document).ready(function() {
    function message(obj){
        var el = document.createElement('p');
        el.innerHTML = obj.message;
        console.log(obj.message);
        document.getElementById('messages').appendChild(el);
    }

    var socket = new io.Socket(null, {port: 80});
    socket.connect();
    socket.on("message", function(obj){
        console.log("message");
        update(obj.message);
    });

    function update(obj) {
        script = $("<script>");
        script.attr("src", "templates/"+obj.content_type+".js");
        script.attr("type", "text/javascript");
        $("head").append(script);
        $.get("templates/"+obj.content_type+".html", function(template) {
            output = $.tmpl(template, obj);
            $("body").html(output);
            fn = window[obj.content_type];
            if(typeof fn === 'function') {
                fn();
            }
        });
    }
});
