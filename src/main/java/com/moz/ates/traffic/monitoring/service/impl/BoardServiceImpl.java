package com.moz.ates.traffic.monitoring.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.moz.ates.traffic.common.entity.accident.MozTfcAcdntMaster;
import com.moz.ates.traffic.common.entity.enforcement.MozTfcEnfMaster;
import com.moz.ates.traffic.common.repository.accident.MozTfcAcdntMasterRepository;
import com.moz.ates.traffic.common.repository.enforcement.MozTfcEnfMasterRepository;
import com.moz.ates.traffic.monitoring.service.BoardService;

@Service
public class BoardServiceImpl implements BoardService {
		
	@Autowired
	MozTfcAcdntMasterRepository tfcAcdntMasterRepository;
	
	@Autowired
	MozTfcEnfMasterRepository tfcEnfMasterRepository;
    @Override
    public List<MozTfcAcdntMaster> getAcdntList(MozTfcAcdntMaster tfcAcdntMaster)  {
    	return tfcAcdntMasterRepository.selectAcdntList(tfcAcdntMaster);
    }
    
    @Override
    public List<MozTfcEnfMaster> getEnfList(MozTfcEnfMaster tfcEnfMaster){
    	return tfcEnfMasterRepository.selectEnfList(tfcEnfMaster);
    }
}

