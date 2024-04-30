import Env from "./env.js";
import env from "./env.js";
/**
 * MozAtes Map Core js
 * @param elementId
 * @param center_lng
 * @param center_lat
 * @param loadedGeoCodeCallback
 * @param useGeoLocation
 * @param isInitDrawCenterMarker
 * @returns {MozAtesMap}
 * @constructor
 */
const MozAtesMap = function(elementId){
    "use strict"

    const _core = this;
    const _pbkey = "pk.eyJ1IjoiZGVzaW1pbjIiLCJhIjoiY2xvbzMwN2t3Mm52dzJrcXR6em5lZ3hmMyJ9.pu7IdtCJVHme2QXzu4sT7w";
    let _center = [32.545187854883096, -25.928567787685097];
    let _map = null;
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth : "none"
    });

    this.enforcementInterval = null;
    this.accidentInterval = null;

    let loadSource = async function(){
        for(const icon of Env.icons) {
            await _map.loadImage(icon.url, function(err, image){
                if(icon.sdf === true) {
                    _map.addImage(icon.id, image, {sdf : true});
                }else{
                    _map.addImage(icon.id, image);
                }
            });
        }
    }
    function forwardGeocoder(query) {
        const matchingFeatures = [];
        for (const feature of _core.facility.geoJson.features) {
            // Handle queries with different capitalization
            // than the source data by calling toLowerCase().
            if (
                feature.properties.FACILITY_NM
                    .toLowerCase()
                    .includes(query.toLowerCase())

            ) {
                // Add a tree emoji as a prefix for custom
                // data results using carmen geojson format:
                // https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
                feature['name'] = `[${feature.properties.CD_NM}]${feature.properties.FACILITY_NM}`;
                feature['place_name'] = `[${feature.properties.CD_NM}]${feature.properties.FACILITY_NM}`;
                feature['text'] = `${feature.properties.CD_NM}`;
                feature['country'] = `${feature.properties.ROAD_ADDR}`;
                feature['center'] = feature.geometry.coordinates;
                feature['place_type'] = ['park'];
                matchingFeatures.push(feature);
            }
        }
        return matchingFeatures;
    }
    _core.removeSource = function(sourceId){
        let layers = _map.getStyle().layers.filter((obj) => obj.source === sourceId);
        for(const layer of layers) {
            if(_map.getLayer(layer.id))
                _map.removeLayer(layer.id);
        }
        _map.removeSource(sourceId);
    }

    _core.init = function(){
        const element = document.getElementById(elementId);
        if(!element) {
            alert("Not found element.");
            return;
        }
        mapboxgl.accessToken = _pbkey;
        window.mbox = _map = new mapboxgl.Map({
            container: elementId, // container ID
            style: 'mapbox://styles/mapbox/dark-v11', // style URL
            center: _center, // starting position [lng, lat]
            zoom: 12, // starting zoom
        });

        const geocoder = new MapboxGeocoder({
            accessToken: _pbkey,
            localGeocoder : forwardGeocoder,
            localGeocoderOnly : true,
            mapboxgl: mapboxgl,
            placeholder : "Search facilities"
        });
        _map.addControl(geocoder);
        _map.addControl(new mapboxgl.NavigationControl());
        loadSource().then();
        _map.on('load', function() {
            _core.facility = new Facility();

            _core.facility.getSource().then(()=>{
                _core.facility.drawFacility('TFT001');
                _core.facility.drawFacility('TFT002');
                _core.facility.drawFacility('TFT003');
                _core.facility.drawFacility('TFT004');
                _core.facility.drawFacility('TFT005');
                _core.facility.drawFacility('TFT006');
            });

            _core.enforcement = new Enforcement();
            // _core.enforcementInterval = _core.enforcement.doInterval();
            _core.accident = new Accident();
            // _core.accidentInterval = _core.accident.doInterval();
            _core.warning = new Warning();
            _core.warning.doInterval();
        });
        
    }
    _core.drawCluster = function(geoJSON,sourceName,layerName,key,pointColor){
        if(_map.getSource(sourceName)){
            _map.getSource(sourceName).setData(geoJSON);
        }else{
            const clusterOption = {
                cluster : true,
                clusterRadius: 35,
                clusterProperties: {
                    'total': ["+", ["get", key]],
                },
                tolerance : 0.5
            }
            let clusterData = Object.assign({
                type : "geojson",
                data : geoJSON
            },clusterOption);
            _map.addSource(sourceName, clusterData);
        }
        if(typeof _map.getLayer(layerName+"_CLUSTER") !== "undefined") return;
        let clusterLayer = {
            id: layerName+"_CLUSTER",
            type: 'circle',
            source: sourceName,
            paint: {
                'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'total'],
                    0, '#51bbd6',
                    100, '#ec1346',
                ],
                'circle-radius': 35,
                'circle-opacity' : 0.8,
                'circle-stroke-color' : pointColor,
                'circle-stroke-width' : 2
            },
            filter : ['has', 'point_count']
        }
        let clusterTextLayer = {
            id: layerName+"_CLUSTER_TEXT",
            type: 'symbol',
            source: sourceName,
            layout: {
                'text-allow-overlap' : true,
                'text-field': ['number-format',['get', 'total'],{locale:'en'}],
                'text-size': 14
            },
            filter : ['has', 'point_count']
        }
        let unClusterLayer = {
            id: layerName+"_UNCLUSTER",
            type: 'circle',
            source: sourceName,
            paint: {
                'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', key],
                    0, '#51bbd6',
                    100, '#ec1346',
                ],
                'circle-radius': 20,
                'circle-opacity' : 0.8,
                'circle-stroke-color' : pointColor,
                'circle-stroke-width' : 2
            },
            'filter': ['!=', 'cluster', true]
        }
        let unclusterTextLayer = {
            id: layerName+"_UNCLUSTER_TEXT",
            type: 'symbol',
            source: sourceName,
            layout: {
                'text-allow-overlap' : true,
                'text-field': ['number-format',['get', key],{locale:'en'}],
                'text-size': 10
            },
            'filter': ['!=', 'cluster', true]
        }

        _map.addLayer(clusterLayer);
        _map.addLayer(clusterTextLayer);
        _map.addLayer(unClusterLayer);
        _map.addLayer(unclusterTextLayer);

    }
    _core.drawHeatmap = function(geoJSON,sourceName,layerName,key){
        if(_map.getSource(sourceName)){
            _map.getSource(sourceName).setData(geoJSON);
        }else{
            _map.addSource(sourceName, {
                type : "geojson",
                data : geoJSON
            });
        }
        if(typeof _map.getLayer(layerName+"_HEATMAP") !== "undefined") return;
        let heatmapLayer = {
            'id': layerName+"_HEATMAP",
            'type': 'heatmap',
            'source': sourceName,
            'paint': {
                'heatmap-weight': [
                    'interpolate',
                    ['linear'],
                    ["get",key],
                    0, 0,
                    10, 1,
                ],
                // 줌 level 강도
                'heatmap-intensity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    3,
                    9,
                    8
                ],
                // 밀도에 따라 색상값 할당
                'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0,
                    'rgba(33,102,172,0)',
                    0.2,
                    'rgb(103,169,207)',
                    0.4,
                    'rgb(209,229,240)',
                    0.6,
                    'rgb(253,219,199)',
                    0.8,
                    'rgb(239,138,98)',
                    1,
                    'rgb(178,24,43)'
                ],
                // 줌에 맞게 크기 변경
                'heatmap-radius':[
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    10,
                    9,
                    20
                ],
                // 줌에 맞게 투명도 조절
                'heatmap-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    1,
                    9,
                    1,
                    13,
                    0.7
                ]
            }
        }
        let circleLayer = {
            'id': layerName+"_HEATMAP_CIRCLE",
            'type': 'circle',
            'source': sourceName,
            'minzoom': 13,
            'paint': {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    ['interpolate', ['linear'], ['get', key], 1, 1, 6, 1],
                    16,
                    ['interpolate', ['linear'], ['get', key], 1, 2, 6, 5]
                ],
                'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', key],
                    1,
                    'rgba(33,102,172,0)',
                    2,
                    'rgb(103,169,207)',
                    3,
                    'rgb(209,229,240)',
                    4,
                    'rgb(253,219,199)',
                    5,
                    'rgb(239,138,98)',
                    6,
                    'rgb(178,24,43)'
                ],
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7,
                    0,
                    8,
                    1
                ]
            }
        }
        _map.addLayer(heatmapLayer);
        _map.addLayer(circleLayer);
    }
    _core.drawIcon = function(icon, sourceName,layerName, filter, callback){
        if(typeof _map.getLayer(layerName) !== "undefined") return;
        let obj = {
            'id': layerName,
            'type': 'symbol',
            'source': sourceName,
            'maxzoom': 22,
            'minzoom': 9,
            'layout': {
                'visibility' : "visible",
                'icon-allow-overlap': true,
                'icon-image': icon,
                "icon-size": [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10, 0.3,
                    15, 0.55
                ]
            }
        }
        if(filter){
            obj.filter = filter;
        }
        _map.addLayer(obj);
        if(typeof callback === 'function') typeof callback(obj);
    }
    _core.toggleLayer = function(layer){
        if(!_map.getLayer(layer)){
            return false;
        }
        if(_map.getLayer(layer))
            if(_map.getLayoutProperty(layer, 'visibility') === "none"){
                _map.setLayoutProperty(layer, 'visibility', 'visible');
            }else{
                _map.setLayoutProperty(layer, 'visibility', 'none');
            }
    }
    _core.hideLayer = function(layer){
        _map.setLayoutProperty(layer, 'visibility', 'none');
    }
    _core.drawMarker = function(lngLat){
        return new mapboxgl.Marker({ color: 'red'})
            .setLngLat(lngLat)
            .addTo(_map);
    }
    _core.init();
    class Enforcement{
        startDate = null;
        endDate = null;

        async getSource(){
            let url = '/api/map/enforcement';
            if(this.startDate && this.endDate){
                url = url+ `?startDate=${this.startDate}&endDate=${this.endDate}`;
            }
            await fetch(url, {})
                .then((response) => {
                    return response.json()
                })
                .then((geoJson)=>{
                    this.geoJson = geoJson;
                })
                .catch((err)=>{
                    console.error(err);
                    // alert("An error occurred while retrieving traffic enforcement information. Please contact the administrator");
                    if(_core.enforcementInterval) clearInterval(_core.enforcementInterval);
                })
        }
        doInterval(time = 10*1000) {
            let _d = this;
            if(_core.enforcementInterval) clearInterval(_core.enforcementInterval);
            this.getSource().then(()=>{
                _d.drawCluster();
            })
            return _core.enforcementInterval = setInterval(()=>{
                this.getSource().then(()=>{
                    _d.drawCluster();
                })
            },time);
        }
        removeData (){
            _core.removeSource(Env.source.enforcement)
        }
        drawCluster() {
            _core.drawCluster(this.geoJson, Env.source.enforcement,Env.layer.enforcement,"CNT", "#ff8500");
        }
    }
    class Accident{
        startDate = null;
        endDate = null;
        async getSource(){
            let url = '/api/map/accident';
            if(this.startDate && this.endDate){
                url = url+ `?startDate=${this.startDate}&endDate=${this.endDate}`;
            }
            await fetch(url, {})
                .then((response) => {
                    return response.json()
                })
                .then((geoJson)=>{
                    this.geoJson = geoJson;
                })
                .catch((err)=>{
                    console.error(err);
                    // alert("An error occurred while retrieving accident information. Please contact the administrator");
                    if(_core.accidentInterval) clearInterval(_core.accidentInterval);
                })
        }
        doInterval(time = 10*1000) {
            let _d = this;
            if(_core.accidentInterval) clearInterval(_core.accidentInterval);
            this.getSource().then(()=>{
                _d.drawCluster();
            })
            return _core.accidentInterval = setInterval(()=>{
                this.getSource().then(()=>{
                    _d.drawCluster();
                })
            },time);
        }
        removeData (){
            _core.removeSource(Env.source.accident)
        }
        drawCluster() {
            _core.drawCluster(this.geoJson, Env.source.accident,Env.layer.accident,"ACDNT_PNR_CNT", "#f13131");
        }
        drawHeatmap() {
            _core.drawHeatmap(this.geoJson, Env.source.accident,Env.layer.accident,"ACDNT_PNR_CNT");
        }
    }
    class Warning {
        async getSource() {
            await fetch("/api/map/warning", {})
                .then((response) => {
                    return response.json()
                })
                .then((geoJson)=>{
                    this.geoJson = geoJson;
                    if(_map.getSource(Env.source.warning)){
                        _map.getSource(Env.source.warning).setData(geoJson);
                    }else{
                        _map.addSource(Env.source.warning, {
                            type : "geojson",
                            data : geoJson
                        });
                    }
                })
                .catch((err)=>{
                    console.error(err);
                    // alert("An error occurred while retrieving warning information. Please contact the administrator");
                })
        }
        doInterval(time = 10*1000) {
            let _d = this;
            if(_core.warningInterval) clearInterval(_core.warningInterval);
            this.getSource().then(()=>{
                _d.drawWarning();
            })
            return _core.warningInterval = setInterval(()=>{
                this.getSource().then(()=>{
                    _d.drawWarning();
                })
            },time);
        }
        drawWarning = function(){
            const _this = this;
            _core.drawIcon("WARN_ACCIDENT",env.source.warning,env.layer.warning, null, function(...layerObj){
                for(const obj of layerObj){
                    _map.off("mouseenter",obj.id,_this.hoverEvent);
                    _map.off("mouseleave",obj.id,_this.leaveEvent);
                    _map.on("mouseenter",obj.id,_this.hoverEvent);
                    _map.on("mouseleave",obj.id,_this.leaveEvent);
                }
            });
        }
        hoverEvent(e) {
            _map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const prop = e.features[0].properties;

            const html = `
                <div class="text-gray-600 w-[300px]">
                    <div class="flex flex-row justify-between">
                        <p>Accident Ref ID</p>
                        <p>${prop.id}</p>
                    </div>
                    <div class="flex flex-row justify-between">
                        <p>Date</p>
                        <p>${prop.genDate}</p>
                    </div>
                    <div class="flex flex-row justify-between">
                        <p>Road</p>
                        <p>${prop.roadName}</p>
                    </div>
                </div>
            `
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(html).addTo(_map);
        }
        leaveEvent() {
            _map.getCanvas().style.cursor = '';
            popup.remove();
        }
    }
    class Facility{
        constructor() {

        }

        async getSource() {
            await fetch("/api/map/facility", {})
                .then((response) => {
                    return response.json()
                })
                .then((geoJson)=>{
                    this.geoJson = geoJson;
                    if(_map.getSource(Env.source.facility)){
                        _map.getSource(Env.source.facility).setData(geoJson);
                    }else{
                        _map.addSource(Env.source.facility, {
                            type : "geojson",
                            data : geoJson
                        });
                    }
                })
                .catch((err)=>{
                    console.error(err);
                    // alert("An error occurred while retrieving facility information. Please contact the administrator");
                })
        }
        toggleFacilityLayer = function(typeCode) {
            _core.toggleLayer(env.layer.facility+"_"+typeCode);
        }
        drawFacility = function(typeCode){
            const _this = this;
            _core.drawIcon(['get','CD_ID'],env.source.facility,env.layer.facility+"_"+typeCode, ['==','CD_ID',typeCode], function(...layerObj){
                for(const obj of layerObj){
                    _map.off("mouseenter",obj.id,_this.hoverEvent);
                    _map.off("mouseleave",obj.id,_this.leaveEvent);
                    _map.on("mouseenter",obj.id,_this.hoverEvent);
                    _map.on("mouseleave",obj.id,_this.leaveEvent);
                }
            });
        }
        hoverEvent(e) {
            _map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const prop = e.features[0].properties;

            const html = `
                <div class="text-gray-600 w-[200px]">
                    <div class="flex flex-row justify-between">
                        <p>Type</p>
                        <p>${prop.CD_NM}</p>
                    </div>
                    <div class="flex flex-row justify-between">
                        <p>Name</p>
                        <p>${prop.FACILITY_NM}</p>
                    </div>
                    <div class="flex flex-row justify-between">
                        <p>Road</p>
                        <p>${prop.ROAD_ADDR}</p>
                    </div>
                    <div class="flex flex-row justify-between">
                        <p>Status</p>
                        <p>${prop.FACILITY_STTS === 'Y' ? 'Activate' : 'Deactivate'}</p>
                    </div>
                </div>
            `
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(html).addTo(_map);
        }
        leaveEvent() {
            _map.getCanvas().style.cursor = '';
            popup.remove();
        }
    }

    /* Util */
    _core.util = {
        
    }
    return _core;
};

