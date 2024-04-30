package com.moz.ates.traffic.monitoring.api.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StatisticsEnforcementTableDTO {
    String roadName;
    LocalDateTime genDate;
    String operatorInfo;
    String type;
    String name;
    String drvLcenId;
    String id;
}
