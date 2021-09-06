
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

var usgs_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

const colors = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026'];
const ranges = [0, 5, 10, 15, 25, 50, 75, 100];

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    var from;
    var to;
    var labels = [];

    labels.push('<i>Depth</i>')
    for (var i = 0; i < ranges.length; i++) {
        from = ranges[i];
        to = ranges[i + 1];

        labels.push(
            '<i style="background:' + colors[i] + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);



d3.json(usgs_url).then(function(featureCollection) {
    var features = featureCollection.features;
    for (var i=0; i<features.length; i++) {
        var feature = Object.assign({}, features[i]);
        var coord = feature.geometry.coordinates;
        var d = coord[2];
        var color = d < ranges[1] ? colors[0]:
                    d < ranges[2] ? colors[1]:
                    d < ranges[3] ? colors[2]:
                    d < ranges[7] ? colors[3]:
                    d < ranges[5] ? colors[4]:
                    d < ranges[6] ? colors[5]:
                    d < ranges[7] ? colors[6]:
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
        }).bindPopup(tooltip).addTo(map);
        
    }
    

});