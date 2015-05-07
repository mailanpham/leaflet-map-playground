(function(){
    var map = L.map('map').setView([51.932994,4.509373], 14);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'examples.map-20v6611k'
    }).addTo(map);

    L.marker([51.93746, 4.53432], {icon: L.AwesomeMarkers.icon({icon: 'leaf', prefix: 'fa', markerColor: 'green'}) }).addTo(map).bindPopup("I am a green leaf.");

    L.marker([51.941196,4.512291], {icon: L.AwesomeMarkers.icon({icon: 'spinner', prefix: 'fa', markerColor: 'red', spin:true}) }).addTo(map);
    L.marker([51.927913,4.521303], {icon: L.AwesomeMarkers.icon({icon: 'coffee', prefix: 'fa', markerColor: 'red', iconColor: '#f28f82'}) }).addTo(map);
    L.marker([51.936063,4.502077], {icon: L.AwesomeMarkers.icon({icon: 'cog', prefix: 'fa', markerColor: 'purple', iconColor: 'black'}) }).addTo(map);
    L.marker([51.932835,4.506969], {icon: L.AwesomeMarkers.icon({icon: 'glass', prefix: 'fa', markerColor: 'green'}) }).addTo(map);
    L.marker([51.930295,4.515209], {icon: L.AwesomeMarkers.icon({icon: 'shopping-cart', prefix: 'fa', markerColor: 'blue'}) }).addTo(map);
    L.marker([51.930083,4.507742], {icon: L.AwesomeMarkers.icon({icon: 'info', prefix: 'fa', markerColor: 'orange'}) }).addTo(map);
    L.marker([51.930454,4.527054], {icon: L.AwesomeMarkers.icon({icon: 'group', prefix: 'fa', markerColor: 'darkred'}) }).addTo(map);
    L.marker([51.929607,4.527054], {icon: L.AwesomeMarkers.icon({icon: 'arrow-right', prefix: 'fa', markerColor: 'darkblue'}) }).addTo(map);
    L.marker([51.928919,4.528856], {icon: L.AwesomeMarkers.icon({icon: 'twitter', prefix: 'fa', markerColor: 'cadetblue'}) }).addTo(map);
    L.marker([51.930295,4.530745], {icon: L.AwesomeMarkers.icon({icon: 'phone', prefix: 'fa', markerColor: 'darkpurple'}) }).addTo(map);
    L.marker([51.925055,4.512806], {icon: L.AwesomeMarkers.icon({icon: 'ambulance', prefix: 'fa', markerColor: 'darkgreen'}) }).addTo(map);
    L.marker([51.925902,4.505768], {icon: L.AwesomeMarkers.icon({icon: 'medkit', prefix: 'fa', markerColor: 'darkblue'}) }).addTo(map);


    //enable clicking on other areas of map
    var popup = L.popup();
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);

}());