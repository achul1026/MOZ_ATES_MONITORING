package com.moz.ates.traffic.monitoring.api.dto;

import lombok.Data;

@Data
public class StatisticsDTO {
    String type;
    Long typeCnt;
    String datePeriod;
}
