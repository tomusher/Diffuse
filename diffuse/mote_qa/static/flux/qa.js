function QaRenderer(obj) {
    this.obj = obj;
    this.answer;
}

QaRenderer.prototype = new ClientMoteRenderer();
QaRenderer.prototype.constructor = QaRenderer;

QaRenderer.prototype.render = function() {
    var self = this;
    ClientMoteRenderer.prototype.render.call(this, function() {
        $('ul li').click(function() {
            id = $(this).attr('data-id');
            $(this).parent().children().removeClass('selected');
            $(this).addClass('selected');
            self.answer = id;
            respond(self.answer);
        });
    });
};    

