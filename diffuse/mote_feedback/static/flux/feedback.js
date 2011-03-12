function FeedbackRenderer(obj) {
    this.obj = obj;
    this.answer;
}

FeedbackRenderer.prototype = new ClientMoteRenderer();
FeedbackRenderer.prototype.constructor = FeedbackRenderer;

FeedbackRenderer.prototype.render = function() {
    var self = this;
    ClientMoteRenderer.prototype.render.call(this, function() {
        $("#mote-feedback form input").keyup(throttle(function() {
            console.log("changed");
            respond($(this).val());
            return false;
        }, 250));
        $("#mote-feedback form").submit(function() {
            return false;
        });
    });
};    

/* Remy Sharps' function call throttling
 * http://remysharp.com/2010/07/21/throttling-function-calls/ */
function throttle(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

