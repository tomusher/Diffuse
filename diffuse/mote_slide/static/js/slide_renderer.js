var Slide = function(data) {
    this.content = data.data.content;
};

Slide.prototype.render = function() {
    var self = this;
    $("#renderer").html(self.content);
};

Slide.prototype.updateData = function(responses,append) {
};

Slide.prototype.clientDisconnected = function(client) {
};
