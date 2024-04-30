package com.moz.ates.traffic.monitoring.statistics.controller;

import com.moz.ates.traffic.monitoring.statistics.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticsController {

	final private StatisticsService statisticsService;

	/**
	 * Show Only Statistics
	 * @return
	 */
	@GetMapping(value="")
	public ModelAndView showStatistics(){
		ModelAndView mav = new ModelAndView();
		mav.setViewName("views/dashboard/statistics");
		return mav;
	}
}
