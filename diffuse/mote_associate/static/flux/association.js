function AssociationRenderer(obj) { 
    this.obj = obj;
    this.pairCount = obj.data.associations.length;
    this.paper;
    this.answer = {};
}

AssociationRenderer.prototype = new ClientMoteRenderer();
AssociationRenderer.prototype.constructor = AssociationRenderer;

AssociationRenderer.prototype.render = function() {
    var self = this;

    ClientMoteRenderer.prototype.render.call(this, function() {
        $('ul').randomize('li');
        self.paper = Raphael("connections", "100%", "100%");
        self._drawCanvas();
        $(document).resize(function() {
            //self._drawCanvas();
        });
        $("svg rect").live('mousedown', function(e) {
            var rect = $(this);
            var start = $(this).data("mapped-to");
            var elX = rect.attr('x').baseVal.value;
            var elY = rect.attr('y').baseVal.value + rect.attr('height').baseVal.value/2;
            var cuX, cuY;
            var canvasWidth = $(this).parent().parent().width();
            if(elX < canvasWidth/2) {
                elX = elX + rect.attr('width').baseVal.value;
            }
            start.addClass("selected");

            var selected_list = start.parent().attr("id");
            var opposite_list = "right-side";

            if(selected_list == "right-side") {
                opposite_list = "left-side";
            }

            /*$("svg rect").bind('mouseenter mouseleave', function() {
                if($(this).data("mapped-to").parent().attr("id")==opposite_list) {
                    $(this).data("mapped-to").toggleClass("selected");
                };
                return false;
            });*/

            var path = self.paper.path(self._buildPathString(elX, elY, elX, elY));
            path.attr('stroke-width', '5px');
            
            $("#connections").bind('mousemove', function(e) {
                cuX = e.clientX-1;
                cuY = e.clientY-1;
                path.attr('path', self._buildPathString(elX, elY, cuX, cuY));
            });

            $("#connections *").mouseup(function(e) {
                $("#connections *").unbind('mouseup');
                $("svg rect").unbind('mouseenter');
                $("svg rect").unbind('mouseleave');
                $("#connections").unbind('mousemove');
                path.remove();
                $("svg rect").each(function() {
                    $(this).data("mapped-to").removeClass("selected");
                });
                elementAtPos = document.elementFromPoint(cuX, cuY);
                if($(elementAtPos).data("mapped-to")) {
                    var end = $(elementAtPos).data("mapped-to");
                    if($(end).parent().attr("id")==opposite_list) {
                        self._connectAnswers(start, end);
                    }
                };
            });
        });
    });
}

AssociationRenderer.prototype._drawCanvas = function() {
    var self = this;
    self.paper.clear();
    self.paper.setSize("100%", "100%");
    $('ul li').each(function() {
        var rect = self.paper.rect($(this).offset().left, $(this).offset().top, $(this).outerWidth(), $(this).outerHeight());
        rect.attr({
            fill: "transparent",
        });
        $(rect.node).data("mapped-to", $(this));
    });
};

AssociationRenderer.prototype._connectAnswers = function(start, end) {
    var self = this;
    if(start.offset().left < end.offset().left) {
        var left = start;
        var right = end;
    } else {
        var left = end;
        var right = start;
    };

    if($(left).data("connected-to")) {
        $(left).data("connected-to").removeData("connected-to");
        $(left).removeData("connected-to");
        $(left).data("connected-with").remove();
    };
    if($(right).data("connected-to")) {
        $(right).data("connected-to").data("connected-with").remove();
        $(right).data("connected-to").removeData("connected-to");
        $(right).removeData("connected-to");
    };

    var leftX = left.offset().left;
    var leftY = left.offset().top + left.outerHeight()/2;
    var rightX = right.offset().left;
    var rightY = right.offset().top + right.outerHeight()/2;

    var canvasWidth = $(window).width();
    if(leftX < canvasWidth/2) {
        leftX = leftX + left.outerWidth();
    }

    path = self.paper.path(self._buildPathString(leftX, leftY, rightX, rightY));
    path.attr('stroke-width', '5px');

    $(left).data("connected-to", right);
    $(right).data("connected-to", left);
    $(left).data("connected-with", path);

    self.answer = {};
    $("#left-side li").each(function() {
        if($(this).data("connected-to")) {
            self.answer[$(this).attr("data-id")] = $(this).data("connected-to").attr("data-id");
        };
    });
    console.log(self.answer);
    //self.answer[left.attr("data-id")] = right.attr("data-id");
    var answerLength = 0;
    for(i in self.answer) { answerLength++ };
    if(answerLength == self.pairCount) {
        respond(self.answer);
    };
};

AssociationRenderer.prototype._buildPathString = function(sX, sY, eX, eY) {
    return "M"+sX+" "+sY+" L"+eX+" "+eY;
};

/* Randomize function by Russ Cam -
 * http://stackoverflow.com/questions/1533910/randomize-a-sequence-of-div-elements-with-jquery/1533945#1533945
 * */
(function($) {
    $.fn.randomize = function(childElem) {
        return this.each(function() {
            var $this = $(this);
            var elems = $this.children(childElem);

            elems.sort(function() { return (Math.round(Math.random())-0.5); });  

            $this.remove(childElem);  

            for(var i=0; i < elems.length; i++)
            $this.append(elems[i]);      

        });    
    }
})(jQuery);