(function Initialize(){
    window.map = new MozAtesMap("map");

    // map menu event;
    // const mapMenuToggleButton = document.getElementById("mapMenuToggleButton");
    // const mapMenuToggleTarget = document.getElementById("mapMenu");
    // mapMenuToggleButton.addEventListener("click", () => {
    //     mapMenuToggleButton.getElementsByTagName("svg")[0].classList.toggle("rotate-180");
    //     mapMenuToggleTarget.classList.toggle("-translate-x-full");
    //     document.getElementById("mapMenuContainer").classList.toggle("left-3");
    // });

    /*Enforcement Analysis */
    const enfAnalysisType = document.getElementById("enfAnalysisType");
    const enfAnalysisTypeTarget = document.getElementById("enfAnalysisForm");
    enfAnalysisType.addEventListener("change", function(){
        if(this.value === "period"){
            enfAnalysisTypeTarget.classList.remove("hidden");
        }else if (this.value === "none"){
            enfAnalysisTypeTarget.classList.add("hidden");
            if(map.enforcementInterval) clearInterval(map.enforcementInterval);
            map.enforcement.removeData();
        }else{
            enfAnalysisTypeTarget.classList.add("hidden");
            map.enforcement.startDate = null;
            map.enforcement.endDate = null;
            map.enforcement.doInterval();
        }
    });
    const enforcementAnalysisButton = document.getElementById("enforcementAnalysisButton");
    enforcementAnalysisButton.addEventListener("click",()=>{
        const startDateValue = document.getElementById("enfStartDate").value;
        const endDateValue = document.getElementById("enfEndDate").value;
        if(!startDateValue || !endDateValue) {
            alert("Require Start Date & End Date");
            return;
        }
        let startDate = new Date(startDateValue).toISOString().split('T')[0];
        let endDate = new Date(endDateValue).toISOString().split('T')[0];
        map.enforcement.startDate = startDate;
        map.enforcement.endDate = endDate
        map.enforcement.doInterval();
    });

    /*Accident Analysis */
    const acdntAnalysisType = document.getElementById("acdntAnalysisType");
    const acdntAnalysisTypeTarget = document.getElementById("acdntAnalysisForm");
    acdntAnalysisType.addEventListener("change", function(){
        if(this.value === "period"){
            acdntAnalysisTypeTarget.classList.remove("hidden");
        }else if (this.value === "none"){
            acdntAnalysisTypeTarget.classList.add("hidden");
            if(map.accidentInterval) clearInterval(map.accidentInterval);
            map.accident.removeData();
        }else{
            acdntAnalysisTypeTarget.classList.add("hidden");
            map.accident.startDate = null;
            map.accident.endDate = null;
            map.accident.doInterval();
        }
    });
    const accidentAnalysisButton = document.getElementById("acdntAnalysisButton");
    accidentAnalysisButton.addEventListener("click",()=>{
        const startDateValue = document.getElementById("acdntStartDate").value;
        const endDateValue = document.getElementById("acdntEndDate").value;
        if(!startDateValue || !endDateValue) {
            alert("Require Start Date & End Date");
            return;
        }
        let startDate = new Date(startDateValue).toISOString().split('T')[0];
        let endDate = new Date(endDateValue).toISOString().split('T')[0];
        map.accident.startDate = startDate;
        map.accident.endDate = endDate
        map.accident.doInterval();
    });

})()