var Slide = function(data) {
    this.raw_html = data.data.raw_html;
};

Slide.prototype.render = function() {
    var self = this;
    $("#chart").html(self.raw_html);
};

Slide.prototype.updateData = function(responses,append) {
};

Slide.prototype.clientDisconnected = function(client) {
};
