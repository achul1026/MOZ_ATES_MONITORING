package com.moz.ates.traffic.monitoring.api.service;

import com.moz.ates.traffic.common.repository.monitoring.MonitoringMapRepository;
import com.moz.ates.traffic.monitoring.api.dto.FeaturesLayerDTO;
import com.moz.ates.traffic.monitoring.api.dto.GeoJsonDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApiMapService {

	final private MonitoringMapRepository monitoringMapRepository;
	
	public FeaturesLayerDTO getEquipmentSource(Map<String, String> param) {
		FeaturesLayerDTO featuresLayerDTO = new FeaturesLayerDTO();
		List<GeoJsonDTO.FeaturesDTO> featuresList = new ArrayList<>();
		List<Map<String, Object>> equipmentList = monitoringMapRepository.findAllEquipmentByEquipmentTy(param);
		return getFeaturesLayerDTO(featuresLayerDTO, featuresList, equipmentList);
	}
	
	public FeaturesLayerDTO getFacilitySource(Map<String, String> param){
		FeaturesLayerDTO featuresLayerDTO = new FeaturesLayerDTO();
		List<GeoJsonDTO.FeaturesDTO> featuresList = new ArrayList<>();
		List<Map<String, Object>> facilityList = monitoringMapRepository.findAllFacilityByFacilityTy(param);
		return getFeaturesLayerDTO(featuresLayerDTO, featuresList, facilityList);
	}

	public FeaturesLayerDTO getOrganizationGeoJson(Map<String, String> param) {
		FeaturesLayerDTO featuresLayerDTO = new FeaturesLayerDTO();
		List<GeoJsonDTO.FeaturesDTO> featuresList = new ArrayList<>();
		List<Map<String, Object>> facilityList = monitoringMapRepository.findAllFacilityByFacilityTy(param);
		return getFeaturesLayerDTO(featuresLayerDTO, featuresList, facilityList);
	}

	public FeaturesLayerDTO getEnforcementList(Map<String, String> param) {
		FeaturesLayerDTO featuresLayerDTO = new FeaturesLayerDTO();
		List<GeoJsonDTO.FeaturesDTO> featuresList = new ArrayList<>();
		List<Map<String, Object>> enforcementList = monitoringMapRepository.findAllEnforcementByDate(param);
		return getFeaturesLayerDTO(featuresLayerDTO, featuresList, enforcementList);
	}

	public FeaturesLayerDTO getAccidentList(Map<String, String> param) {
		FeaturesLayerDTO featuresLayerDTO = new FeaturesLayerDTO();
		List<GeoJsonDTO.FeaturesDTO> featuresList = new ArrayList<>();
		List<Map<String, Object>> accidentList = monitoringMapRepository.findAllAccidentByDate(param);
		return getFeaturesLayerDTO(featuresLayerDTO, featuresList, accidentList);
	}

	public FeaturesLayerDTO getAccidentRecentlyList(Map<String, String> param) {
		FeaturesLayerDTO featuresLayerDTO = new FeaturesLayerDTO();
		List<GeoJsonDTO.FeaturesDTO> featuresList = new ArrayList<>();
		List<Map<String, Object>> accidentList = monitoringMapRepository.findAccidentListRecentlyLimit10(param);
		return getFeaturesLayerDTO(featuresLayerDTO, featuresList, accidentList);
	}

	private FeaturesLayerDTO getFeaturesLayerDTO(FeaturesLayerDTO featuresLayerDTO, List<GeoJsonDTO.FeaturesDTO> featuresList, List<Map<String, Object>> facilityList) {
		facilityList.forEach(map -> {
			GeoJsonDTO.FeaturesDTO featuresDomain = new GeoJsonDTO.FeaturesDTO();
			GeoJsonDTO.GeometryDTO geometryDomain = new GeoJsonDTO.GeometryDTO();
			geometryDomain.setType("Point");
			geometryDomain.setLng(Double.parseDouble((String) map.get("LNG")));
			geometryDomain.setLat(Double.parseDouble((String) map.get("LAT")));

			featuresDomain.setGeometry(geometryDomain);
			featuresDomain.setProperties(map);
			featuresList.add(featuresDomain);
		});
		featuresLayerDTO.setFeatures(featuresList);
		return featuresLayerDTO;
	}

}
