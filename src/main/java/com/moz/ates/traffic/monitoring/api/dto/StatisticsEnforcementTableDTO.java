package com.moz.ates.traffic.monitoring.api.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class StatisticsEnforcementTableDTO {
    String roadName;
    Date genDate;
    String operatorInfo;
    String type;
    String name;
    String drvLcenId;
    String id;
}
