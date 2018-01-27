$(document).ready(function(){
    // Définition des variables
    var latstart;
    var lngstart;
    var latend;
    var lngend;
    var modeValue;
    var typeVoitureValue;
    var consommationValue = 6;
    var modeCompareValue;
    var typeVoitureCompareValue;
    var consommationCompareValue = 6;
    var routeTimeCompare;
    var routeEmissionCompare;
    var routeTime;
    var routeEmission;

    // Définition de la date à utiliser pour le calcul du trafic
    // Par défaut, 8h30 le prochain mardi
    var d = new Date();
        d.setDate(d.getDate() + (7 - d.getDay()) % 7 + 2);
        d.setHours(8);
        d.setMinutes(30);

    var date = d.toISOString();

    // Récupération des adresses entrées dans le formulaire initial
    var start = $('#start');
    var end = $('#end');


    // INITIALISATION DE LA CARTE
    // Instantiate a map and platform object:
    var platform = new H.service.Platform({
        'app_id': 'UbuovaYFepC93sDSDXuC',
        'app_code': 'PMxcGAN4mN2wyJmQsTWVnw'
    });

    // Get an instance of the routing service:
    var router = platform.getRoutingService();

    // Pour le départ 
    start.change(function () {
        $("#start_adress_valid").addClass("is-hidden");
        $("#start_adress_invalid").addClass("is-hidden");
        $("#groupStart > p.is-success").addClass("is-hidden");
        $("#groupStart > p.is-danger").addClass("is-hidden");
        $("#start").removeClass("is-success");
        $("#start").removeClass("is-danger");
        geocodestart($(this).val());
    });

    start.blur(function () {
        if ($(this).val()) {
            $("#start_adress_valid").addClass("is-hidden");
            $("#start_adress_invalid").addClass("is-hidden");
            $("#groupStart > p.is-success").addClass("is-hidden");
            $("#groupStart > p.is-danger").addClass("is-hidden");
            $("#start").removeClass("is-success");
            $("#start").removeClass("is-danger");
            geocodestart($(this).val());
        } else {
            $("#start_adress_valid").addClass("is-hidden");
            $("#start_adress_invalid").addClass("is-hidden");
            $("#groupStart > p.is-success").addClass("is-hidden");
            $("#groupStart > p.is-danger").addClass("is-hidden");
            $("#start").removeClass("is-success");
            $("#start").removeClass("is-danger");
        }   
    });

    // On demande les coordonnées de l'adresse fournie pour le départ
    function geocodestart(value) {
        var geocoder = platform.getGeocodingService(),
            geocodingParameters = {
                searchText: value
            };

        geocoder.geocode(
            geocodingParameters,
            onSuccessStart,
            onErrorStart
            );
    }

    function onSuccessStart(result) {
        if (result.Response.View.length>0) {
            // On obtient une réponse de .here
            var locationstart = result.Response.View[0].Result[0];
            var citystart = locationstart.Location.Address.City;
            latstart = locationstart.Location.DisplayPosition.Latitude;
            lngstart = locationstart.Location.DisplayPosition.Longitude;
            // On ajoute la classe correspondante au champ de texte
            $("#start_adress_valid").removeClass("is-hidden");
            $("#groupStart > p.is-success").removeClass("is-hidden");
            $("#start").addClass("is-success");

            // On rapelle l'API de calcul de l'itinéraire
            apiCall();
            apiCallCompare();
        
        } else {
            // On n'obtient pas de réponse de .here, ou une réponse erronnée
            // On ajoute la classe correspondante au champ de texte
            $("#start_adress_invalid").removeClass("is-hidden");
            $("#groupStart > p.is-danger").removeClass("is-hidden");
            $("#start").addClass("is-danger");
        }
    }

    function onErrorStart(error){
        // Problème de connexion avec le serveur
        alert("Une erreur est survenue lors de la connexion avec le serveur");
    }

    // Pour l'arrivée 
    end.change (function() {
        $("#end_adress_valid").addClass("is-hidden");
        $("#end_adress_invalid").addClass("is-hidden");
        $("#groupEnd > p.is-success").addClass("is-hidden");
        $("#groupEnd > p.is-danger").addClass("is-hidden");
        $("#end").removeClass("is-success");
        $("#end").removeClass("is-danger");
        geocodeend($(this).val());
    });

    end.blur(function () {
        if ($(this).val()) {
            $("#end_adress_valid").addClass("is-hidden");
            $("#end_adress_invalid").addClass("is-hidden");
            $("#groupEnd > p.is-success").addClass("is-hidden");
            $("#groupEnd > p.is-danger").addClass("is-hidden");
            $("#end").removeClass("is-success");
            $("#end").removeClass("is-danger");
            geocodeend($(this).val());
        } else {
            $("#end_adress_valid").addClass("is-hidden");
            $("#end_adress_invalid").addClass("is-hidden");
            $("#groupEnd > p.is-success").addClass("is-hidden");
            $("#groupEnd > p.is-danger").addClass("is-hidden");
            $("#end").removeClass("is-success");
            $("#end").removeClass("is-danger");
        }   
    });

    // On demande les coordonnées de l'adresse fournie pour le départ
    function geocodeend(value){
        var geocoder = platform.getGeocodingService(),
            geocodingParameters = {
                searchText: value
        };

        geocoder.geocode(
            geocodingParameters,
            onSuccessEnd,
            onErrorEnd
            );
    }

    function onSuccessEnd(result){

        if(result.Response.View.length>0) {
            // On obtient une réponse de .here
            var locationend = result.Response.View[0].Result[0];
            var cityend = locationend.Location.Address.City;
            latend = locationend.Location.DisplayPosition.Latitude;
            lngend = locationend.Location.DisplayPosition.Longitude;
            // On ajoute la classe correspondante au champ de texte
            $("#end_adress_valid").removeClass("is-hidden");
            $("#groupEnd > p.is-success").removeClass("is-hidden");
            $("#end").addClass("is-success");

            // On rapelle l'API de calcul de l'itinéraire
            apiCall();
            apiCallCompare();
        } else {
            // On n'obtient pas de réponse de .here, ou une réponse erronnée
            // On ajoute la classe correspondante au champ de texte
            $("#end_adress_invalid").removeClass("is-hidden");
            $("#groupEnd > p.is-danger").removeClass("is-hidden");
            $("#end").addClass("is-danger");
        }
    }

    function onErrorEnd(error){
        // Problème de connexion avec le serveur
        alert("Une erreur est survenue lors de la connexion avec le serveur");
    }

    // TRAJET INITIAL
    // Gestion du mode de transport et appel de l'API
    $("li.mode_actuel_toggle").click(function () {
        modeValue = $(this).attr('value');
        if(modeValue != 'car'){
        // On apelle l'API dans tous les cas
        apiCall();
        }
    });

    $("li.dropdown_car_item.mode_actuel").click(function(){
        modeValue = 'car';
        typeVoitureValue = $(this).attr('value')
        apiCall();
    });

    // TRAJET À COMPARER
    // Gestion du mode de transport et appel de l'API
    $("li.mode_compare_toggle").click(function () {
        modeCompareValue = $(this).attr('value');
        if(modeCompareValue != 'car'){
        // On apelle l'API dans tous les cas
        apiCallCompare();
        }
    });

    $("li.dropdown_car_item.mode_compare").click(function(){
        modeCompareValue = 'car';
        typeVoitureCompareValue = $(this).attr('value');
        apiCallCompare();
    });

    // On a les deux coordonnées, on calcule maintenant l'itinéraire initial
    function apiCall(){
        if (latstart && lngstart && latend && lngend && modeValue) {
            // On calcule les paramètres à donner à l'API pour calculer la route
            if (modeValue === 'car') {
                // Si on a une voiture electrique
                if(typeVoitureValue === 'electric') {
                    var routingParameters = {
                        // The routing mode:
                        'mode': 'fastest;car;traffic:enabled',
                        // The start point of the route:
                        'waypoint0': 'geo!' + latstart + ',' + lngstart,
                        // The end point of the route:
                        'waypoint1': 'geo!' + latend + ',' + lngend,
                        // representation mode 'display'
                        'representation': 'display',
                        'routeattributes': 'waypoints,summary,shape,legs',
                        'maneuverattributes': 'direction,action',
                        'departure': date,
                        'vehicletype': typeVoitureValue,
                    };

                // Call calculateRoute() with the routing parameters,
                // the callback and an error callback function (called if a
                // communication error occurs):
                router.calculateRoute(routingParameters, onResult,
                    function(error) {
                    alert(error.message);
                    });

                // Si la voiture n'est pas electrique, on doit
                // vérifier les autres paramètres
                } else if (consommationValue && typeVoitureValue) {
                    var routingParameters = {
                        // The routing mode:
                        'mode': 'fastest;car;traffic:enabled',
                        // The start point of the route:
                        'waypoint0': 'geo!' + latstart + ',' + lngstart,
                        // The end point of the route:
                        'waypoint1': 'geo!' + latend + ',' + lngend,
                        // representation mode 'display'
                        'representation': 'display',
                        'routeattributes': 'waypoints,summary,shape,legs',
                        'maneuverattributes': 'direction,action',
                        'departure': date,
                        'vehicletype': typeVoitureValue + ',' + consommationValue,
                    };

                // Call calculateRoute() with the routing parameters,
                // the callback and an error callback function (called if a
                // communication error occurs):
                router.calculateRoute(routingParameters, onResult,
                    function(error) {
                    alert(error.message);
                    });
                }
            } else {
                // Pour le vélo, les piétons et les transports en commun
                var routingParameters = {
                    // The routing mode:
                    'mode': 'fastest;' + modeValue,
                    // The start point of the route:
                    'waypoint0': 'geo!' + latstart + ',' + lngstart,
                    // The end point of the route:
                    'waypoint1': 'geo!' + latend + ',' + lngend,
                    // representation mode 'display'
                    'representation': 'display',
                    'routeattributes': 'waypoints,summary,shape,legs',
                    'maneuverattributes': 'direction,action',
                };

                // Call calculateRoute() with the routing parameters,
                // the callback and an error callback function (called if a
                // communication error occurs):
                router.calculateRoute(routingParameters, onResult,
                    function(error) {
                    alert(error.message);
                    });
            }
        }
    }

    // Appel de l'API pour l'itinéraire à comparer'
    function apiCallCompare(){
        if (latstart && lngstart && latend && lngend && modeCompareValue) {
        // On calcule les paramètres à donner à l'API pour calculer la route
            if (modeCompareValue === 'car') {
                // Si on a une voiture electrique
                if(typeVoitureCompareValue === 'electric') {
                    var routingParameters = {
                        // The routing mode:
                        'mode': 'fastest;car;traffic:enabled',
                        // The start point of the route:
                        'waypoint0': 'geo!' + latstart + ',' + lngstart,
                        // The end point of the route:
                        'waypoint1': 'geo!' + latend + ',' + lngend,
                        // representation mode 'display'
                        'representation': 'display',
                        'routeattributes': 'waypoints,summary,shape,legs',
                        'maneuverattributes': 'direction,action',
                        'departure': date,
                        'vehicletype': typeVoitureCompareValue,
                    };

                // Call calculateRoute() with the routing parameters,
                // the callback and an error callback function (called if a
                // communication error occurs):
                router.calculateRoute(routingParameters, onResultCompare,
                    function(error) {
                    alert(error.message);
                    });

                // Si la voiture n'est pas electrique, on doit
                // vérifier les autres paramètres
                } else if (consommationCompareValue && typeVoitureCompareValue) {
                    var routingParameters = {
                        // The routing mode:
                        'mode': 'fastest;car;traffic:enabled',
                        // The start point of the route:
                        'waypoint0': 'geo!' + latstart + ',' + lngstart,
                        // The end point of the route:
                        'waypoint1': 'geo!' + latend + ',' + lngend,
                        // representation mode 'display'
                        'representation': 'display',
                        'routeattributes': 'waypoints,summary,shape,legs',
                        'maneuverattributes': 'direction,action',
                        'departure': date,
                        'vehicletype': typeVoitureCompareValue + ',' + consommationCompareValue,
                    };

                // Call calculateRoute() with the routing parameters,
                // the callback and an error callback function (called if a
                // communication error occurs):
                router.calculateRoute(routingParameters, onResultCompare,
                    function(error) {
                    alert(error.message);
                    });
                }
            } else {
                // Pour le vélo, les piétons et les transports en commun
                var routingParameters = {
                    // The routing mode:
                    'mode': 'fastest;' + modeCompareValue,
                    // The start point of the route:
                    'waypoint0': 'geo!' + latstart + ',' + lngstart,
                    // The end point of the route:
                    'waypoint1': 'geo!' + latend + ',' + lngend,
                    // representation mode 'display'
                    'representation': 'display',
                    'routeattributes': 'waypoints,summary,shape,legs',
                    'maneuverattributes': 'direction,action',
                };

                // Call calculateRoute() with the routing parameters,
                // the callback and an error callback function (called if a
                // communication error occurs):
                router.calculateRoute(routingParameters, onResultCompare,
                    function(error) {
                    alert(error.message);
                    });
            }
        }
    }

    // Get the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();

    // Instantiate the map:
    var map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.normal.map,
        {
        zoom: 11,
        center: { lat: 48.853, lng: 2.35 }
        });


    // Fonction de callback pour l'itinéraire intial
    var onResult = function(result) {
        if (result.subtype) {
            // On a une erreur, on vide les champs
            $("#erreurFirst").removeClass("is-hidden");
            $("#tempsActuel").text(() => null);
            $("#distanceActuelle").text(() => null);
            $("#emissionActuelle").text(() => null);
            $("#tempsConclusion").text(() => null);
            $("#emissionConclusion").text(() => null);
            $("#mapContainer").empty();
            routeDistance = null;
            routeTime = null;

            // On efface la carte
            delete(map);

            // On replace la carte sur Paris
            map = new H.Map(
                document.getElementById('mapContainer'),
                    defaultLayers.normal.map,
                        {
                            zoom: 11,
                            center: { lat: 48.853, lng: 2.35 }
                        }
            );
        } else {
            // L'itinéraire est bon, on efface les messages d'erreur
            $("#erreurFirst").addClass("is-hidden");
            $("#mapContainer").empty();

            // On efface la carte
            delete(map);

            // On replace la carte sur Paris
            map = new H.Map(
                document.getElementById('mapContainer'),
                    defaultLayers.normal.map,
                        {
                            zoom: 11,
                            center: { lat: 48.853, lng: 2.35 }
                        }
            );

            var route,
                routeShape,
                startPoint,
                endPoint,
                strip,
                routeDistance;

            if(result.response.route) {
                // Pick the first route from the response:
                route = result.response.route[0];
                // Pick the route's shape:
                routeShape = route.shape;
                // On calcule les données de l'itinéraire
                routeDistance = Math.round(route.summary.distance/100)/10;
                routeTime = Math.round(route.summary.travelTime/60);
                $("#tempsActuel").text(() => routeTime)
                $("#distanceActuelle").text(() => routeDistance)

                routeEmission = route.summary.co2Emission;
                // Vérification dans le cas d'emmissions nulles
                if(!routeEmission > 0) {
                    routeEmission = 0 ;
                }
                $("#emissionActuelle").text(() => routeEmission);


                // CCCV HERE
                // Create a strip to use as a point source for the route line
                strip = new H.geo.Strip();

                // Push all the points in the shape into the strip:
                routeShape.forEach(function(point) {
                    var parts = point.split(',');
                        strip.pushLatLngAlt(parts[0], parts[1]);
                });

                // Retrieve the mapped positions of the requested waypoints:
                startPoint = route.waypoint[0].mappedPosition;
                endPoint = route.waypoint[1].mappedPosition;

                // Create a polyline to display the route:
                var routeLine = new H.map.Polyline(strip, {
                    style: { 
                        strokeColor: 'blue', lineWidth: 5
                    }
                });

                // Create a marker for the start point:
                var startMarker = new H.map.Marker({
                    lat: startPoint.latitude,
                    lng: startPoint.longitude
                });

                // Create a marker for the end point:
                var endMarker = new H.map.Marker({
                    lat: endPoint.latitude,
                    lng: endPoint.longitude
                });

                // Add the route polyline and the two markers to the map:
                map.addObjects([routeLine, startMarker, endMarker]);

                // Set the map's viewport to make the whole route visible:
                map.setViewBounds(routeLine.getBounds());
            }

        // Controles pour rendre la carte interactive
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // Create the default UI components
        var ui = H.ui.UI.createDefault(map, defaultLayers, 'fr-FR');

    // On apelle la fonction de comparaison
    comparaison();

    }};

    // Fonction de callback pour l'itinéraire à comparer, pas besoin de la carte
    var onResultCompare = function(result) {
        if (result.subtype) {
            // On a une erreur, on vide les champs
            $("#erreurSecond").removeClass("is-hidden");
            $("#tempsNouveau").text(() => null);
            $("#distanceNouvelle").text(() => null);
            $("#emissionNouvelle").text(() => null);
            $("#tempsConclusion").text(() => null);
            $("#emissionConclusion").text(() => null);
            routeDistanceCompare = null;
            routeTimeCompare = null;

        } else {
        // L'itinéraire est bon, on efface les messages d'erreur
            $("#erreurSecond").addClass("is-hidden");
            var route,
                routeDistanceCompare;

            if(result.response.route) {
                route = result.response.route[0];
                // On calcule les données de l'itinéraire
                routeDistanceCompare = Math.round(route.summary.distance/100)/10;
                routeTimeCompare = Math.round(route.summary.travelTime/60);
                $("#tempsNouveau").text(() => routeTimeCompare)
                $("#distanceNouvelle").text(() => routeDistanceCompare);
                routeEmissionCompare = route.summary.co2Emission;
                // Vérification dans le cas d'emmissions nulles
                if(!routeEmissionCompare > 0) {
                    routeEmissionCompare = 0 ;
                }
                $("#emissionNouvelle").text(() => routeEmissionCompare);

            // On apelle la fonction de comparaison
            comparaison();
            }
        }
    };

    // Fonction pour afficher les conclusions en comparant les temps de trajet et les émission
    function comparaison() {
        if (routeTime && routeTimeCompare) {
            var diffTemps, diffEmission,nbArbre,diametreBallon;
            diffTemps = routeTime - routeTimeCompare;
            diffEmission = routeEmission - routeEmissionCompare;
            diffEmission = Math.round(diffEmission * 1000) / 1000;
            nbArbre = Math.round(diffEmission * 2 * 204 / 7)
            diametreBallon = Math.round((diffEmission * 2 * 204 * 3 / (4 * 3.14 * 1.87))^(1 / 3));

            if (diffTemps<0) {
                $("#tempsConclusion").replaceWith('<p id="tempsConclusion">Avec ce changement de mode de transport vous perdriez <strong style="color:red;">' + (-diffTemps) + ' minutes</strong> sur votre trajet.</p>');
            } else if (diffTemps === 0) {
                $("#tempsConclusion").replaceWith('<p id="tempsConclusion">Avec ce changement de mode de transport vous ne perdriez <strong style="color:green;">aucun temps</strong> sur votre trajet.</p>');
            } else {
                $("#tempsConclusion").replaceWith('<p id="tempsConclusion">Avec ce changement de mode de transport vous gagneriez <strong style="color:green;">' + diffTemps + ' minutes</strong> sur votre trajet.</p>');
            }

            if (diffEmission<0) {
                $("#emissionConclusion").replaceWith('<p id="emissionConclusion">Avec ce changement de mode de transport vous émettriez <strong style="color:red;">' + (-diffEmission) + 'kg de CO2 en plus</strong> sur votre trajet.<br/>Chaque année il faudrait planter <strong style="color:red;">'+(-nbArbre)+' arbres</strong> pour compenser cette hausse et <strong style="color:red;">un ballon de ' + (-diametreBallon) + ' mètres de diamètre</strong> serait rempli de CO2!</p>');
            } else if (diffEmission === 0) {
                $("#emissionConclusion").replaceWith("<p id='emissionConclusion'>Ce changement de mode de transport n'aurait aucune influence sur vos émissions de CO2.</p>");
            } else {
                $("#emissionConclusion").replaceWith("<p id='emissionConclusion'>Avec ce changement de mode de transport vous émettriez <strong style='color:green;'>"+ diffEmission +" kg de CO2 en moins</strong> sur votre trajet.<br/>Sur une année cela représente <strong style='color:green;'>" + nbArbre + " arbres</strong> plantés et c'est <strong style='color:green;'>un ballon de " + diametreBallon + " mètres de diamètre </strong> en moins dans l'athmosphère!</p>");
            }
        }
    }

    // Permet de zoomer sur la carte
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers, 'fr-FR');
})