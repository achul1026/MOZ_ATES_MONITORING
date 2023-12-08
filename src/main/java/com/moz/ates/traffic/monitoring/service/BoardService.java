package com.moz.ates.traffic.monitoring.service;

import java.util.List;

import com.moz.ates.traffic.common.entity.accident.MozTfcAcdntMaster;
import com.moz.ates.traffic.common.entity.enforcement.MozTfcEnfMaster;

public interface BoardService {

	public List<MozTfcAcdntMaster> getAcdntList(MozTfcAcdntMaster tfcAcdntMaster);

	public List<MozTfcEnfMaster> getEnfList(MozTfcEnfMaster tfcEnfMaster);


}
