import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import LegendControl from 'mapboxgl-legend';
import './Map.css'

import { MapboxLegendControl } from "@watergis/mapbox-gl-legend";
import '@watergis/mapbox-gl-legend/css/styles.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbmFsaSIsImEiOiJjbDBqY2V2bGowYjlrM2NtaXhjYzlyM2pxIn0.BxtrB0AyBeGd8lug5c6mUg';

/**
 * Component for showing mapbox map.
 * 
 * @component
 * @param {String} name type of map: "stream", "met", "lake", "all"
 * @returns {JSX.Element} Map Component template
 */
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
            map.current.on("mouseenter", "streams", e => {
                if (e.features.length) {
                    map.current.getCanvas().style.cursor = "pointer";
                }
                // streamPopUp(map,e);
            });
            map.current.on("mouseleave", "streams", () => {
                map.current.getCanvas().style.cursor = "";
                // closePopUp();
            });
            map.current.on("click", "streams", e => {
                console.log(e.features[0].properties.name);
                // window.top.location.href='/Clear_Lake_Website_Data_Visualization/'+e.features[0].properties.name;
                streamPopUp(map, e);
                map.current.flyTo({
                    center: e.features[0].geometry.coordinates,
                    speed: 0.2,
                    curve: 1,
                });
            });
        });
    }
    function closePopUp() {
        const popup = document.getElementsByClassName('mapboxgl-popup');
        if (popup.length) {
            popup[0].remove();
        }
    }
    function streamPopUp(map, e) {
        if (e.features.length) {
            map.current.getCanvas().style.cursor = "pointer";
            const coordinates = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            const description = e.features[0].properties.name.charAt(0).toUpperCase() + e.features[0].properties.name.slice(1) + " Creek"
            const link = "<a href='/Clear_Lake_Website_Data_Visualization/" + e.features[0].properties.name + "'>" + description + "</a>"                    
            new mapboxgl.Popup({focusAfterOpen: false, closeButton: true, closeOnMove: false, closeOnClick: false}).setLngLat(coordinates).setHTML(link).addTo(map.current)
        }
    }
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
            map.current.on("mouseenter", "met", e => {
                if (e.features.length) {
                    map.current.getCanvas().style.cursor = "pointer";
                }
                // metPopUp(map,e);
            });
            map.current.on("mouseleave", "met", () => {
                map.current.getCanvas().style.cursor = "";
                // closePopUp();
            });
            map.current.on("click", "met", e => {
                console.log(e.features[0].properties.name);
                // if (e.features[0].properties.name != "jgb") {
                //     window.top.location.href='/Clear_Lake_Website_Data_Visualization/'+e.features[0].properties.name;
                // } else {
                //     window.top.location.href='/Clear_Lake_Website_Data_Visualization/bek';
                // }
                // const link = "/" + e.features[0].properties.name
                // return <Link to={link}></Link>
                metPopUp(map,e);
                map.current.flyTo({
                    center: e.features[0].geometry.coordinates,
                    speed: 0.2,
                    curve: 1,
                });
            });
        });
    }
    function metPopUp(map,e) {
        if (e.features.length) {
            map.current.getCanvas().style.cursor = "pointer";
            const coordinates = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            let description = ""
            let url = e.features[0].properties.name
            let note = ""
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
                note = "<br/>(relocated to Beakbane Island in June 2020)"
                url = "bek"
            } else {
                description = "Beakbane Island"
            }
            // description = "<h1>" + description + "<h1/>"
            const link = "<a href='/Clear_Lake_Website_Data_Visualization/" + url + "'>" + description + "</a>" + note
            new mapboxgl.Popup({focusAfterOpen: false, closeButton: true, closeOnMove: false, closeOnClick: false}).setLngLat(coordinates).setHTML(link).addTo(map.current)
        }
    }
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
            map.current.on("mouseenter", "lake", e => {
                if (e.features.length) {
                    map.current.getCanvas().style.cursor = "pointer";
                }
                // lakePopUp(map,e);
            });
            map.current.on("mouseleave", "lake", () => {
                map.current.getCanvas().style.cursor = "";
                // closePopUp();
            });
            map.current.on("click", "lake", e => {
                console.log(e.features[0].properties.name);
                // window.top.location.href='/Clear_Lake_Website_Data_Visualization/'+e.features[0].properties.name;
                lakePopUp(map,e);
                map.current.flyTo({
                    center: e.features[0].geometry.coordinates,
                    speed: 0.2,
                    curve: 1,
                });
            });
        });
    }
    function lakePopUp(map,e) {
        if (e.features.length) {
            map.current.getCanvas().style.cursor = "pointer";
            const coordinates = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            const description = e.features[0].properties.name.slice(0,2).toUpperCase() + '-' + e.features[0].properties.name.slice(2).toUpperCase()
            let note = ""
            if (e.features[0].properties.name == "ua07") {
                note = " (discontinued on 6/15/2020)"
            }
            let link = "<b>"+description+"</b><br/><a href='/Clear_Lake_Website_Data_Visualization/" + e.features[0].properties.name + "'> Lake Mooring</a>"+ note +"<br/><a href='/Clear_Lake_Website_Data_Visualization/"+e.features[0].properties.name+"-profile'>Lake Profile</a>"
            new mapboxgl.Popup({focusAfterOpen: false, closeButton: true, closeOnMove: false, closeOnClick: false}).setLngLat(coordinates).setHTML(link).addTo(map.current)
        }
    }
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
                // layout, paint
                metadata: {
                    "name": "Clear Lake Watershed Boundary Line"
                }
            },'waterway-label')
        })
    }

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
            minZoom: 9,
            maxBounds: [[-124.53, 36.94], [-120, 42.0]]
        });
        let targets = {}
        if (props.name == "stream") {
            addStreamMarkers();
            targets.streams = "Stream Monitoring Sites"
        }
        if (props.name == "met") {
            addMetMarkers();
            targets.met = "Meteorological Stations"
        }
        if (props.name == "lake") {
            addLakeMarkers();
            targets.lake = "Lake Monitoring Sites"
        }
        if (props.name == "all") {
            addStreamMarkers();
            addMetMarkers();
            addLakeMarkers();
            addBoundary();
            targets.streams = "Stream Monitoring Sites"
            targets.met = "Meteorological Stations"
            targets.lake = "Lake Monitoring Sites"
            targets.bounds_line = "Watershed Boundary"
        }
        // const legend = new LegendControl({toggler: true, collapsed: true});
        const legend = new MapboxLegendControl(targets, {accesstoken: mapboxgl.accessToken})
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
        <p className='map-caption'>Click on the markers to see the name of the location. Click on the link in the pop up to be go to a page with the corresponding visualizations.</p>
        
        <div ref={mapContainer} className="map-container" />
        <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
    </div>
    );
}

