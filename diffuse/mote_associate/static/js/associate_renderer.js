var AssociationGroup = function(data) {
    this.chartOptions;
    this.chart;
    this.chartData = {};
    this.segmentValue = {};
    
    this.associations = data.data.associations;
};

AssociationGroup.prototype.render = function() {
    var self = this;
    self.chartOptions = { 
        chart: {
                   renderTo: 'chart',
               },
        title: {
                   text: ''
               },
        xAxis: { 
                   title: { text: 'Answers', },
                   categories: [],
               },
        legend:{
                   enabled: false,
                },
        tooltip: {
                   formatter: function() {
                        return '<b>'+this.point.name+'</b>: '+this.y+'%';
                   }
                },
        plotOptions: {
                   pie: {
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                return '<b>'+this.point.name+'</b>: '+this.y+'%';
                            }
                         },
                    },
                 },
        series: [{
                    name: "Correct Answers",
                    type: 'pie',
                    data: []
                }]
    };

    for(var i=0; i<=self.associations.length; i++) {
        self.segmentValue[i] = 0;
        self.chartOptions.series[0].data.push({
            name: i+" Correct",
            y: 0,
            id: i,
        });
    };

    self.chart = new Highcharts.Chart(self.chartOptions);
};

AssociationGroup.prototype.redraw = function() {
    var self = this;

    for(i=0;i<self.chart.series[0].data.length;i++) {
        self.chart.series[0].data[i].y=0;
        self.segmentValue[i] = 0;
    };
    var dataCount = 0;
    for(var i in self.chartData) { dataCount++; }
    $.each(self.chartData, function(client, data) {
        self.segmentValue[data]++;
    });

    for(var val in self.segmentValue) {
        var percent;
        if(dataCount>0) {
            percent = (self.segmentValue[val]/dataCount)*100;
        } else {
            percent = 0;
            if(val==0) {
                percent = 100;
            }
        }
        var point = self.chart.get(val);
        point.update(percent);
    };
    
    self.chart.redraw();
};

AssociationGroup.prototype.updateData = function(responses, append) {
    var self = this;
    if(!append) {
        self.chartData = {};
    }
    for(var attr in responses) {
        var correctCount = 0;
        for(var key in responses[attr]) {
            if(key == responses[attr][key]) {
                correctCount++;
            };
        };
        self.chartData[attr] = correctCount;
    }
    self.redraw();
};

AssociationGroup.prototype.clientDisconnected = function(client) {
    var self = this;
    delete self.chartData[client];
    self.redraw();
};
