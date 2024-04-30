package com.moz.ates.traffic.monitoring.map.controller;

import com.moz.ates.traffic.monitoring.map.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value="/map")
@RequiredArgsConstructor
public class MapController {

	final private MapService mapService;

    /**
     * Show Only Statistics
     * @return
     */
    @GetMapping(value="")
    public ModelAndView showStatistics(){
        ModelAndView mav = new ModelAndView();
        mav.setViewName("views/dashboard/map");
        return mav;
    }
}
