// POPUP
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

//LAYERS
  var india_states = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/demo/wms',
      params: {
        'LAYERS': ' demo:india_states',
        'TILE': true
      },
      ratio: 1,
      serverType: 'geoserver'
    }),
    visible: true,
    title: 'india_states',
    name: 'india_states'
  })

  var Airports = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/demo/wms',
      params: {
        'LAYERS': '	demo:Airports',
        'TILE': true
      },
      ratio: 1,
      serverType: 'geoserver'
    }),
    visible: false,
    title: 'Airports',
    name: 'Airports'
  })

  var Ports = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/demo/wms',
      params: {
        'LAYERS': 'demo:Ports',
        'TILE': true
      },
      ratio: 1,
      serverType: 'geoserver'
    }),
    visible: false,
    title: 'Ports',
    name: 'Ports'
  })

 //LOADING OSM MAP
    var map = new ol.Map({
      target: 'map',
      layers: [
          new ol.layer.Tile({
              source: new ol.source.OSM()
          })
      ],
      view: new ol.View({
          center:  [9128198.25, 2391878.59],
          zoom: 5
      }),
      overlays: [overlay]
    });

map.addLayer(india_states);
map.addLayer(Airports);
map.addLayer(Ports);

//SHOW ATTRIBUTES
map.on('singleclick', function(evt){
  var vr = map.getView().getResolution();
  var coordinate = evt.coordinate;
  
  map.forEachLayerAtPixel(evt.pixel, function(layer){
    var url = layer.getSource().getFeatureInfoUrl(
      evt.coordinate, vr, 'EPSG:3857',{
        'INFO_FORMAT': 'application/json'
      });
      
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
          var attobj = JSON.parse(xhttp.responseText);
          console.log(attobj);
         
          var name = attobj.features[0].id;
          var name1 = name.split('.')[0];
          
          var coln =  Object.keys(attobj.features[0].properties);
          var row = attobj.features[0].properties;
          var tlb = "<table border = 1>"
          for(var i in coln){
            tlb += "<tr><th>" + coln[i].toUpperCase() + "</th>" + "<td> " + row[coln[i]] + "</td></tr>"
          }
        }
        content.innerHTML = tlb + ((name1.charAt(0).toUpperCase() + name1.slice(1)).bold()).fontcolor("darkblue");

      }
      xhttp.open("GET", url, true);
      xhttp.send(); 
      overlay.setPosition(coordinate);
      })
  })

checkbox = document.getElementById("Airports");
    checkbox.onchange = function(event){
      if (event.target.checked) { Airports.setVisible(true);('checked');}
      else{  Airports.setVisible(false);('not checked');}
    };

checkbox = document.getElementById("Ports");
    checkbox.onchange = function(event){
      if (event.target.checked) { Ports.setVisible(true);('checked');}
      else{ Ports.setVisible(false);('not checked');}
    };

   