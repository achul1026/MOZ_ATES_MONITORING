package com.moz.ates.traffic.monitoring.gis.controller;

import com.moz.ates.traffic.common.entity.common.AccidentDomain;
import com.moz.ates.traffic.common.entity.common.EnforcementDomain;
import com.moz.ates.traffic.monitoring.gis.dto.FeaturesLayerDTO;
import com.moz.ates.traffic.monitoring.gis.dto.GeoJsonDTO;
import com.moz.ates.traffic.monitoring.gis.service.GisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

@Controller
@RequestMapping(value="/gis/v1/")
public class GisController {
	@Autowired
	private GisService gisService;
		
	@RequestMapping(value="/moz_accident.geojson")
    public ResponseEntity<?> getAccidentData(){
        FeaturesLayerDTO featuresLayerDomain = new FeaturesLayerDTO();
        List<GeoJsonDTO.FeaturesDTO> featuresList = new ArrayList<>();
        List<AccidentDomain> accidentList = gisService.getAccidentList();
        accidentList.stream().forEach(new Consumer<AccidentDomain>() {
        	@Override
        	public void accept(AccidentDomain map) {
                if(map.getLat() != null && map.getLng() != null) {
                    GeoJsonDTO.FeaturesDTO featuresDomain = new GeoJsonDTO.FeaturesDTO();

                    GeoJsonDTO.GeometryDTO geometryDomain = new GeoJsonDTO.GeometryDTO();
                    geometryDomain.setType("Point");
                    geometryDomain.setLng(map.getLngDouble());
                    geometryDomain.setLat(map.getLatDouble());

                    featuresDomain.setGeometry(geometryDomain);

                    GeoJsonDTO.PropertiesDTO properties = new GeoJsonDTO.PropertiesDTO();
                    properties.setName(map.getTfcAcdntId());
                    properties.setPlace(map.getRoadAddr());
                    featuresDomain.setProperties(properties);
                    featuresList.add(featuresDomain);
                }
        	}
		});
        featuresLayerDomain.setFeatures(featuresList);
        return new ResponseEntity<FeaturesLayerDTO>(featuresLayerDomain, HttpStatus.OK);
    }
	@RequestMapping(value="/moz_enforcement.geojson")
    public ResponseEntity<?> getEnforcementData(){
        FeaturesLayerDTO featuresLayerDomain = new FeaturesLayerDTO();
        List<GeoJsonDTO.FeaturesDTO> featuresList = new ArrayList<>();
        List<EnforcementDomain> enforcementList = gisService.getEnforcementList();
        enforcementList.stream().forEach(new Consumer<EnforcementDomain>() {
        	@Override
        	public void accept(EnforcementDomain map) {
                if(map.getLat() != null && map.getLng() != null) {
                    GeoJsonDTO.FeaturesDTO featuresDomain = new GeoJsonDTO.FeaturesDTO();

                    GeoJsonDTO.GeometryDTO geometryDomain = new GeoJsonDTO.GeometryDTO();
                    geometryDomain.setType("Point");
                    geometryDomain.setLng(map.getLngDouble());
                    geometryDomain.setLat(map.getLatDouble());

                    featuresDomain.setGeometry(geometryDomain);

                    GeoJsonDTO.PropertiesDTO properties = new GeoJsonDTO.PropertiesDTO();
                    properties.setName(map.getTfcEnfId());
                    properties.setPlace(map.getRoadAddr());
                    featuresDomain.setProperties(properties);
                    featuresList.add(featuresDomain);
                }
        	}
		});
        featuresLayerDomain.setFeatures(featuresList);
        return new ResponseEntity<FeaturesLayerDTO>(featuresLayerDomain, HttpStatus.OK);
    }
}
