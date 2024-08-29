package com.moz.ates.traffic.monitoring.api.dto;

import lombok.Data;

import java.util.Date;
import java.time.LocalDateTime;

@Data
public class StatisticsAccidentTableDTO {
    String roadName;
    Date genDate;
    String polNm;
    String polLcenId;
    String type;
    String drvLcenId;
    String id;
}
