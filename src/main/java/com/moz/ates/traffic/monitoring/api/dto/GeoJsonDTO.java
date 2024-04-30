package com.moz.ates.traffic.monitoring.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public abstract class GeoJsonDTO {
    private String type = null;
    private List<FeaturesDTO> features = new ArrayList<FeaturesDTO>();
    private GeometryDTO geometry = new GeometryDTO();

    public GeoJsonDTO() {
    }

    @Getter
    @Setter
    public static class FeaturesDTO {
        private String type = "Feature";
        private Map<String,Object> properties = new HashMap<>();
        private GeometryDTO geometry = new GeometryDTO();
    }
    @Getter
    @Setter
    public static class GeometryDTO {
        private List<Double> coordinates = new ArrayList<>(2);
        private String type = null;

        @JsonIgnore
        private Double lng = null;

        @JsonIgnore
        private Double lat = null;
        public void setLat(Double lat){
            this.lat = lat;
            this.coordinates.add(1, lat);
        }
        public void setLng(Double lng){
            this.lng = lng;
            this.coordinates.add(0, lng);
        }
        

    }
}
