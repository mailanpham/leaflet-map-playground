(function(){

    var fetchHubData = $.get(config.hubAPI);
    var fetchOrdersData = $.get(config.orderAPI);
        // do something with your data

    $.when(fetchHubData, fetchOrdersData).done(function(hubResponse, orderResponse){
        var hubs = $.parseJSON(hubResponse[0]);
        var orders = $.parseJSON(orderResponse[0]);

        var center = config.center;

        LeafMap.init(center, hubs, orders);
        renderHubTemplate(hubs);
        bindEvents(hubs, orders);
    });

    function renderHubTemplate(hubs) {
        var source = $("#hub-template").html();
        var template = Handlebars.compile(source);
        var data = hubs;
        $("#hub-placeholder").html(template(data));
    }

    function bindEvents(hubs, orders){
        $('.datepicker').pickadate({});
        $('.timepicker').timepicker({ 'timeFormat': 'H:i:s' });

        //Ability to toggle "All Hub" Checkboxes on and off
        $("#check-all-hubs").change(function () {
            $("input:checkbox.hub-checks").prop('checked', $(this).prop("checked"));
        });

        //Add Layers to Map with Filter Rules Considered
        $('#filter-all-combo').click(function() {

            var checkedHubs = utils.getCheckedElements(document.getElementById("hub-placeholder"));
            var dateRange = utils.getDateRange($('#start-date'),$('#end-date'));
            var timeOfDay = utils.getTimeRange($('#start-time'),$('#end-time'));
            var deliveryTime = utils.getValueRange($('#delivery-time-start'),$('#deliver-time-end'));
            var numberItems = utils.getValueRange($('#number-items-start'),$('#number-items-end'));

            var filters = {
              "dateRange" : dateRange,
              "timeOfDay" : timeOfDay,
              "deliveryTime": deliveryTime,
              "numberItems": numberItems
            }

            LeafMap.removeLayers();
            LeafMap.addFilteredMarkers(hubs, orders, checkedHubs, filters);

        });

        //Add Driver Route Layers with Filter Rules Considered - enabled animation via animated-markers.js
        $('#start-animation').click(function() {
            var checkedHubs = utils.getCheckedElements(document.getElementById("hub-placeholder"));
            var dateRange = utils.getDateRange($('#start-date'),$('#end-date'));
            var timeOfDay = utils.getTimeRange($('#start-time'),$('#end-time'));
            var deliveryTime = utils.getValueRange($('#delivery-time-start'),$('#deliver-time-end'));
            var numberItems = utils.getValueRange($('#number-items-start'),$('#number-items-end'));

            var filters = {
                "dateRange" : dateRange,
                "timeOfDay" : timeOfDay,
                "deliveryTime": deliveryTime,
                "numberItems": numberItems
            }

            LeafMap.removeLayers();
            LeafMap.animateDriverMarkers(hubs, orders, checkedHubs, filters);
        });
    }

}());