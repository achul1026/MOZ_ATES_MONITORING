package com.moz.ates.traffic.monitoring.map.controller;

import com.moz.ates.traffic.common.entity.accident.MozTfcAcdntFileInfo;
import com.moz.ates.traffic.common.entity.accident.MozTfcAcdntMaster;
import com.moz.ates.traffic.common.entity.accident.MozTfcAcdntTrgtInfo;
import com.moz.ates.traffic.common.entity.accident.MozTfcAcdntTrgtPnrInfo;
import com.moz.ates.traffic.common.entity.common.AccidentDomain;
import com.moz.ates.traffic.common.entity.common.EnforcementDomain;
import com.moz.ates.traffic.common.entity.enforcement.MozTfcEnfMaster;
import com.moz.ates.traffic.common.entity.equipment.MozTfcEnfFineInfo;
import com.moz.ates.traffic.common.enums.AccidentDamageCd;
import com.moz.ates.traffic.common.enums.PassengerDamageCd;
import com.moz.ates.traffic.common.enums.PassengerDriverRelationCd;
import com.moz.ates.traffic.common.repository.accident.MozTfcAcdntFileInfoRepository;
import com.moz.ates.traffic.common.repository.accident.MozTfcAcdntMasterRepository;
import com.moz.ates.traffic.common.repository.accident.MozTfcAcdntTrgtInfoRepository;
import com.moz.ates.traffic.common.repository.enforcement.MozTfcEnfMasterRepository;
import com.moz.ates.traffic.common.repository.equipment.MozTfcEnfFineInfoRepository;
import com.moz.ates.traffic.common.support.exception.CommonException;
import com.moz.ates.traffic.common.util.MozatesCommonUtils;
import com.moz.ates.traffic.monitoring.map.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(value="/map")
@RequiredArgsConstructor
public class MapController {

	final private MapService mapService;

    final private MozTfcEnfMasterRepository tfcEnfMasterRepository;

    final private MozTfcEnfFineInfoRepository tfcEnfFineInfoRepository;

    final private MozTfcAcdntMasterRepository tfcAcdntMasterRepository;

    final private MozTfcAcdntFileInfoRepository tfcAcdntFileInfoRepository;

    final private MozTfcAcdntTrgtInfoRepository tfcAcdntTrgtInfoRepository;
    /**
     * Show Only Statistics
     * @return
     */
    @GetMapping(value="")
    public ModelAndView showStatistics(){
        ModelAndView mav = new ModelAndView();
        mav.setViewName("views/dashboard/map");
        return mav;
    }

    @GetMapping("/enf/detail.ajax")
    public String infoDetail(Model model, @RequestParam("tfcEnfId") String tfcEnfId) throws Exception {
        MozTfcEnfMaster tfcEnfMaster = null;
        EnforcementDomain eDomain = null;
        List<MozTfcEnfFineInfo> fineInfoList = null;
        try {
            tfcEnfMaster = tfcEnfMasterRepository.findOneMozTfcEnfMasterBytfcEnfId(tfcEnfId);
            fineInfoList = tfcEnfFineInfoRepository.findAllTfcEnfFineInfoJoinTfcLwFineInfoAndTfcLwInfoByTfcEnfId(tfcEnfId);
            for (MozTfcEnfFineInfo lawFine : fineInfoList) {
                String lawType = lawFine.getTfcLwInfo().getLawType();
                String lawArticleNo = lawFine.getTfcLwInfo().getLawArticleNo();
                String artclNo = lawFine.getTfcLwFineInfo().getArtclNo();
                String par = lawFine.getTfcLwFineInfo().getPar();

                StringBuilder titleBuilder = new StringBuilder();

                if (MozatesCommonUtils.isNull(artclNo) && MozatesCommonUtils.isNull(par)) {
                    titleBuilder.append("[").append(lawType).append("] ")
                            .append(lawArticleNo);
                } else {
                    if (MozatesCommonUtils.isNull(artclNo)) {
                        titleBuilder.append("[").append(lawType).append("] ")
                                .append(lawArticleNo).append("--").append(par);
                    } else if (MozatesCommonUtils.isNull(par)) {
                        titleBuilder.append("[").append(lawType).append("] ")
                                .append(lawArticleNo).append("-").append(artclNo);
                    } else {
                        titleBuilder.append("[").append(lawType).append("] ")
                                .append(lawArticleNo).append("-").append(artclNo).append("-").append(par);
                    }

                }

                lawFine.getTfcLwInfo().setLawNm(titleBuilder.toString());
            }
        } catch (CommonException e){
            throw new Exception(e.getMessage());
        }

        model.addAttribute("tfcEnfMaster", tfcEnfMaster);
        model.addAttribute("fineInfoList", fineInfoList);
        return "views/dashboard/map_modal_enf";
    }

    /**
     * Acdnt mng detail string.
     *
     * @param model      the model
     * @param tfcAcdntId the tfc acdnt id
     * @return the string
     */
    @GetMapping("/acdnt/detail.ajax")
    public String acdntMngDetail(Model model, @RequestParam("tfcAcdntId") String tfcAcdntId, @RequestParam("acdntPsnrCnt") Long acdntPsnrCnt) {
        MozTfcAcdntMaster tfcAcdntMaster = new MozTfcAcdntMaster();
        tfcAcdntMaster = tfcAcdntMasterRepository.findOneMngDetail(tfcAcdntId);

        // 사고 파일 조회
        List<MozTfcAcdntFileInfo> acdntFileList = new ArrayList<MozTfcAcdntFileInfo>();
        acdntFileList = tfcAcdntFileInfoRepository.findAllTfcAcdntFileInfoByTfcAcdntId(tfcAcdntId);
        tfcAcdntMaster.setTfcAcdntFileInfo(acdntFileList);

        // 타겟 및 탑승자 정보 조회
        List<MozTfcAcdntTrgtInfo> trgtInfoList = new ArrayList<MozTfcAcdntTrgtInfo>();
        trgtInfoList = tfcAcdntTrgtInfoRepository.findAllTfcAcdntTrgtByTfcAcdntId(tfcAcdntId);

        for(MozTfcAcdntTrgtInfo trgt : trgtInfoList) {
            String acdntDmgCdNm = AccidentDamageCd.getAcdntDamageCdNameForCode(trgt.getAcdntDmgCd());
            trgt.setAcdntDmgCdNm(acdntDmgCdNm);

            for(MozTfcAcdntTrgtPnrInfo pnr : trgt.getTfcAcdntTrgtPnrInfo()) {
                String pnrDmgCdNm = PassengerDamageCd.getPassengerDamageCdNameForCode(pnr.getPnrDmgCd());
                pnr.setPnrDmgCdNm(pnrDmgCdNm);

                String pnrDrvrRltnCdNm = PassengerDriverRelationCd.getPassengerDriverRelationCdNameForCode(pnr.getPnrDrvrRltnCd());
                pnr.setPnrDrvrRltnCdNm(pnrDrvrRltnCdNm);
            }
        }

        tfcAcdntMaster.setTfcAcdntTrgtInfo(trgtInfoList);
        model.addAttribute("tfcAcdntMaster", tfcAcdntMaster);
        model.addAttribute("acdntPsnrCnt", acdntPsnrCnt);

        return "views/dashboard/map_modal_acdnt";
    }
}
