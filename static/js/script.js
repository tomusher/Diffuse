var socket = new io.Socket("flux.tomusher.com", {port: 80});
var active_mote;
var active_plan="";
var renderer=undefined;

$(document).ready(function(){
    active_plan = $("#plans .active").attr("data-id");
    active_plan_code = $("#plans .active").attr("data-accesscode");

    socket.on('connect', function(obj){
        socket.send({event: "clientConnected", data: "admin"});
        socket.send({event: "clientRequestedPlan", data: active_plan_code});
    });
    socket.on('message', function(obj){
        $(document).trigger(obj.event, obj.data);
        console.log(obj);
    });
    socket.connect();

    $(document).bind('serverPushedResponse', function(event, data) {
        if(active_mote.pk == data.mote_id) {
            var responses = {};
            responses[data.client] = data.message;
            if(renderer) {
                renderer.updateData(responses, true);
            }
        }
    });

    $(document).bind('clientDisconnected', function(event, data) {
        if(renderer) {
            renderer.clientDisconnected(data.client);
        }
    });

    $(document).bind('serverSentResponses', function(event, data) {
        var responses = {};
        $.each(data.response, function(client, response) {
            try {
                var response = JSON.parse(response);
                responses[client] = response;
            } catch(e) {}
        });
        if(renderer) {
            renderer.updateData(responses, false);
        }
    });

    $(document).bind('serverSetPlan', function(event, data) {
        setPushedMote(data.latest_mote);
    });

    $('.push').click(function(){
        var url = $(this).attr('href');
        $.get(url, function(data) {
            setPushedMote(data);
        });
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
    $('.item-list li').hover(function() {
        $(".actions", this).fadeIn();
    }, function() {
        $(".actions", this).fadeOut();
    });
    $(".star").click(function() {
        var star = $(this);
        var url = star.attr("href");
        $.get(url, function(data) {
            if(data.starred==true) {
                star.addClass("enabled");
                $("#plans .item-list").append(star.parent().clone());
                $("#plans .item-list li .star").remove();
            } else {
                star.removeClass("enabled");
                $("#plans .item-list [data-id="+star.next().attr("data-id")+"]").remove();
            }
        });
        return false;
    });

    function setPushedMote(active_mote) {
        display(active_mote);
        socket.send(
        {event: "adminRequestedResponses",
                data: {
                    mote_id: active_mote.pk,
                    plan: "plan:"+active_plan 
                 }
            });
        $(".mote-list li").each(function() {
            $("a", this).removeClass('active');
        });
        $(".mote-list li a[data-id="+active_mote.pk+"]").addClass('active');
    }

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


