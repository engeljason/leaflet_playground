
var map = L.map('map').setView([37.8, -96], 4);
var layers = {
    ONE_PLUS: new L.LayerGroup()
};

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    tileSize: 512,
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    zoomOffset: -1,
    layers: [
        layers.ONE_PLUS
    ]
}).addTo(map);

var overlays = {
    "Magnitude 1+": layers.ONE_PLUS
};

L.control.layers(null, overlays).addTo(map);

var usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

const colors = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];


d3.json(usgs_url).then(function(featureCollection) {
    var features = featureCollection.features;
    for (var i=0; i<features.length; i++) {
        var feature = Object.assign({}, features[i]);
        var coord = feature.geometry.coordinates;
        var d = coord[2];
        var color = d < 5 ? colors[0]:
                    d < 10 ? colors[1]:
                    d < 15 ? colors[2]:
                    d < 25 ? colors[3]:
                    d < 50 ? colors[4]:
                    d < 75 ? colors[5]:
                    d < 100 ? colors[6]:
                    colors[7];
        var mag = feature.properties.mag;
        var date = new Date(feature.properties.time).toDateString();
        var time = new Date(feature.properties.time).toTimeString();
        var place = feature.properties.place;
        var tooltip = `Magnitude ${mag} earthquake occured ${place} on ${date} at ${time}`
        var circle = L.circle([coord[1], coord[0]], {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            radius: mag * 10000
        }).bindPopup(tooltip).addTo(map); // TODO:  add legend
        
    }
    

});