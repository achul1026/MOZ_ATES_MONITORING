package com.moz.ates.traffic.monitoring.dashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.moz.ates.traffic.common.entity.accident.MozTfcAcdntMaster;
import com.moz.ates.traffic.common.entity.enforcement.MozTfcEnfMaster;
import com.moz.ates.traffic.monitoring.service.BoardService;

@Controller
public class DashboardController {

	@Autowired
    private BoardService boardService; 
	
	@RequestMapping(value="/")
	public ModelAndView list(MozTfcAcdntMaster tfcAcdntMaster, MozTfcEnfMaster tfcEnfMaster) throws Exception{
		List<MozTfcAcdntMaster> list = boardService.getAcdntList(tfcAcdntMaster);
		List<MozTfcEnfMaster> record = boardService.getEnfList(tfcEnfMaster);
		ModelAndView mav = new ModelAndView();
		mav.setViewName("views/dashboard/dashboard");
		mav.addObject("list",list);
		mav.addObject("record",record);
		return mav;
	}
}
