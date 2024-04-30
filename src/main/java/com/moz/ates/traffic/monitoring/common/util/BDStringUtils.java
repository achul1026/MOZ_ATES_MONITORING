package com.moz.ates.traffic.monitoring.common.util;

import org.apache.commons.lang3.StringUtils;

public class BDStringUtils {


    public static String parseObjectToString(Object src, String defaultString){
        if(src == null){
            return defaultString;
        }
        return StringUtils.defaultIfEmpty((String) src, defaultString);
    }
}
