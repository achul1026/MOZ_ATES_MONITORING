package com.moz.ates.traffic.monitoring.api.controller;


import com.moz.ates.traffic.monitoring.api.dto.*;
import com.moz.ates.traffic.monitoring.api.service.ApiStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Monitoring Statistics API Controller
 */
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class ApiStatisticsController {

    final private ApiStatisticsService statisticsService;

    /**
     *
     * @param startDate
     * @param endDate
     * @return
     */
    @GetMapping("/enforcement/countByType")
    public List<StatisticsDTO> getEnforcementCountByType(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate
    ){
        return statisticsService.getEnforcementCount();
    }

    @GetMapping("/enforcement/countByTypeAndTime")
    public List<StatisticsByTimeDTO> getEnforcementCountByTime(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "frequency", defaultValue = "daily") String frequency
    ){
        return statisticsService.getEnforcementCountByTime(frequency);
    }
    
    
    @GetMapping("/enforcement/listByRecently")
    public List<StatisticsEnforcementTableDTO> getEnforcementListRecently(
            @RequestParam(name = "startDate",required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate
    ){
        return statisticsService.getEnforcementListRecently();
    }


    /**
     * Accident api
     */


    @GetMapping("/accident/countByType")
    public List<StatisticsDTO> getAccidentCountByType(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate
    ){
        return statisticsService.getAccidentCount();
    }

    @GetMapping("/accident/countByTypeAndTime")
    public List<StatisticsByTimeDTO> getAccidentCountByTime(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "frequency", defaultValue = "daily") String frequency
    ){
        return statisticsService.getAccidentCountByTime(frequency);
    }


    @GetMapping("/accident/listByRecently")
    public List<StatisticsAccidentTableDTO> getAccidentListRecently(
            @RequestParam(name = "startDate",required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate
    ){
        return statisticsService.getAccidentListRecently();
    }

    @GetMapping("/fine")
    public List<StatisticsFineDTO> getFindStatistics(
            @RequestParam(name = "startDate",required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            @RequestParam(name = "ntcTy",required = false) String ntcTy
    ){
        Map<String,String> param = new HashMap<>();
        param.put("ntcTy",ntcTy);
        return statisticsService.getFineStatisticsByDate(param);
    }

    @GetMapping("/enforcementTypeMonthly")
    public List<StatisticsEnforcementTypeDTO> getEnforcementTypeMonthly(){
        return statisticsService.getEnforcementTypeMonthly();
    }


}
