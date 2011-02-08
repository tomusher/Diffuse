var socket = new io.Socket("flux.tomusher.com", {port: 80});

$(document).ready(function(){
    socket.connect();
    socket.on("message", function(obj){
        console.log(obj);
        if(obj.method=="mote_response") {
            $("#active-mote").append(obj.value); 
        }
    });
    $('.push').click(function(){
        var url = $(this).attr('href');
        $.get(url);
        return false;
    });
});
