var marker;
var infowindow;

function initialize() {
  var markers = [];
  var latlng = new google.maps.LatLng(39.8282, -98.5795);
  var options = {
    zoom: 4,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var map = new google.maps.Map(document.getElementById("map-canvas"), options);
  var html = "<table>" +
             "<tr><td>Name:</td> <td><input type='text' id='name'/> </td> </tr>" +
             "<tr><td>Address:</td> <td><input type='text' id='address'/></td> </tr>" +
             "<tr><td>Phone: </td><td><input type='text' id='phone'/></td></tr>" +
             "<tr><td>Beverage:</td> <td><select id='beverage'>" +
             "<option value='bar' SELECTED>Coffee</option>" +
             "<option value='restaurant'>Beer</option>" +
             "</select> </td></tr>" +
             "<tr><td></td><td><input type='button' value='Save & Close' onclick='saveData()'/></td></tr>";
infowindow = new google.maps.InfoWindow({
 content: html
});


 // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

 var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
       var marker = new google.maps.Marker({
        map: map,
        title: place.name,
        draggable:true,
        position: place.geometry.location
      });

      markers.push(marker);
      infowindow.open(map, marker);
      



      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
    map.setZoom(14);
  });
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}





function saveData() {
  var name = escape(document.getElementById("name").value);
  var address = escape(document.getElementById("address").value);
  var phone = escape(document.getElementById("phone").value);
  var beverage = document.getElementById("beverage").value;
  var latlng = marker.getPosition();

  var url = "phpsqlinfo_addrow.php?name=" + name + "&address=" + address +
            "&type=" + type + "&lat=" + latlng.lat() + "&lng=" + latlng.lng();
  downloadUrl(url, function(data, responseCode) {
    if (responseCode == 200 && data.length >= 1) {
      infowindow.close();
      document.getElementById("message").innerHTML = "Location added.";
    }
  });
}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
      new ActiveXObject('Microsoft.XMLHTTP') :
      new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request.responseText, request.status);
    }
  };

  request.open('GET', url, true);
  request.send(null);
}

function doNothing() {}