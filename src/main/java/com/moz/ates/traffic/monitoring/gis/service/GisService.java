package com.moz.ates.traffic.monitoring.gis.service;

import java.util.List;

import com.moz.ates.traffic.common.entity.common.AccidentDomain;
import com.moz.ates.traffic.common.entity.common.EnforcementDomain;

public interface GisService {
	public List<AccidentDomain> getAccidentList();

	public List<EnforcementDomain> getEnforcementList();
}
