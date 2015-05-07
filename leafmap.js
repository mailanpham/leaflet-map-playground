var LeafMap =  {
    init: function(center, hubs, orders) {
        this.map = L.map('map').setView(center, 13);
        this.hubLayers = [];
        this.ordersByHub = [];

        //Different types layers that are constantly removed and redrawn on the map
        this.ordersFilterLayers = [];
        this.hubFilterLayers = [];
        this.animatedMarkers = [];
        this.addTileLayers(hubs, orders);
    },

    addTileLayers: function(hubs, orders) {
        var hubLayers = this.hubLayers;
        var overlays = {};

        for (var i=0; i < hubs.features.length; i++){
            hubLayers[i] = new L.LayerGroup();
            this.addHubMarkers(hubs.features[i], hubLayers[i]);
        }

        // sort all orders by hub id, this is stored in this.ordersByHub and can be reused throughout our application
        this.ordersByHub = this.sortOrdersByHub(orders, hubLayers);
        for (var i=0; i < hubLayers.length; i++){
            var ordersFormatted = {
                "type": "FeatureCollection",
                "features": this.ordersByHub[i]
            }
            this.addOrderMarkers(ordersFormatted, hubLayers[i], (i+1));
        }

        var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

        var grayscale   = L.tileLayer(mbUrl, {id: 'examples.map-20v6611k', attribution: mbAttr}),
            streets  = L.tileLayer(mbUrl, {id: 'examples.map-i875mjb7',   attribution: mbAttr});

        //Initialize map to Grayscale Layer
        this.map.addLayer(grayscale);

        var baseLayers = {
            "Grayscale": grayscale,
            "Streets": streets
        };

        for (var i=0; i < hubLayers.length; i++){
            overlays["Hub "+(i+1)] = hubLayers[i];
        }

        L.control.layers(baseLayers, overlays).addTo(this.map);

    },

    addHubMarkers: function(hub, layer, deletableLayer) {
        var layer = layer ? layer : this.map;
        var grouped = {};
        grouped.data = L.geoJson([hub], {

            style: function (feature) {
                return feature.properties && feature.properties.style;
            },

            onEachFeature: this.onEachHubFeature,

            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: L.AwesomeMarkers.icon({
                        icon: 'leaf', prefix: 'fa', markerColor: aweColor[feature.properties.id]
                    })
                });
            }
        }).addTo(layer);
        grouped.layer = layer;
        if (deletableLayer) {
            this.hubFilterLayers[this.hubFilterLayers.length] = grouped;
        }
    },

    addOrderMarkers: function(orders, layer) {
        var layer = layer ? layer : this.map;
        var grouped = {};
        grouped.data = L.geoJson([orders], {

            style: function (feature) {
                return feature.properties && feature.properties.style;
            },

            onEachFeature: this.onEachOrderFeature,

            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: orderColor[feature.properties.hub_id],
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(layer);

        grouped.layer = layer;
        this.ordersFilterLayers[this.ordersFilterLayers.length] = grouped;
    },

    sortOrdersByHub: function(orders, hubLayers) {
        var ordersArr = [];
        for (var i=0; i < hubLayers.length; i++) {
            var sortedFeatures = [];
            var hubId = 1 + i;
            for (key in orders.features) {
                if (orders.features[key].properties.hub_id == hubId) {
                    sortedFeatures.push(orders.features[key]);
                }
            }
            ordersArr[i] = sortedFeatures;
        }
        return ordersArr;
    },

    removeLayers: function() {
        //remove all hub layers (markers)
        for (var i=0; i < this.hubLayers.length; i++){
            this.map.removeLayer(this.hubLayers[i]);
        }

        //remove all orders markers
        for (var i=0; i < this.ordersFilterLayers.length; i++) {
            this.ordersFilterLayers[i].layer.removeLayer(this.ordersFilterLayers[i].data);
        }
        this.ordersFilterLayers = [];

        for (var i=0; i < this.hubFilterLayers.length; i++) {
            this.hubFilterLayers[i].layer.removeLayer(this.hubFilterLayers[i].data);
        }
        this.hubFilterLayers = [];

        for (var i=0; i < this.animatedMarkers.length; i++) {
            this.map.removeLayer(this.animatedMarkers[i]);
        }
        this.animatedMarkers = [];

    },

    addFilteredMarkers: function(hubs, orders, checkedHubs, filters) {

        //only want to go through hubs that are checked
        for (var i=0; i < checkedHubs.length; i++){

            var hubId = parseInt(checkedHubs[i]);
            var orderFromHub = this.ordersByHub[hubId];

            // add corresponding hub id marker to map
            this.addHubMarkers(hubs.features[hubId], this.map, true);

            //with the orders from hub i, find the orders that satisfy the constraints
            var sortedOrders = [];
            for (var j=0; j < orderFromHub.length; j++) {
                var constraintsMet = this.checkAllConstraints(orderFromHub[j], filters);
                if (constraintsMet) {
                    sortedOrders.push(orderFromHub[j]);
                }
            }

            var ordersGeoFormatted = {
                "type": "FeatureCollection",
                "features": sortedOrders
            }

            this.addOrderMarkers(ordersGeoFormatted, this.map);
        }

    },

    // TO-DO UPDATE! warning: animation assumptions that should be corrected.
    // this function assumes that the data passed in from the json is in chronological order
    animateDriverMarkers: function(hubs, orders, checkedHubs, filters) {
        var driverRoutes = {};
        var driverHubMap = {};
        var routeLines = [];
        var routeLineHubMap = [];

        //only want to go through hubs that are checked
        for (var i=0; i < checkedHubs.length; i++){

            var hubId = parseInt(checkedHubs[i]);
            var orderFromHub = this.ordersByHub[hubId];

            // add corresponding hub id marker to map
            this.addHubMarkers(hubs.features[hubId], this.map, true);

            //with the orders from hub i, find the orders that satisfy the constraints
            for (var j=0; j < orderFromHub.length; j++) {
                var constraintsMet = this.checkAllConstraints(orderFromHub[j], filters);
                if (constraintsMet) {

                    //If all the constraints are met for the order,
                    // find the driver id of the order and all to the list of route points the driver made
                   var driverId = orderFromHub[j].properties.driver_id;
                   var LatLang = [orderFromHub[j].geometry.coordinates[1],orderFromHub[j].geometry.coordinates[0]];

                    if (driverRoutes.hasOwnProperty(driverId)){
                        driverRoutes[driverId].push(LatLang);
                    }else {
                        driverRoutes[driverId] = [LatLang];
                        driverHubMap[driverId] = hubId;
                    }
                }
            }
        }

        //for each driver, draw a routeLine that is a polyline of points the driver made throughout time
        for (var key in driverRoutes) {
            routeLines.push(L.polyline(driverRoutes[key]));
            routeLineHubMap.push(driverHubMap[key]);
        }

        // for each routeline (each driver), add the marker point to the map, color of icon is determined by a helper
        // then, add the new marker to the list of animated markers (this.animatedMarkers)
        for (var i=0; i <  routeLines.length; i++) {
            var color = aweColor[routeLineHubMap[i]+1];
            var dotIcon = L.AwesomeMarkers.icon({icon: 'bicycle ', prefix: 'fa', markerColor: color});

            var marker = L.animatedMarker(routeLines[i].getLatLngs(), {
                icon: dotIcon,
                autoStart: false,
                onEnd: function() {
                }
            });

            this.map.addLayer(marker);
            this.animatedMarkers.push(marker);
        }

        //start animation on each animated marker!
        $.each(this.animatedMarkers, function(i, marker) {
            marker.start();
        });

    },

    onEachHubFeature: function (feature, layer) {
        var popupContent = "<p>Hub ID:  " +
            feature.properties.id + "</p>";

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    },

    onEachOrderFeature: function(feature, layer) {
        var popupContent = "<p> id:" +
            feature.properties.id + "</p>"
            + "<p> hub_id: " +
            feature.properties.hub_id + "</p>"
            + "<p> driver_id: " +
            feature.properties.driver_id + "</p>"
            + "<p> num_items: " +
            feature.properties.num_items + "</p>"
            + "<p> created: " +
            feature.properties.created_at + "</p>"
            + "<p> started: " +
            feature.properties.started_at + "</p>"
            + "<p> completed: " +
            feature.properties.completed_at + "</p>";


        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    },

    checkAllConstraints: function(order, constraints) {
        var constraintMet = true;

        if (constraints.dateRange != null){
            var orderStart = utils.convertDateToEpoch(order.properties.created_at);
            var orderEnd = utils.convertDateToEpoch(order.properties.completed_at);

            var start = constraints.dateRange.start;
            var end  = constraints.dateRange.end;

            constraintMet = utils.twoRangesMatch(start, end, orderStart, orderEnd);
            if (constraintMet == false){
                return false;
            }
        }

        if (constraints.timeOfDay != null){
            var timeOfOrder = utils.extractMinutesFromDateStr(order.properties.created_at);

            var start = constraints.timeOfDay.start;
            var end  = constraints.timeOfDay.end;

            constraintMet = utils.valueIsInRange(start, end, timeOfOrder);
            if (constraintMet == false){
                return false;
            }
        }
        if (constraints.deliveryTime != null){

            var timeStartedMs = utils.extractMinutesFromDateStr(order.properties.started_at);
            var timeCompletedMs = utils.extractMinutesFromDateStr(order.properties.completed_at);

            var deliveryTimeMins = Math.ceil( (timeCompletedMs - timeStartedMs ) / 60 ) ;

            var start = constraints.deliveryTime.start;
            var end  = constraints.deliveryTime.end;

            constraintMet = utils.valueIsInRange(start, end, deliveryTimeMins);
            if (constraintMet == false){
                return false;
            }
        }
        if (constraints.numberItems != null){

            var numberItems = parseInt(order.properties.num_items);

            var start = constraints.numberItems.start;
            var end  = constraints.numberItems.end;

            constraintMet = utils.valueIsInRange(start, end, numberItems);
            if (constraintMet == false){
                return false;
            }
        }

        return constraintMet;
    },

}