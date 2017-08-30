$(function () {
    var template = _.template($('#page-template').html()),
        $content = $('#content');

    var getData = function () {

        var schedules_url = 'https://api-ratp.pierre-grimaud.fr/v3/schedules/rers/b/laplace/A';
        var schedules_r_url = 'https://api-ratp.pierre-grimaud.fr/v3/schedules/rers/b/laplace/R';
        var traffic_url = 'https://api-ratp.pierre-grimaud.fr/v3/traffic/rers/b';

        $.when($.getJSON(schedules_url),$.getJSON(schedules_r_url), $.getJSON(traffic_url)).done(function (schedules,schedules_r,traffic) {
            var date = new Date(),
                hours = date.getHours(),
                minutes = date.getMinutes(),
                current_time = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);

            var trafficResponse = traffic[0].result,
                scheduleResponse = schedules[0].result,
                scheduleResponseInformation = scheduleResponse.schedules[0];

            var filterMessages=function filterMessages(schedule){
              return !schedule.message.match(/^Sans /);
            };

            var data = {
                traffic: trafficResponse.message,
                line: 'B',
                type: 'rer',
                horaires: scheduleResponse.schedules.filter(filterMessages),
                destination: scheduleResponseInformation.destination.split(/\. */),
                horaires_r: schedules_r[0].result.schedules.filter(filterMessages),
                destination_r: schedules_r[0].result.schedules[0].destination.split(/\. */),
                station: 'Laplace',
                current_time: current_time
            };

            $content.html(template(data));

        });
    };

    getData();
    setInterval(getData, 20000);
});
