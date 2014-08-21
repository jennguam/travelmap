var marker;
var infowindow;

function initialize() {
  var latlng = new google.maps.LatLng(37.4419, -122.1419);
  var options = {
    zoom: 13,
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

google.maps.event.addListener(map, "click", function(event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
    google.maps.event.addListener(marker, "click", function() {
      infowindow.open(map, marker);
    });
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