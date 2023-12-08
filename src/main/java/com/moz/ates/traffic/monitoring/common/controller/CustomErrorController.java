package com.moz.ates.traffic.monitoring.common.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping(value="/error")
    public String handleError(){

        return "views/common/error_common";
    }
}
