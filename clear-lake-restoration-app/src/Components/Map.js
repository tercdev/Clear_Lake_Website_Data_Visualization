import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './Map.css'

import { MapboxLegendControl } from "@watergis/mapbox-gl-legend";
import '@watergis/mapbox-gl-legend/css/styles.css';

/**
 * Mapbox Access Token with URL restrictions created at https://www.mapbox.com/
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbmFsaSIsImEiOiJjbDBqY2V2bGowYjlrM2NtaXhjYzlyM2pxIn0.BxtrB0AyBeGd8lug5c6mUg';

/**
 * Component for showing mapbox map.
 * 
 * @component
 * @param {String} name type of map: "stream", "met", "lake", "all"
 * @returns {JSX.Element} Map Component template
 * 
 * https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
 */
export default function Map(props) {
    // set default state
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-122.8);
    const [lat, setLat] = useState(39.06);
    const [zoom, setZoom] = useState(10.5);

    /**
     * Add Stream Markers onto the Map.
     * 
     * Geographic locations are formated as geoJSON files found in /public/data.
     * 
     * https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addsource
     * https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer
     */
    function addStreamMarkers() {
        map.current.on('load', () => {
            map.current.addSource('streams', {
                type: 'geojson',
                data: '/Clear_Lake_Website_Data_Visualization/data/streammarkers.geojson',
            });
            map.current.addLayer({
                id: 'streams',
                source: 'streams',
                type: 'circle',
                paint: {
                    'circle-color': '#FF7F50',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
                metadata: {
                    "name": "Stream Monitoring Sites"
                }
            });
            addEventsForMarkers('streams')
        });
    }

    /**
     * Add mouseenter, mouseleave, click events to the markers
     * 
     * @param {String} layerid Id of the layer in which the markers are on
     */
    function addEventsForMarkers(layerid) {
        map.current.on("mouseenter", layerid, e => {
            if (e.features.length) {
                map.current.getCanvas().style.cursor = "pointer";
            }
        });
        map.current.on("mouseleave", layerid, () => {
            map.current.getCanvas().style.cursor = "";
        });
        map.current.on("click", layerid, e => {
            createPopUp(e, layerid);
            map.current.flyTo({
                center: e.features[0].geometry.coordinates,
                speed: 0.2,
                curve: 1,
                zoom: 10.5
            });
        });
    }

    /**
     * Create a popup and add to the map
     * 
     * @param {*} e 
     * @param {String} layerid Id of the layer in which the markers are on
     * 
     * https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
     */
    function createPopUp(e, layerid) {
        if (e.features.length) {
            // Change the cursor style as a UI indicator.
            map.current.getCanvas().style.cursor = "pointer";
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            const description = contentOfPopUp(layerid, e.features[0].properties.name)
            // Create a popup, populate the popup, set coordinates, add to map
            new mapboxgl.Popup({focusAfterOpen: false, closeButton: true, closeOnMove: false, closeOnClick: true}).setLngLat(coordinates).setHTML(description).addTo(map.current)
        }
    }

    /**
     * Create HTML content that will populate the Pop up
     * 
     * @param {String} layerid Id of the layer in which the markers are on
     * @param {String} abbr Abbreviation of the name of the location in geoJSON
     * @returns {String} String containing the HTML that will go in the Pop up
     */
    function contentOfPopUp(layerid, abbr) {
        /**
         * HTML that will be in the Pop up. Links reload the top frame.
         */
        let contents = ''
        /**
         * Full name of the location
         */
        let description = ""
        /**
         * Additional info
         */
        let note = ""
        if (layerid === 'streams') {
            description = abbr.charAt(0).toUpperCase() + abbr.slice(1) + " Creek"
            contents = "<a href='/Clear_Lake_Website_Data_Visualization/" + abbr + "' target='_top'>" + description + "</a>"                    
        } else if (layerid === 'met') {
            if (abbr === "bkp") {
                description = "Buckingham Point";
            } else if (abbr === "nic") {
                description = "Nice"
            } else if (abbr === "nlp") {
                description = "North Lakeport"
            } else if (abbr === "bvr") {
                description = "Big Valley Rancheria"
            } else if (abbr === "knb") {
                description = "Konocti Bay"
            } else if (abbr === "clo") {
                description = "Clearlake Oaks"
            } else if (abbr === "jgb") {
                description = "Jago Bay"
                note = "<br/>(relocated to <a href='/Clear_Lake_Website_Data_Visualization/bek target='_top''>Beakbane Island</a> in June 2020)"
                contents = description + note
            } else {
                description = "Beakbane Island"
            }
            if (abbr !== 'jgb') {
                contents = "<a href='/Clear_Lake_Website_Data_Visualization/" + abbr + "' target='_top'>" + description + "</a>" + note                
            }
        } else if (layerid === 'lake') {
            description = abbr.slice(0,2).toUpperCase() + '-' + abbr.slice(2).toUpperCase()
            if (abbr === "ua07") {
                note = " (discontinued on 6/15/2020)"
            }
            contents = "<b>"+ description + "</b><br/><a href='/Clear_Lake_Website_Data_Visualization/" + abbr 
                + "' target='_top'> Lake Mooring</a>"+ note +"<br/><a href='/Clear_Lake_Website_Data_Visualization/" 
                + abbr + "-profile' target='_top'>Lake Profile</a>"
        }
         return contents
    }

    /**
     * Close a popup.
     */
    function closePopUp() {
        const popup = document.getElementsByClassName('mapboxgl-popup');
        if (popup.length) {
            popup[0].remove();
        }
    }

    /**
     * Add Meteorology Markers on the Map
     */
    function addMetMarkers() {
        map.current.on('load', () => {
            map.current.addSource('met', {
                type: 'geojson',
                data: '/Clear_Lake_Website_Data_Visualization/data/metmarkers.geojson',
            });
            map.current.addLayer({
                id: 'met',
                source: 'met',
                type: 'circle',
                paint: {
                    'circle-color': '#FF4162',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
                metadata: {
                    name: "Meteorological Stations",
                }
            });
            addEventsForMarkers('met')
        });
    }

    /**
     * Add Lake Markers on the Map
     */
    function addLakeMarkers() {
        map.current.on('load', () => {
            map.current.addSource('lake', {
                type: 'geojson',
                data: '/Clear_Lake_Website_Data_Visualization/data/lakemarkers.geojson',
            });
            map.current.addLayer({
                id: 'lake',
                source: 'lake',
                type: 'circle',
                paint: {
                    'circle-color': '#F2E50B',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
                metadata: {
                    "name": "Lake Monitoring Sites",
                }
            });
            addEventsForMarkers('lake');
        });
    }

    /**
     *  Add Clear Lake Watershed Boundary on the Map
     */
    function addBoundary() {
        map.current.on("load", () => {
            map.current.addSource('boundary', {
                type: 'geojson',
                data: '/Clear_Lake_Website_Data_Visualization/data/watershedboundary.geojson'
            })
            map.current.addLayer({
                id: 'bounds_line',
                source: 'boundary',
                type: 'line',
                metadata: {
                    "name": "Clear Lake Watershed Boundary Line"
                }
            },'waterway-label')
        })
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        /**
         * Initialize the Map
         * 
         * https://docs.mapbox.com/mapbox-gl-js/api/map/
         */
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
            minZoom: 9,
            maxBounds: [[-124.53, 36.94], [-120, 42.0]]
        });
        /**
         * Elements that will be added to the legend.
         * 
         * `id_of_the_layer`: `name_to_appear_in_the_legend`
         */
        let targets = {}
        /**
         * Add markers to the map depending on the props.name parameter
         */
        if (props.name === "stream") {
            addStreamMarkers();
            targets.streams = "Stream Monitoring Sites"
        }
        if (props.name === "met") {
            addMetMarkers();
            targets.met = "Meteorological Stations"
        }
        if (props.name === "lake") {
            addLakeMarkers();
            targets.lake = "Lake Monitoring Sites"
        }
        if (props.name === "all") {
            addStreamMarkers();
            addMetMarkers();
            addLakeMarkers();
            addBoundary();
            targets.streams = "Stream Monitoring Sites"
            targets.met = "Meteorological Stations"
            targets.lake = "Lake Monitoring Sites"
            targets.bounds_line = "Watershed Boundary"
        }
        /**
         * Legend for the map.
         * 
         * https://github.com/watergis/mapbox-gl-legend
         */
        const legend = new MapboxLegendControl(targets, {accesstoken: mapboxgl.accessToken})
        map.current.addControl(legend, 'bottom-left');
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        /**
         * Update Longitude, Latitude, Zoom as the map gets moved around
         */
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
    <div className="map">
        <p className='map-caption'>Click on the markers to see the name of the location. Click on the link in the pop up to be go to a page with the corresponding visualizations.</p>
        
        <div ref={mapContainer} className="map-container" />
        <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
    </div>
    );
}

