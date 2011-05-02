var Heatmap = function(data) {
    this.image = data.data.image;
    this.responses = {};
    this.width;
    this.height;
    this.ctx;
    this.radius1 = 10;
    this.radius2 = 20;
    this.canvas;
};

Heatmap.prototype.render = function() {
    var self = this;
    $("#renderer").html("");
    var img = $("<img>");
    img.attr("src", self.image);
    img.css("width", "100%");
    img.css("height", "auto");
    $("#renderer").append(img);
    img.load(function() {
        self.width = img.width();
        self.height = img.height();

        self.canvas = $("<canvas>").css({"position": "absolute", "top": 0, "left": 0});
        self.canvas.attr("width", self.width).attr("height", self.height);
        self.canvas.attr("id", "heatmap");
        $("#renderer").append(self.canvas);
        self.ctx = self.canvas[0].getContext("2d");
    });
};

Heatmap.prototype.redraw = function() {
    var self = this;
    self.canvas[0].width = self.canvas[0].width;
    for(response in self.responses) {
        var ratio = self.responses[response].width/self.width;
        console.log(self.responses[response].x/ratio);
        self._drawHeatSpot(self.responses[response].x/ratio, self.responses[response].y/ratio);
    };
};

Heatmap.prototype.updateData = function(responses, append) {
    var self = this;
    if(!append) {
        self.responses = {};
    };
    for(attr in responses) {
        console.log(responses[attr]);
        self.responses[attr] = responses[attr];
    };
    self.redraw();
};

Heatmap.prototype.clientDisconnected = function(client) {
    var self = this;
    delete self.responses[client];
    self.redraw();
};

/* Based on code by Patrick Wied - http://www.patrick-wied.at/static/heatmap/ */
Heatmap.prototype._drawHeatSpot = function(x,y) {
    var self = this;
    var r1 = self.radius1;
    var r2 = self.radius2;

    var rgr = self.ctx.createRadialGradient(x,y,r1,x,y,r2);
    rgr.addColorStop(0, 'rgba(0,0,0,0.3)');  
    rgr.addColorStop(1, 'rgba(0,0,0,0)');
    self.ctx.fillStyle = rgr;  
    self.ctx.fillRect(x-r2,y-r2,2*r2,2*r2);
    self._colorize(x-r2,y-r2,2*r2);
};

Heatmap.prototype._colorize = function(x,y,x2){
    var self = this;
    if(x+x2>self.width)
        x=self.width-x2;
    if(x<0)
        x=0;
    if(y<0)
        y=0;
    if(y+x2>self.height)
        y=self.height-x2;
    var image = self.ctx.getImageData(x,y,x2,x2),
        imageData = image.data,
        length = imageData.length;
    for(var i=3; i < length; i+=4){

        var r = 0,
            g = 0,
            b = 0,
            tmp = 0,
            alpha = imageData[i];

        if(alpha<=255 && alpha >= 235){
            tmp=255-alpha;
            r=255-tmp;
            g=tmp*12;
        }else if(alpha<=234 && alpha >= 200){
            tmp=234-alpha;
            r=255-(tmp*8);
            g=255;
        }else if(alpha<= 199 && alpha >= 150){
            tmp=199-alpha;
            g=255;
            b=tmp*5;
        }else if(alpha<= 149 && alpha >= 100){
            tmp=149-alpha;
            g=255-(tmp*5);
            b=255;
        }else
            b=255;
        imageData[i-3]=r;
        imageData[i-2]=g;
        imageData[i-1]=b;
    }
    image.data = imageData;
    self.ctx.putImageData(image,x,y);    
};

