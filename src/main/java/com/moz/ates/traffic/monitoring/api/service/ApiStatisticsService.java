package com.moz.ates.traffic.monitoring.api.service;

import com.moz.ates.traffic.common.repository.monitoring.MonitoringStatisticsRepository;
import com.moz.ates.traffic.monitoring.api.dto.*;
import com.moz.ates.traffic.monitoring.common.util.BDStringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiStatisticsService {

    final private MonitoringStatisticsRepository monitoringStatisticsRepository;

    /**
     * Enforcement Pie Chart Data
     * @return
     */
    public List<StatisticsDTO> getEnforcementCount(){
        List<Map<String, Object>> resultToday = monitoringStatisticsRepository.findEnforcementCountByTypeFromToday();
        List<Map<String, Object>> resultYesterday = monitoringStatisticsRepository.findEnforcementCountByTypeFromYesterday();
        return getStatisticsDTOS(resultToday, resultYesterday);
    }

    /**
     * Enforcement Line Chart Data
     * @return
     */
    public List<StatisticsByTimeDTO> getEnforcementCountByTime(String frequency){
        List<Map<String, Object>> result = new ArrayList<>();
        switch (frequency) {
            case "yearly" :
                result = monitoringStatisticsRepository.findEnforcementCountByTypeAndTimeFromYearly();
                break;
            case "monthly" :
                result = monitoringStatisticsRepository.findEnforcementCountByTypeAndTimeFromMonthly();
                break;
            default:
                result = monitoringStatisticsRepository.findEnforcementCountByTypeAndTimeFromToday();
        }
        return getStatisticsByTimeDTOS(result);
    }


    /**
     * Enforcement Table List
     * @return
     */
    public List<StatisticsEnforcementTableDTO> getEnforcementListRecently(){
        List<Map<String, Object>> result = monitoringStatisticsRepository.findEnforcementListRecentlyLimit10();
        return result.stream().map(stringObjectMap -> {
            LocalDateTime genDate = (LocalDateTime) stringObjectMap.get("genDate");
            StatisticsEnforcementTableDTO statisticsDTO = new StatisticsEnforcementTableDTO();
            statisticsDTO.setDrvLcenId(BDStringUtils.parseObjectToString(stringObjectMap.get("drvLcenId"), "-"));
            statisticsDTO.setType(BDStringUtils.parseObjectToString(stringObjectMap.get("type"), ""));
            statisticsDTO.setGenDate(Timestamp.valueOf(genDate));
            statisticsDTO.setId(BDStringUtils.parseObjectToString(stringObjectMap.get("id"), ""));
            statisticsDTO.setName(BDStringUtils.parseObjectToString(stringObjectMap.get("name"), ""));
            statisticsDTO.setRoadName(BDStringUtils.parseObjectToString(stringObjectMap.get("roadName"),"-"));
            return statisticsDTO;
        }).collect(Collectors.toList());
    }

    /**
     * Accident Pie Chart Data
     * @return
     */
    public List<StatisticsDTO> getAccidentCount(){
        List<Map<String, Object>> resultToday = monitoringStatisticsRepository.findAccidentCountByTypeFromToday();
        List<Map<String, Object>> resultYesterday = monitoringStatisticsRepository.findAccidentCountByTypeFromYesterday();
        return getStatisticsDTOS(resultToday, resultYesterday);
    }

    /**
     * Accident Line Chart Data
     * @return
     */
    public List<StatisticsByTimeDTO> getAccidentCountByTime(String frequency) {
        List<Map<String, Object>> result = new ArrayList<>();
        switch (frequency) {
            case "yearly" :
                result = monitoringStatisticsRepository.findAccidentCountByTypeAndTimeFromYearly();
                break;
            case "monthly" :
                result = monitoringStatisticsRepository.findAccidentCountByTypeAndTimeFromMonthly();
                break;
            default:
                result = monitoringStatisticsRepository.findAccidentCountByTypeAndTimeFromToday();
        }
        return getStatisticsByTimeDTOS(result);
    }

    /**
     * Accident Table List
     * @return
     */
    public List<StatisticsAccidentTableDTO> getAccidentListRecently(){
        List<Map<String, Object>> result = monitoringStatisticsRepository.findAccidentListRecentlyLimit10();
        return result.stream().map(stringObjectMap -> {
            StatisticsAccidentTableDTO statisticsDTO = new StatisticsAccidentTableDTO();
            LocalDateTime genDate = (LocalDateTime) stringObjectMap.get("genDate");
            statisticsDTO.setPolLcenId(BDStringUtils.parseObjectToString(stringObjectMap.get("polLcenId"), "-"));
            statisticsDTO.setType(BDStringUtils.parseObjectToString(stringObjectMap.get("type"), ""));
            statisticsDTO.setGenDate(Timestamp.valueOf(genDate));
            statisticsDTO.setId(BDStringUtils.parseObjectToString(stringObjectMap.get("id"), ""));
            statisticsDTO.setPolNm(BDStringUtils.parseObjectToString(stringObjectMap.get("polNm"), ""));
            statisticsDTO.setRoadName(BDStringUtils.parseObjectToString(stringObjectMap.get("roadName"),"-"));
            return statisticsDTO;
        }).collect(Collectors.toList());
    }

    /**
     * Fine Statistics
     * @return
     */
    public List<StatisticsFineDTO> getFineStatisticsByDate(Map<String,String> param){
        List<Map<String, Object>> result = monitoringStatisticsRepository.findFineStatisticsByDate(param);
        return result.stream().map(stringObjectMap -> {
            StatisticsFineDTO statisticsDTO = new StatisticsFineDTO();
            statisticsDTO.setDate(BDStringUtils.parseObjectToString(stringObjectMap.get("date"), ""));
            statisticsDTO.setNtcTy(BDStringUtils.parseObjectToString(stringObjectMap.get("ntcTy"), ""));
            statisticsDTO.setTotalAmount((Double) stringObjectMap.get("totalAmount"));
            statisticsDTO.setPaidAmount((Double) stringObjectMap.get("paidAmount"));
            statisticsDTO.setUnpaidAmount((Double) stringObjectMap.get("unpaidAmount"));
            return statisticsDTO;
        }).collect(Collectors.toList());
    }

    private List<StatisticsDTO> getStatisticsDTOS(List<Map<String, Object>> resultToday, List<Map<String, Object>> resultYesterday) {
        resultToday.addAll(resultYesterday);
        return resultToday.stream().map(stringObjectMap -> {
            StatisticsDTO statisticsDTO = new StatisticsDTO();
            statisticsDTO.setType(BDStringUtils.parseObjectToString(stringObjectMap.get("type"), "-"));
            statisticsDTO.setTypeCnt((Long) stringObjectMap.get("typeCnt"));
            statisticsDTO.setDatePeriod(BDStringUtils.parseObjectToString(stringObjectMap.get("datePeriod"), ""));
            return statisticsDTO;
        }).collect(Collectors.toList());
    }

    private List<StatisticsByTimeDTO> getStatisticsByTimeDTOS(List<Map<String, Object>> result) {
        return result.stream().map(stringObjectMap -> {
            StatisticsByTimeDTO statisticsDTO = new StatisticsByTimeDTO();
            statisticsDTO.setType(BDStringUtils.parseObjectToString(stringObjectMap.get("type"), "-"));
            statisticsDTO.setTypeCnt((Long) stringObjectMap.get("typeCnt"));
            statisticsDTO.setTime(BDStringUtils.parseObjectToString(stringObjectMap.get("time"),""));
            return statisticsDTO;
        }).collect(Collectors.toList());
    }

    public List<StatisticsEnforcementTypeDTO> getEnforcementTypeMonthly() {
        List<Map<String, Object>> result = monitoringStatisticsRepository.findEnforcementCountMonthlyByEqpOrPol();
        return result.stream().map(stringObjectMap -> {
            StatisticsEnforcementTypeDTO statisticsDTO = new StatisticsEnforcementTypeDTO();
            statisticsDTO.setDate(BDStringUtils.parseObjectToString(stringObjectMap.get("date"),"-"));
            statisticsDTO.setCameraCnt(((BigDecimal) stringObjectMap.get("cameraCnt")).longValue());
            statisticsDTO.setPolCnt(((BigDecimal) stringObjectMap.get("polCnt")).longValue());
            return statisticsDTO;
        }).collect(Collectors.toList());
    }
}
