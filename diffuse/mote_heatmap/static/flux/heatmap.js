function HeatmapRenderer(obj) {
    this.obj = obj;
    this.answer;
}

HeatmapRenderer.prototype = new ClientMoteRenderer();
HeatmapRenderer.prototype.constructor = HeatmapRenderer;

HeatmapRenderer.prototype.render = function() {
    var self = this;
    ClientMoteRenderer.prototype.render.call(this, function() {
        var clickPoint = $("<div>").addClass("click-point");
        $("#mote-heatmap").append(clickPoint);
        $("#mote-heatmap img").click(function(e) {
            var clX = e.pageX - this.offsetLeft;
            var clY = e.pageY - this.offsetTop;
            var width = $(this).width();
            clickPoint.css("left", e.pageX-15).css("top", e.pageY-15).show();
            respond({x: clX, y: clY, width: width});
            return false;
        });
    });
};    

