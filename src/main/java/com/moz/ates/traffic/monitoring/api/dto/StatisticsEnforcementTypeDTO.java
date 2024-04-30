package com.moz.ates.traffic.monitoring.api.dto;

import lombok.Data;

@Data
public class StatisticsEnforcementTypeDTO {
    String date;
    Long polCnt;
    Long cameraCnt;
}
