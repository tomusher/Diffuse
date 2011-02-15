var Question = function(data) {
    this.chartOptions;
    this.chart;
    this.chartData = {};
    
    this.answers = data.data.answers;
};

Question.prototype.render = function() {
    var self = this;
    console.log(this);
    self.chartOptions = { 
        chart: {
                   renderTo: 'chart',
                   defaultSeriesType: 'column'
               },
        title: {
                   text: ''
               },
        xAxis: { 
                   categories: [],
               },
        yAxis: {
                   title: {
                              text: 'No. of Responses',
                          },
                   tickInterval: 1
               },
        series: [{
                    name: "Answers",
                    data: []
                }]
    };
    $.each(self.answers, function(no, answer) {
        self.chartOptions.xAxis.categories.push(answer.answer_text);
        self.chartOptions.series[0].data.push({y: 0, id: answer.pk});
    });
    self.chart = new Highcharts.Chart(self.chartOptions);
};

Question.prototype.update_data = function(responses) {
    var self = this;
    for(attr in responses) {
        self.chartData[attr] = responses[attr];
    }
    for(i=0;i<self.chart.series[0].data.length;i++) {
        self.chart.series[0].data[i].y=0;
    };
    $.each(self.chartData, function(client, data) {
        var point = self.chart.get(data.id);
        point.update(point.y+1);
    });
};
