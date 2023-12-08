package com.moz.ates.traffic.monitoring.gis.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeaturesLayerDTO extends GeoJsonDTO implements GeoJsonInterface {

    @JsonIgnore
    private GeometryDTO geometry;

    @JsonIgnore
    private PropertiesDTO properties;

    public FeaturesLayerDTO() {
        super();
        this.setType("FeatureCollection");
    }
}
