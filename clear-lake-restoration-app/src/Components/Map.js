import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import LegendControl from 'mapboxgl-legend';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbmFsaSIsImEiOiJjbDBqY2V2bGowYjlrM2NtaXhjYzlyM2pxIn0.BxtrB0AyBeGd8lug5c6mUg';

export default function Map(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-122.8);
    const [lat, setLat] = useState(39.06);
    const [zoom, setZoom] = useState(10.5);

    function addStreamMarkers() {
        map.current.on('load', () => {
            map.current.addSource('streams', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{"type":"Feature","properties":{"name":"kelsey"},"geometry":{"type":"Point","coordinates":[-122.83993721008301,39.010113964456906]}},{"type":"Feature","properties":{"name":"scotts"},"geometry":{"type":"Point","coordinates":[-122.96035766601562,39.09503035637981]}},{"type":"Feature","properties":{"name":"middle"},"geometry":{"type":"Point","coordinates":[-122.91277527809143,39.18288011927886]}}],
                },
            });
            map.current.addLayer({
                id: 'streams',
                source: 'streams',
                type: 'circle',
                paint: {
                    'circle-color': '#009E73',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
                metadata: {
                    "name": "Stream Monitoring Sites"
                }
            });
            map.current.on("mouseenter", "streams", e => {
                if (e.features.length) {
                    map.current.getCanvas().style.cursor = "pointer";
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    const description = e.features[0].properties.name.charAt(0).toUpperCase() + e.features[0].properties.name.slice(1) + " Creek"
                    new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map.current)
                }
            });
            map.current.on("mouseleave", "streams", () => {
                map.current.getCanvas().style.cursor = "";
                const popup = document.getElementsByClassName('mapboxgl-popup');
                if (popup.length) {
                    popup[0].remove();
                }
            });
            map.current.on("click", "streams", e => {
                console.log(e.features[0].properties.name);
                window.location.href='/'+e.features[0].properties.name;
            });
        });
    }
    function addMetMarkers() {
        map.current.on('load', () => {
            map.current.addSource('met', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{"type":"Feature","properties":{"name":"nic"},"geometry":{"type":"Point","coordinates":[-122.84362792968749,39.12153746241925]}},{"type":"Feature","properties":{"name":"nlp"},"geometry":{"type":"Point","coordinates":[-122.90044784545898,39.09676228071075]}},{"type":"Feature","properties":{"name":"bvr"},"geometry":{"type":"Point","coordinates":[-122.8875732421875,39.02518507512901]}},{"type":"Feature","properties":{"name":"bkp"},"geometry":{"type":"Point","coordinates":[-122.75281906127928,39.01771660762443]}},{"type":"Feature","properties":{"name":"knb"},"geometry":{"type":"Point","coordinates":[-122.74286270141602,38.991971023322954]}},{"type":"Feature","properties":{"name":"clo"},"geometry":{"type":"Point","coordinates":[-122.6762580871582,39.01958379846303]}},{"type":"Feature","properties":{"name":"jgb"},"geometry":{"type":"Point","coordinates":[-122.66647338867188,38.946326305260754]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-122.64673233032227,38.95446976982263]}}],
                },
            });
            map.current.addLayer({
                id: 'met',
                source: 'met',
                type: 'circle',
                paint: {
                    'circle-color': '#999999',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
                metadata: {
                    name: "Meteorological Stations",
                }
            });
            map.current.on("mouseenter", "met", e => {
                if (e.features.length) {
                    map.current.getCanvas().style.cursor = "pointer";
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    let description = ""
                    if (e.features[0].properties.name == "bkp") {
                        description = "Buckingham Point";
                    } else if (e.features[0].properties.name == "nic") {
                        description = "Nice"
                    } else if (e.features[0].properties.name == "nlp") {
                        description = "North Lakeport"
                    } else if (e.features[0].properties.name == "bvr") {
                        description = "Big Valley Rancheria"
                    } else if (e.features[0].properties.name == "knb") {
                        description = "Konocti Bay"
                    } else if (e.features[0].properties.name == "clo") {
                        description = "Clearlake Oaks"
                    } else if (e.features[0].properties.name == "jgb") {
                        description = "Jago Bay"
                    } else {
                        description = "Beakbane Island"
                    }
                    new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map.current)
                }
            });
            map.current.on("mouseleave", "met", () => {
                map.current.getCanvas().style.cursor = "";
                const popup = document.getElementsByClassName('mapboxgl-popup');
                if (popup.length) {
                    popup[0].remove();
                }
            });
            map.current.on("click", "met", e => {
                console.log(e.features[0].properties.name);
                window.location.href='/'+e.features[0].properties.name;
            });
        });
    }
    function addLakeMarkers() {
        map.current.on('load', () => {
            map.current.addSource('lake', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [{"type":"Feature","properties":{"name": "ua08"},"geometry":{"type":"Point","coordinates":[-122.85839080810547,39.086103610256714]}},{"type":"Feature","properties":{"name": "ua07"},"geometry":{"type":"Point","coordinates":[-122.8652572631836,39.05758374935667]}},{"type":"Feature","properties":{"name": "ua06"},"geometry":{"type":"Point","coordinates":[-122.82714843749999,39.07357761413151]}},{"type":"Feature","properties":{"name": "ua01"},"geometry":{"type":"Point","coordinates":[-122.7945327758789,39.02131757437681]}},{"type":"Feature","properties":{"name": "nr02"},"geometry":{"type":"Point","coordinates":[-122.75299072265624,39.027185423531215]}},{"type":"Feature","properties":{"name": "la03"},"geometry":{"type":"Point","coordinates":[-122.71350860595702,38.96848501741372]}},{"type":"Feature","properties":{"name": "oa04"},"geometry":{"type":"Point","coordinates":[-122.71556854248048,39.01198135604184]}}],
                },
            });
            map.current.addLayer({
                id: 'lake',
                source: 'lake',
                type: 'circle',
                paint: {
                    'circle-color': '#E69F00',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
                metadata: {
                    "name": "Lake Monitoring Sites"
                }
            });
            map.current.on("mouseenter", "lake", e => {
                if (e.features.length) {
                    map.current.getCanvas().style.cursor = "pointer";
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    const description = e.features[0].properties.name.slice(0,2).toUpperCase() + e.features[0].properties.name.slice(2).toUpperCase()
                    new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map.current)
                }
            });
            map.current.on("mouseleave", "lake", () => {
                map.current.getCanvas().style.cursor = "";
                const popup = document.getElementsByClassName('mapboxgl-popup');
                if (popup.length) {
                    popup[0].remove();
                }
            });
            map.current.on("click", "lake", e => {
                console.log(e.features[0].properties.name);
                window.location.href='/'+e.features[0].properties.name;
            });
        });
    }
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        if (props.name == "stream") {
            addStreamMarkers();
        }
        if (props.name == "met") {
            addMetMarkers();
        }
        if (props.name == "lake") {
            addLakeMarkers();
        }
        if (props.name == "all") {
            addStreamMarkers();
            addMetMarkers();
            addLakeMarkers();
        }
        const legend = new LegendControl({toggler: true, collapsed: false});
        map.current.addControl(legend, 'bottom-left');
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
    <div className="map">
        <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
    </div>
    );
}

