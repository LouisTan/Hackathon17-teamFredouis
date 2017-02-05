var map;
var panorama;

function toggleStreetView() {
    var toggle = panorama.getVisible();
    if (toggle == false) {
        panorama.setVisible(true);
    } else {
        panorama.setVisible(false);
    }
}
function initMap() {
    
    PinOnMap(45.5088400, -73.5878100)

    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 12
    });
      
}
// Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function PinOnMap(lat, lng) {
    var myLatLng = new google.maps.LatLng(lat, lng);
    
    
    
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Montreal Map'
    });
    
    panorama = map.getStreetView();
    panorama.setPosition(myLatLng);
    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: 265,
        pitch: 0
    }));
    
    
}


(function ($) {
    
    var Landmark = Backbone.Model.extend({
        defaults: {
            gsx$nom: "No title",
            gsx$long: "No long",
            gsx$lat: "No lat",
        },
    });
    
    var Library = Backbone.Collection.extend({
        model: Landmark,
        url: function () {
            var key = "1ti6294CKpRH0-RYrLcdtP_ZF1CCAleuo5wS7MeMF22k";
            return "https://spreadsheets.google.com/feeds/list/" + key + "/od6/public/values?alt=json";
        },
        parse: function (resp, xhr) {
            var data = resp.feed.entry, i;
            for (i = data.length - 1; i >= 0; i--) {
                data[i].id = data[i].id['$t'];
                data[i]['gsx$nom'] = data[i]['gsx$nom']['$t'];
                data[i]['gsx$long'] = data[i]['gsx$long']['$t'];
                data[i]['gsx$lat'] = data[i]['gsx$lat']['$t'];
            }
            return data;
        }
    });
    
    var BookView = Backbone.View.extend({
        tagName: "tr",
        className: "LandmarkContainer",
        template: $("#LandmarkTemplate").html(),
        render: function () {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },
    });
    var LibraryView = Backbone.View.extend({
        el: $("#Landmarks"),
                                           
       initialize: function () {
           this.collection = new Library();
           this.collection.fetch({
               error: function () {
                   console.log(arguments);
               }
           });
           this.render();
           this.collection.on("reset", this.render, this);
       },
       
       render: function () {
           var that = this;
           _.each(this.collection.models, function (item) {
               that.renderLandmark(item);
           });
           $('.LandmarkContainer').click(function () {
               var lat = $(".lat:first",this).text();
               var lng = $(".long:first",this).text();
               $(".sidebar-brand").text( $("button:first",this).text());
               PinOnMap(parseFloat(lat),parseFloat(lng));
               
           });
           $( "#tabledata").hover(function () {
               $( "#tabledata").DataTable();
               
           });
           
       },
       
       renderLandmark: function (item) {
           var bookView = new BookView({
               model: item
           });
           this.$el.append(bookView.render().el);
       }
    });
    
    var libraryView = new LibraryView();
    
})(jQuery)


