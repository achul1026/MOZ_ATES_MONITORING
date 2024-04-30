package com.moz.ates.traffic.monitoring.api.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StatisticsAccidentTableDTO {
    String roadName;
    LocalDateTime genDate;
    String polNm;
    String polLcenId;
    String type;
    String drvLcenId;
    String id;
}
