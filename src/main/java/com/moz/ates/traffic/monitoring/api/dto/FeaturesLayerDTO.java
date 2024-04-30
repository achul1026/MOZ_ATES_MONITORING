package com.moz.ates.traffic.monitoring.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class FeaturesLayerDTO extends GeoJsonDTO implements GeoJsonInterface {

    @JsonIgnore
    private GeometryDTO geometry;

    @JsonIgnore
    private Map<String,Object> properties;

    public FeaturesLayerDTO() {
        super();
        this.setType("FeatureCollection");
    }
}
