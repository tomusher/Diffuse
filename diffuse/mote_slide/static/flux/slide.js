function SlideRenderer(obj) {
    this.obj = obj;
}

SlideRenderer.prototype = new ClientMoteRenderer();
SlideRenderer.prototype.constructor = SlideRenderer;

SlideRenderer.prototype.render = function() {
    var self = this;
    ClientMoteRenderer.prototype.render.call(this, function() {
    });
};    

