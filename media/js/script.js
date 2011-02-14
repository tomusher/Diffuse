var socket = new io.Socket("flux.tomusher.com", {port: 80});
socket.on('connect', function(obj){
    socket.send({event: "clientConnect", data: "admin"});
});
socket.on('message', function(obj){
    console.log(obj);
    $(document).trigger(obj.event, obj.data);
});
socket.connect();

var active_mote;
var chartOptions;
var chart;
$(document).ready(function(){
    $(document).bind('updateResponse', function(event, data) {
        var point = chart.get(data.message.id);
        point.update(point.y+1);
        //val = chart.series[0].data[0];
        //chart.series[0].data[0].update(val+1);
    });
    $('.push').click(function(){
        var url = $(this).attr('href');
        $.get(url, function(data) {
            active_mote = JSON.parse(data);
            console.log(active_mote);
            display(active_mote);
        });
        return false;
    });

    function display(active_mote) {
        if(active_mote.content_type=="Question") {
        chartOptions = { 
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
        $.each(active_mote.data.answers, function(no, answer) {
            chartOptions.xAxis.categories.push(answer.answer_text);
            chartOptions.series[0].data.push({y: 0, id: answer.pk});
        });
        chart = new Highcharts.Chart(chartOptions);
        }
    }
});


