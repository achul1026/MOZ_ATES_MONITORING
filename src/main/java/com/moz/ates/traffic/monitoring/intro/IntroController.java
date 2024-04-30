package com.moz.ates.traffic.monitoring.intro;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class IntroController {


	/**
	 * Show Integration Map & Statistics
	 * @return
	 */
	@GetMapping(value="/")
	public ModelAndView showSelectDisplayType(){
		ModelAndView mav = new ModelAndView();
		mav.setViewName("views/intro/intro");
		return mav;
	}

}
