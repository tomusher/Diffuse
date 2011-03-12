var Question = function(data) {
    this.chartOptions;
    this.chart;
    this.chartData = {};
    
    this.answers = data.data.answers;
};

Question.prototype.render = function() {
    var self = this;
    //console.log(this);
    self.chartOptions = { 
        chart: {
                   renderTo: 'chart',
                   defaultSeriesType: 'column'
               },
        title: {
                   text: ''
               },
        xAxis: { 
                   title: { text: 'Answers', },
                   categories: [],
               },
        yAxis: {
                   title: { text: 'No. of Responses', },
                   tickInterval: 1
               },
        legend:{
                   enabled: false,
                },
        series: [{
                    name: "Answers",
                    data: []
                }]
    };
    $.each(self.answers, function(no, answer) {
        self.chartOptions.xAxis.categories.push(answer.answer_text);
        var colour = "#A30000";
        if(answer.correct) {
            colour = "#3E9C1F";
        };
        self.chartOptions.series[0].data.push({y: 0, id: answer.pk, color: colour, correct: answer.correct});
    });
    self.chart = new Highcharts.Chart(self.chartOptions);
};

Question.prototype.redraw = function() {
    var self = this;
    for(i=0;i<self.chart.series[0].data.length;i++) {
        self.chart.series[0].data[i].y=0;
    };
    $.each(self.chartData, function(client, data) {
        console.log(data);
        var point = self.chart.get(data);
        point.update(point.y+1);
    });
    self.chart.redraw();
};

Question.prototype.updateData = function(responses, append) {
    var self = this;
    if(!append) {
        self.chartData = {};
    }
    for(attr in responses) {
        self.chartData[attr] = responses[attr];
    }
    self.redraw();
};

Question.prototype.clientDisconnected = function(client) {
    var self = this;
    delete self.chartData[client];
    self.redraw();
};
