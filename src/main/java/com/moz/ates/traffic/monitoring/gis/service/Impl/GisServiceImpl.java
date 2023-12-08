package com.moz.ates.traffic.monitoring.gis.service.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moz.ates.traffic.common.entity.common.AccidentDomain;
import com.moz.ates.traffic.common.entity.common.EnforcementDomain;
import com.moz.ates.traffic.common.repository.common.GisRepository;
import com.moz.ates.traffic.monitoring.gis.service.GisService;

@Service
public class GisServiceImpl implements GisService{

	@Autowired
	GisRepository gisRepository;
	
	@Override
	public List<AccidentDomain> getAccidentList() {
		return gisRepository.selectAccidentListForMonitoring();
	}

	@Override
	public List<EnforcementDomain> getEnforcementList() {
		return gisRepository.selectEnforcementListForMonitoring();
	}



}
