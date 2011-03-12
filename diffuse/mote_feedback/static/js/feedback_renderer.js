var Feedback = function(data) {
    this.responses = data.data.responses;
    this.changed_responses = {};
    this.list;
};

Feedback.prototype.render = function() {
    var self = this;
    //console.log(this);
    $("#renderer").html("");
    self.list = $("<ul>");
    $("#renderer").append(self.list);
};

Feedback.prototype.redraw = function() {
    var self = this;
    var responses = false;
    for(var i in self.responses) { responses = true; break; }
    if(!responses) {
        self.list.html("");
    };
    for(response in self.changed_responses) {
        if(self.changed_responses[response]=="") {
            $("[data-user="+response+"]").fadeOut().remove();;
        } else {
            if($("[data-user="+response+"]").length!=0) {
                $("[data-user="+response+"]").html(self.changed_responses[response]);
            } else {
                var item = $("<li>").html(self.changed_responses[response]);
                item.attr("data-user", response);
                self.list.append(item);
            }
        }
    };
};

Feedback.prototype.updateData = function(responses, append) {
    var self = this;
    if(!append) {
        self.responses = {};
    }
    self.changed_responses = {};
    for(attr in responses) {
        self.responses[attr] = responses[attr];
        self.changed_responses[attr] = responses[attr];
    };
    self.redraw();
};

Feedback.prototype.clientDisconnected = function(client) {
    var self = this;
    delete self.responses[client];
    self.changed_responses[client] = "";
    self.redraw();
};
