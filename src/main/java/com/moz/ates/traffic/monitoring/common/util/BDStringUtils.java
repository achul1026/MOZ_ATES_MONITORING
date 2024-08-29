package com.moz.ates.traffic.monitoring.common.util;

import java.math.BigInteger;

import org.apache.commons.lang3.StringUtils;

public class BDStringUtils {


    public static String parseObjectToString(Object src, String defaultString){
        if(src == null){
            return defaultString;
        }
        if(src instanceof BigInteger) {
        	return StringUtils.defaultIfEmpty(src.toString(), defaultString);
        }
        return StringUtils.defaultIfEmpty((String) src, defaultString);
    }
}
