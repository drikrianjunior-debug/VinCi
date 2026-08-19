var google;

function init() {

    // Coordonnées exactes d'Abidjan
    var myLatlng = new google.maps.LatLng(5.325183354355468, -4.01882453269957);

    var mapOptions = {
        // Zoom ajusté pour une vue locale précise
        zoom: 15,

        // Centre de la carte sur vos coordonnées
        center: myLatlng,

        // Options de style
        scrollwheel: false,
        styles: [
            {
                "featureType": "administrative.country",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "hue": "#ff0000"
                    }
                ]
            }
        ]
    };

    // Récupération de l'élément HTML conteneur
    var mapElement = document.getElementById('map');

    // Initialisation de la carte Google Maps
    var map = new google.maps.Map(mapElement, mapOptions);

    // Placement du marqueur personnalisé directement sur vos coordonnées GPS
    new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: 'images/loc.png'
    });
}

google.maps.event.addDomListener(window, 'load', init);