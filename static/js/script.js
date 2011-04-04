var socket = new io.Socket("flux.tomusher.com", {port: 80});
var active_plan="";

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

    render_manager = new RenderManager();
 
    $(document).bind('serverSetPlan', function(event, data) {
        setPushedMote(data.latest_mote);
    });
    
    $(document).bind('serverPushedMote', function(event, data) {
        if("plan:"+active_plan==data.channel) {
            setPushedMote(data.message);
        }
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
                $("#plans .item-list li .actions").remove();
            } else {
                star.removeClass("enabled");
                $("#plans .item-list [data-id="+star.next().attr("data-id")+"]").remove();
            }
        });
        return false;
    });

    function setPushedMote(mote) {
        render_manager.setActive(mote);
        socket.send(
        {event: "adminRequestedResponses",
                data: {
                    mote_id: mote.pk,
                    plan: "plan:"+active_plan 
                 }
            });
        $(".mote-list li").each(function() {
            $("a", this).removeClass('active');
        });
        $(".mote-list li a[data-id="+mote.pk+"]").addClass('active');
    }

    function clearResponses() {
        socket.send({event: "adminClearedResponses", data: {plan: "plan:"+active_plan, mote_id: render_manager.active_mote.pk}});
    };

});

function RenderManager() {
    this.active_mote;
    this.renderer;

    var self = this;
    $(document).bind('serverPushedResponse', function(event, data) {
        self.newResponse(data);
    });
    $(document).bind('serverSentResponses', function(event, data) {
        self.setResponses(data);
    });
    $(document).bind('clientDisconnected', function(event, data) {
        self.clientDisconnected(data);
    });
};

RenderManager.prototype.setActive = function(mote) {
    this.active_mote = mote;
    this.display(this.active_mote);
};

RenderManager.prototype.newResponse = function(data) {
    if(this.active_mote.pk == data.mote_id) {
        var responses = {};
        responses[data.client] = data.message;
        if(this.renderer) {
            this.renderer.updateData(responses, true);
        }
    }
};

RenderManager.prototype.setResponses = function(data) {
    var responses = {};
    $.each(data.response, function(client, response) {
        try {
            var response = JSON.parse(response);
            responses[client] = response;
        } catch(e) {}
    });
    if(this.renderer) {
        this.renderer.updateData(responses, false);
    }
};

RenderManager.prototype.display = function(mote) {
    if(window[mote.content_type]) {
        this.renderer = new window[mote.content_type](mote);
        this.renderer.render();
    }
};

RenderManager.prototype.clientDisconnected = function() {
    if(this.renderer) {
        this.renderer.clientDisconnected(data.client);
    }
};
