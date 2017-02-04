var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

(function ($) {

    var Landscape = Backbone.Model.extend({
        defaults: {
            gsx$nom: "No title",
            gsx$long: "No long",
            gsx$LAT: "No lat",
        },
    });

    var Library = Backbone.Collection.extend({
        model: Landscape,
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
        className: "LandscapeContainer",
        template: $("#LandscapeTemplate").html(),
        render: function () {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },
    });
    var LibraryView = Backbone.View.extend({
        el: $("#Landscapes"),

        initialize: function () {
            this.collection = new Library();
            this.collection.fetch({
                error: function () {
                    console.log(arguments);
                }
            });
            console.log(this);
            this.render();
            this.collection.on("reset", this.render, this);
        },

        render: function () {
            var that = this;
            _.each(this.collection.models, function (item) {
                that.renderLandscape(item);
            });
        },

        renderLandscape: function (item) {
            var bookView = new BookView({
                model: item
            });
            this.$el.append(bookView.render().el);
        }
    });

    var libraryView = new LibraryView();

})(jQuery);
