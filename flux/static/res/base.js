$(document).ready(function() {
    function message(obj){
        var el = document.createElement('p');
        el.innerHTML = obj.message;
        console.log(obj.message);
        document.getElementById('messages').appendChild(el);
    }

    var socket = new io.Socket(null, {port: 80});
    socket.connect();
    socket.on('message', function(obj){
        update(obj.message);
    });

    function update(obj) {
        $.get('templates/'+obj.content_type+".html", function(template) {
            output = $.tmpl(template, obj);
            $("#messages").html(output);
        });
    }
});
