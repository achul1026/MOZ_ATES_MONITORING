package com.moz.ates.traffic.monitoring.api.dto;

import lombok.Data;

@Data
public class StatisticsFineDTO {
    String date;
    String ntcTy;
    Double totalAmount;
    Double paidAmount;
    Double unpaidAmount;
}
