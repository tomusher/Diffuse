var socket = new io.Socket("flux.tomusher.com", {port: 80});
socket.on('connect', function(obj){
    socket.send({event: "clientConnected", data: "admin"});
});
socket.on('message', function(obj){
    //console.log(obj);
    $(document).trigger(obj.event, obj.data);
});
socket.connect();

var active_mote;
var active_plan="";
var renderer;

$(document).ready(function(){
    active_plan = $("#plans .active").attr("data-id");

    $(document).bind('serverPushedResponse', function(event, data) {
        var responses = {};
        responses[data.client] = data.message;
        renderer.updateData(responses, true);
    });

    $(document).bind('clientDisconnected', function(event, data) {
        renderer.clientDisconnected(data.client);
    });

    $(document).bind('serverSentResponses', function(event, data) {
        var responses = {};
        $.each(data.response, function(client, response) {
            try {
                var response = JSON.parse(response);
                responses[client] = response;
            } catch(e) {}
        });
        renderer.updateData(responses, false);
        
    });
    $('.push').click(function(){
        var url = $(this).attr('href');
        $.get(url, function(data) {
            active_mote = JSON.parse(data);
            //console.log(active_mote);
            display(active_mote);
            socket.send(
                {event: "adminRequestedResponses",
                data: {
                    mote_id: active_mote.pk,
                    plan: "plan:"+active_plan 
                 }
            });
        });
        $(this).parent().siblings().each(function() {
            $("a",this).removeClass('active');
        });
        $(this).addClass('active');
        return false;
    });
    $('.add-mote').click(function(){
        var mote_type = $('[name=mote-type] option:selected').val();
        var url = "/plans/"+active_plan+"/add/"+mote_type;
        window.location.href = url;
    });
    $("#clear").click(function() {
        clearResponses();
    });
    $('#mote-list li').hover(function() {
        $(".actions", this).fadeIn();
    }, function() {
        $(".actions", this).fadeOut();
    });

    function clearResponses() {
        socket.send({event: "adminClearedResponses", data: {plan: "plan:"+active_plan, mote_id: active_mote.pk}});
    };

    function display(active_mote) {
        if(window[active_mote.content_type]) {
            renderer = new window[active_mote.content_type](active_mote);
            renderer.render();
        }
    }
});


