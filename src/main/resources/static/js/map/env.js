const Env = {
    icons : [
        {"url" : "/assets/map/facility_TFT001.png", "id" : "TFT001"},
        {"url" : "/assets/map/facility_TFT002.png", "id" : "TFT002"},
        {"url" : "/assets/map/facility_TFT003.png", "id" : "TFT003"},
        {"url" : "/assets/map/facility_TFT004.png", "id" : "TFT004"},
        {"url" : "/assets/map/facility_TFT006.png", "id" : "TFT006"},
        {"url" : "/assets/map/accident_001.png", "id" : "WARN_ACCIDENT"},
    ],
    source : {
        warning : "MOZ_ATES_WARNING",
        enforcement : "MOZ_ATES_ENFORCEMENT",
        accident : "MOZ_ATES_ACCIDENT",
        facility : "MOZ_ATES_FACILITY"
    },
    layer : {
        warning : "MOZ_ATES_WARNING",
        enforcement : "MOZ_ATES_ENFORCEMENT_LAYER",
        accident : "MOZ_ATES_ACCIDENT_LAYER",
        facility : "MOZ_ATES_FACILITY_LAYER"
    }
};
export default Env;