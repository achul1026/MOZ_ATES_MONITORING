package com.moz.ates.traffic.monitoring.gis.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public abstract class GeoJsonDTO {
    private String type = null;
    private List<FeaturesDTO> features = new ArrayList<FeaturesDTO>();
    private GeometryDTO geometry = new GeometryDTO();
    private PropertiesDTO properties = new PropertiesDTO();

    public GeoJsonDTO() {
    }

    @Getter
    @Setter
    public static class FeaturesDTO {
        private String type = "Feature";
        private PropertiesDTO properties = new PropertiesDTO();
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
    @Getter
    @Setter
    public static class PropertiesDTO {
        private String name = null;
        private String place = null;
    }
}
