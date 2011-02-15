var HTML = function(data) {
    this.raw_html = data.data.raw_html;
};

HTML.prototype.render = function() {
    var self = this;
    $("#chart").html(self.raw_html);
};

HTML.prototype.update_data = function(responses) {
};
