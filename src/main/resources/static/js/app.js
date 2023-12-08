require([
    "esri/config",
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/Expand",
    "esri/widgets/Home"
    ], function (esriConfig, Map, FeatureLayer, GeoJSONLayer, MapView, Legend, Expand, Home) {
    esriConfig.apiKey = "AAPK19c36f2188c44aa2b033d5206bf35844z_92dWyvCtywOPdZB3x9gy4549eGEEsu3B0CB_ay6CBO1Ssr1orhf-PTBRX6CI00";

    // Configures clustering on the layer. A cluster radius
    // of 100px indicates an area comprising screen space 100px
    // in length from the center of the cluster

    const clusterConfig = {
        type: "cluster",
        clusterRadius: "100px",
        // {cluster_count} is an aggregate field containing
        // the number of features comprised by the cluster
        popupTemplate: {
            title: "Cluster summary",
            content: "This cluster represents {cluster_count} accidents.",
            fieldInfos: [{
                fieldName: "cluster_count",
                format: {
                    places: 0,
                    digitSeparator: true
                }
            }]
        },
        clusterMinSize: "24px",
        clusterMaxSize: "60px",
        labelingInfo: [{
            deconflictionStrategy: "none",
            labelExpressionInfo: {
                expression: "Text($feature.cluster_count, '#,###')"
            },
            symbol: {
                type: "text",
                color: "#004a5d",
                font: {
                    weight: "bold",
                    family: "Noto Sans",
                    size: "12px"
                }
            },
            labelPlacement: "center-center",
        }]
    };


    const accidentLayer = new GeoJSONLayer({
        title: "Accidents",
        url: "/gis/v1//moz_accident.geojson",
        copyright: "Mozambique",

        featureReduction: clusterConfig,
        popupTemplate: {
            title: "[Mozambique Accident] {place}",
            content: "Place :  {place}",
            fieldInfos: [
                {
                    fieldName: "time",
                    format: {
                        dateFormat: "short-date-short-time"
                    }
                }
            ]
        },
        renderer: {
            type: "simple",
            field: "mag",
            symbol: {
                type: "simple-marker",
                size: 4,
                color: "#69dcff",
                outline: {
                    color: "rgba(0, 139, 174, 0.5)",
                    width: 5
                }
            }
        }
    });
    
    const enforcementLayer = new GeoJSONLayer({
        title: "Enforcement",
        url: "/gis/v1//moz_enforcement.geojson",
        copyright: "Mozambique",

        featureReduction: clusterConfig,
        popupTemplate: {
            title: "[Mozambique Enforcement] {place}",
            content: "Location :  {place}",
            fieldInfos: [
                {
                    fieldName: "time",
                    format: {
                        dateFormat: "short-date-short-time"
                    }
                }
            ]
        },
        renderer: {
            type: "simple",
            field: "mag",
            symbol: {
                type: "simple-marker",
                size: 4,
                color: "#ff8c69",
                outline: {
                    color: "rgba(174, 45, 0, 0.5)",
                    width: 5
                }
            }
        }
    });

    const map = new Map({
        basemap : "gray-vector",
        layers: [accidentLayer,enforcementLayer]
    });

    const view = new MapView({
        container: "map",
        center: [32.5406432, -25.8962418], // Longitude, latitude
        zoom: 9, // Zoom level
        map: map
    });

    view.ui.add(new Home({
        view: view
    }), "top-left");
});