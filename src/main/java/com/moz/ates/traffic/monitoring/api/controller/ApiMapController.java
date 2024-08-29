package com.moz.ates.traffic.monitoring.api.controller;

import com.moz.ates.traffic.monitoring.api.dto.FeaturesLayerDTO;
import com.moz.ates.traffic.monitoring.api.service.ApiMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
public class ApiMapController {

    final private ApiMapService apiMapService;

    @GetMapping("/equipment")
    public FeaturesLayerDTO getEquipmentSource(@RequestParam Map<String,String> param){
		param.put("eqpTy", "EQT001");
		param.put("useYn", "Y");
    	return apiMapService.getEquipmentSource(param);
    }
    
    @GetMapping("/facility")
    public FeaturesLayerDTO getFacilitySource(@RequestParam Map<String,String> param){
        return apiMapService.getFacilitySource(param);
    }

    @GetMapping(value = "/organization")
    public @ResponseBody
    FeaturesLayerDTO getOrganizationGeoJson(Map<String,String> param) {
        return apiMapService.getOrganizationGeoJson(param);
    }

    @GetMapping("/enforcement")
    public FeaturesLayerDTO getEnforcementSource(@RequestParam Map<String,String> param){
        return apiMapService.getEnforcementList(param);
    }

    @GetMapping("/accident")
    public FeaturesLayerDTO getAccidentSource(@RequestParam  Map<String,String> param){
        return apiMapService.getAccidentList(param);
    }

    @GetMapping("/warning")
    public FeaturesLayerDTO getWarning(@RequestParam  Map<String,String> param){
        return apiMapService.getAccidentRecentlyList(param);
    }

}
