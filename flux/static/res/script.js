var socket = new io.Socket(null);
var active;
var channel;
var session_id;
var loaded_scripts = [];
var mote_history = [];
socket.on('connect', function(obj){
    socket.send({event: "clientConnected", data: session_id});
});
socket.on('message', function(obj){
    if(typeof obj != 'string' && 'event' in obj) {
        $(document).trigger(obj.event, obj.data);
    }
    //console.log(obj);
});
socket.connect();

$(document).ready(function() {
    session_id = $.cookie('connect.sid');
    //console.log(session_id);
    $(document).bind('serverSetPlan', set_plan);
    $(document).bind('serverPushedMote', function(event, data) {
        if(data.channel===channel) {
            update_mote(data.message);
        }
    });
    $("#active-plan").toggle(function() {
        $("#content").fadeOut(function() {
            $("#set-plan").fadeIn();
        });
        return false;
    },function(){
        $("#set-plan").fadeOut(function() {
            $("#content").fadeIn();
        });
        return false;
    });
    $("#set-plan").submit(plan_exists);
    if(getURLParameter("access-code")!="null") {
        $("input").val(getURLParameter("access-code"));
        $("#set-plan").submit();
    }
    $("#history h2").click(function() {
        $(this).toggleClass("active");
        $("#history .status-area-content").slideToggle();
    });
});

function getURLParameter(name) {
    return unescape(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

/* Triggers */
function plan_exists() {
    temp_channel = $("input", this).val();
    socket.send({event: 'clientRequestedPlan', data: temp_channel}); 
    $("#set-plan").removeClass();
    $("#set-plan").addClass("loading");
    return false;
}

/* Events Responses */
function set_plan(event, data) {
    $("#set-plan").removeClass();
    if(data.plan_id) {
        mote_history = [];
        self.channel = "plan:"+data.plan_id;
        $("#set-plan").hide();
        update_mote(data.latest_mote);
        $("#active-plan span").html(data.plan_name);
        $("#content").fadeIn();
    } else {
        $("#set-plan").addClass('invalid-plan');
    }
}

function update_mote(obj) {
    update_history(obj);
    if(!active || active.pk != obj.pk) {
        active = obj;
        load_scripts(obj.identifier, function() {
            var renderer_name = obj.identifier.charAt(0).toUpperCase() + obj.identifier.slice(1) + "Renderer";
            var renderer = new window[renderer_name](obj);
            renderer.render();
        });
    }
}

function update_history(obj) {
    var history_list = $("#history ul");
    obj_exists = $.grep(mote_history, function(mote) {
        return mote.pk == obj.pk;
    });
    if(obj_exists.length==0) {
        mote_history.push(obj);
        history_list.html("");
        $.each(mote_history, function(index, value) {
            var li = $("<li>");
            li.html(value.name);
            li.attr("data-index", index);
            li.attr("data-pk", value.pk)
            if(value.pk==obj.pk) {
                li.addClass("active");
            }
            li.click(function() {
                var index = $(this).attr("data-index");
                update_mote(mote_history[index]);
                $("#history li").removeClass();
                $(this).addClass("active");
            });
            history_list.append(li);
        });
    } else {
        $("#history li").removeClass();
        $("li[data-pk="+obj_exists[0].pk+"]").addClass("active");
    }
}

function load_scripts(identifier, callback) {
    if(loaded_scripts.indexOf(identifier)<0) {
        var js = "/static/flux/"+identifier+".js";
        var style = "/static/flux/"+identifier+".css";
        loaded_scripts.push(identifier);
        yepnope({
            load: {'js': js, 'style': style}, 
            complete: function() { callback(); }
        });
    } else {
        callback();
    }
}

function respond(obj) {
    socket.send({event: "clientRespondedToMote", data:
        {mote_id: active.pk, plan: channel, message: obj}});
}

/* ClientMoteRenderer Class */
function ClientMoteRenderer(obj) {
    this.obj = obj;
}

ClientMoteRenderer.prototype.render = function(callback) {
    var self = this;
    $.get("/static/flux/"+self.obj.identifier+".html", function(template) {
        var output = $.mustache(template, self.obj);
        $("#content").html(output);
        callback();
    });
};
