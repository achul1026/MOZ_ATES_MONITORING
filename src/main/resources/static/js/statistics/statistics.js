import {UI_TYPE,PieChartUI,LineChartUI} from "./ui.js";
const CHART_COLORS_ARRAY = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(227,102,255)"
];
const CHART_COLORS_OBJECT = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
function rgbToRgba(rgb, alpha = 1.0) {
    // Check if the input is a valid RGB color
    if (!/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/.test(rgb)) {
        throw new Error('Invalid RGB color format. Please use "rgb(x, y, z)".');
    }
    // Extract the RGB values from the input string
    const rgbValues = rgb.match(/\d+/g);
    // Construct the RGBA color string
    const rgba = `rgba(${rgbValues.join(', ')}, ${alpha})`;
    return rgba;
}
const StatisticsControl = function(){
    "use strict";
    const _wrap = document.getElementById("statisticsContainer");
    const _control = this;
    const interval_events = null;
    let _uiType;
    let _ui = null

    this.generate = function({type, title,direction="row"}){
        _ui = new type(direction);
        _ui.header(title ?? "Dashboard Item");
        _uiType = Object.getPrototypeOf(_ui.constructor).name;

        return this;
    }
    this.addLoading = function(){
        _ui.loading();
        return this;
    }
    this.addAsideInHeader = function(html, eventname,callback) {
        const aside = document.createElement("div");
        aside.innerHTML = html;
        if(typeof callback === "function")
            _ui.headerAside(aside, eventname, callback);
        return this;
    }

    this.setTableData = function(obj = {
        data : [],
        headers : [],
        align: [],
        width : [],
        metadata : []
    }) {
        if(_ui.constructor.name !== "TableUI") return this;
        _ui.setTableData(obj)
        return this;
    }

    this.setChartData = function(id, chartData, width, axis){
        if(_uiType !== "ChartUI"){
            console.log("This UI is not Chart type");
            return this;
        }
        _ui.setChartData(chartData,width, id);
        if(axis) _ui.setAxis(axis);
        if(_uiType === "ChartUI") _ui.draw();
        return this;
    }
    this.setLoading = function(){
        _ui.loading();
    }
    this.setContent = function(html= "", width){
        _ui.addBody(html, width);
        return this;
    }

    this.setIntervalEvent = function(callback,interval=60*1000){
        if(typeof callback !== "function") return;
        _ui.interval(callback.bind(_ui), interval);
        return this;
    }
    this.startIntervalEvent = function(){
        _ui.start();
    }
    this.stopIntervalEvent = function(){
        _ui.stop();
    }

    this.append = function(w=1,h=1, isLoading = true){
        if(isLoading) _ui.loading();
        _wrap.appendChild(_ui.get(w,h));
        _ui.doCallback();

        return _ui;
    }
}
const ctx = document.getElementById('myChart');

const statisticsControl = new StatisticsControl();


(function enforcementSummary() {
    let fetching = null;
    const ui = statisticsControl.generate({
        type : UI_TYPE.PieChartUI,
        title : "Daily real-time number of crackdowns by type"
    })
        .setIntervalEvent(function(){
            if(fetching) return;
            fetching = fetch("/api/statistics/enforcement/countByType",{})
                .then((response) => {
                    return response.json()
                })
                .then((response) => {
                    let todayTotal = 0;
                    let yesterdayTotal = 0;
                    response.reduce((prev, cur)=> {
                        if(cur.datePeriod === "today"){
                            todayTotal += cur.typeCnt;
                        }else if(cur.datePeriod === "yesterday"){
                            yesterdayTotal += cur.typeCnt;
                        }
                        return prev + cur.typeCnt;
                    }, 0);
                    const todayData = response.reduce((prev, cur)=> {
                        prev = prev ?? [];
                        if(cur.datePeriod === "today"){
                            prev.push(cur);
                        }
                        return prev;
                    }, []);
                    const trendCount = todayTotal-yesterdayTotal;
                    const trendUp = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                      </svg>          
                      `;
                    const trendDown = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                      </svg>
                      `;
                    const trendMiddle = '-';
                    let trend = '';
                    if(trendCount === 0) {
                        trend = trendMiddle;
                    }else if(trendCount > 0) {
                        trend = trendUp;
                    }else if(trendCount < 0) {
                        trend = trendDown;
                    }
                    let contents = `<div class="text-center w-full">
                    <div>
                        <p class="text-sm font-light">Enforcement Total</p>
                        <p class="text-6xl font-bold flex gap-2 items-end justify-center">
                            <span>${todayTotal}</span>
                            <span class="text-sm ${trendCount > 0 ? 'text-red-600' : 'text-green-600'}">${trend} ${parseInt(todayTotal-yesterdayTotal)}</span>
                        </p>
                    </div>
                    <div>
                    <p class="text-sm text-gray-500 mt-1">Yesterday : ${yesterdayTotal}</p>
                    </div>
                    </div>`;
                    this.loadingElement?.remove();
                    this.addBody(contents, 300, "enforcementTotalCntWrap");

                    /*Chart*/
                    const chartId = "enforcementTypePieChart";
                    const chartLabel = [];
                    const chartData = [];
                    const todayChartData = response.reduce((prev, cur)=> {
                        prev = prev ?? [];
                        if(cur.datePeriod === "today"){
                            chartLabel.push(cur.type);
                            chartData.push(cur.typeCnt);
                        }
                        return prev;
                    }, []);
                    if(this.chart != null){
                        this.updateChartData({
                            labels: chartLabel,
                            datasets: [{
                                label: 'Enforcement Count',
                                data: chartData,
                                backgroundColor : CHART_COLORS_ARRAY,
                                borderWidth: 1,
                                datalabels: {
                                    anchor : "end"
                                }
                            }]
                        });
                    }else{
                        this.setChartData({
                            labels: chartLabel,
                            datasets: [{
                                label: 'Enforcement Count',
                                data: chartData,
                                backgroundColor : CHART_COLORS_ARRAY,
                                borderWidth: 1,
                                datalabels: {
                                    anchor : "end"
                                }
                            }]
                        },null,chartId);
                        this.draw(true);
                    }

                })
                .catch(function(err){
                    console.log(err);
                })
                .finally(()=>{
                    fetching = null;
                })

        })
        // .addAsideInHeader(selects,"change", function(elem, ui){
        //     console.log(this,elem,ui)
        // })
        .append(4,3);
    ui.start();

})();
(function enforcementChart(){
    const chartId = "enforcementTypeLineChart";
    const savedFrequency = localStorage.getItem(chartId +"_frequency")
    let asideSelectHtml = `
        <select class="text-xs border-b border-b-gray-600 bg-transparent" id="enforcementTypeLineChartSelect">
            <option>Today</option>
            <option value="monthly" ${savedFrequency === 'monthly' ? "selected" : ""}>Monthly</option>
            <option value="yearly" ${savedFrequency === 'yearly' ? "selected" : ""}>Yearly</option>
        </select>`
    let timeLabels = [];
    let fetching = null;
    for(let i = 0; i < 24; i++) {
        timeLabels.push(i < 10 ? "0"+i+":00" : i+":00");
    }
    const ui = statisticsControl.generate({
        type : UI_TYPE.LineChartUI,
        title : "Number of violations by frequency"
    })
        .addAsideInHeader(asideSelectHtml,"change", function(elem, ui){
            const value = document.getElementById("enforcementTypeLineChartSelect").value;
            localStorage.setItem(chartId+"_frequency",value);
            elem.frequency = value;
            elem.stop();
            elem.start();
        })
        .setIntervalEvent(function(){
            if(fetching) return;
            let url = "/api/statistics/enforcement/countByTypeAndTime";
            this.frequency = this.frequency ?? localStorage.getItem(chartId +"_frequency");
            if(this.frequency){
                url += "?frequency=" + this.frequency
            }
            fetching = fetch(url,{})
                .then((response) => {
                    return response.json()
                })
                .then((response) => {
                    this.loadingElement?.remove();
                    /*Chart*/

                    let chartLabel = timeLabels;
                    if(this.frequency === "monthly" || this.frequency === "yearly") {
                        chartLabel = [];
                    }
                    const groupData = response.reduce((prev, cur)=> {
                        prev[cur.type] = prev[cur.type] ?? {};
                        prev[cur.type].data = prev[cur.type].data ?? {};
                        prev[cur.type].data[cur.time] = cur;
                        if(chartLabel.indexOf(cur.time) < 0 ) chartLabel.push(cur.time);
                        return prev;
                    }, {});
                    let chartDatasets = [];
                    let totalData = []
                    for(const group in groupData){
                        let data = [];
                        let idx = 0;
                        for(const time of chartLabel){
                            if(groupData[group].data[time]){
                                data.push(groupData[group].data[time].typeCnt);
                                totalData[idx] = (totalData[idx] ?? 0) + groupData[group].data[time].typeCnt;
                            }else{
                                data.push(0);
                                totalData[idx] = (totalData[idx] ?? 0) + 0;
                            }
                            idx++;
                        }
                        chartDatasets.push({
                            label : group,
                            data : data,
                            borderWidth : 1,
                            datalabels: {
                                labels: {
                                    title: null
                                }
                            }
                        })
                    }
                    chartDatasets.push({
                        label : "Total",
                        borderWidth : 1,
                        data : totalData,
                        datalabels: {
                            labels: {
                                title: null
                            }
                        },
                        type: 'bar'
                    });
                    if(this.chart != null){
                        this.updateChartData({
                            labels: chartLabel,
                            datasets: chartDatasets
                        });
                    }else{
                        this.setChartData({
                            labels: chartLabel,
                            datasets: chartDatasets
                        },null,chartId);
                        this.draw(true);
                    }
                })
                .finally(()=>{
                    fetching = null;
                })
        })
        .append(5,3);
    ui.start();
})();
(function FineFirst(){
    let fetching = null;
    const ui = statisticsControl.generate({
        type : UI_TYPE.BarChartUI,
        direction : "col",
        title : "Monthly First Fine Payment Statistics"
    }).setIntervalEvent(function(){
        if(fetching) return;
        fetching = fetch("/api/statistics/fine?ntcTy=NTT001")
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                this.loadingElement?.remove();
                /*Chart*/
                const chartId = "fineFirstBarChart";
                fineChart(this,response,chartId);

            })
            .catch(function(err){
                console.log(err);
            })
            .finally(()=>{
                fetching = null;
            })

    })
        .append(3,3);
    ui.start();
})();
(function accidentSummary() {
    let fetching = null;
    const ui = statisticsControl.generate({
        type : UI_TYPE.PieChartUI,
        title : "Daily real-time number of accident by type"
    })
        .setIntervalEvent(function(){
            if(fetching) return;
            fetching = fetch("/api/statistics/accident/countByType",{})
                .then((response) => {
                    return response.json()
                })
                .then((response) => {
                    let todayTotal = 0;
                    let yesterdayTotal = 0;
                    response.reduce((prev, cur)=> {
                        if(cur.datePeriod === "today"){
                            todayTotal += cur.typeCnt;
                        }else if(cur.datePeriod === "yesterday"){
                            yesterdayTotal += cur.typeCnt;
                        }
                        return prev + cur.typeCnt;
                    }, 0);
                    const todayData = response.reduce((prev, cur)=> {
                        prev = prev ?? [];
                        if(cur.datePeriod === "today"){
                            prev.push(cur);
                        }
                        return prev;
                    }, []);
                    const trendCount = todayTotal-yesterdayTotal;
                    const trendUp = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                      </svg>          
                      `;
                    const trendDown = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                      </svg>
                      `;
                    const trendMiddle = '-';
                    let trend = '';
                    if(trendCount === 0) {
                        trend = trendMiddle;
                    }else if(trendCount > 0) {
                        trend = trendUp;
                    }else if(trendCount < 0) {
                        trend = trendDown;
                    }
                    let contents = `<div class="text-center w-full">
                    <div>
                        <p class="text-sm font-light">Accident Total</p>
                        <p class="text-6xl font-bold flex gap-2 items-end justify-center">
                            <span>${todayTotal}</span>
                            <span class="text-sm ${trendCount > 0 ? 'text-red-600' : 'text-green-600'}">${trend} ${parseInt(todayTotal-yesterdayTotal)}</span>
                        </p>
                    </div>
                    <div>
                    <p class="text-sm text-gray-500 mt-1">Yesterday : ${yesterdayTotal}</p>
                    </div>
                    </div>`;
                    this.loadingElement?.remove();
                    this.addBody(contents, 300, "accidentTotalCntWrap");
                    /*Chart*/
                    const chartId = "accidentTypePieChart";
                    const chartLabel = [];
                    const chartData = [];
                    const todayChartData = response.reduce((prev, cur)=> {
                        prev = prev ?? [];
                        if(cur.datePeriod === "today"){
                            chartLabel.push(cur.type);
                            chartData.push(cur.typeCnt);
                        }
                        return prev;
                    }, []);
                    if(this.chart != null){
                        this.updateChartData({
                            labels: chartLabel,
                            datasets: [{
                                label: 'Accident Count',
                                data: chartData,
                                backgroundColor : CHART_COLORS_ARRAY,
                                borderWidth: 1,
                                datalabels: {
                                    anchor: 'end'
                                }
                            }]
                        });
                    }else{
                        this.setChartData({
                            labels: chartLabel,
                            datasets: [{
                                label: 'Accident Count',
                                data: chartData,
                                backgroundColor : CHART_COLORS_ARRAY,
                                borderWidth: 1,
                                datalabels: {
                                    anchor: 'end'
                                }
                            }]
                        },270,chartId);
                        this.draw(true);
                    }

                })
                .catch(function(err){
                    console.log(err);
                })
                .finally(()=>{
                    fetching = null;
                })

        })
        // .addAsideInHeader(selects,"change", function(elem, ui){
        //     console.log(this,elem,ui)
        // })
        .append(4,3);
    ui.start();
})();
(function accidentChart(){
    const chartId = "accidentTypeLineChart";
    const savedFrequency = localStorage.getItem(chartId +"_frequency")
    let asideSelectHtml = `
        <select class="text-xs border-b border-b-gray-600 bg-transparent" id="accidentTypeLineChartSelect">
            <option>Today</option>
            <option value="monthly" ${savedFrequency === 'monthly' ? "selected" : ""}>Monthly</option>
            <option value="yearly" ${savedFrequency === 'yearly' ? "selected" : ""}>Yearly</option>
        </select>`
    let timeLabels = [];
    for(let i = 0; i < 24; i++) {
        timeLabels.push(i < 10 ? "0"+i+":00" : i+":00");
    }
    let fetching = null;
    const ui = statisticsControl.generate({
        type : UI_TYPE.LineChartUI,
        title : "Number of accident by frequency"
    })
        .addAsideInHeader(asideSelectHtml,"change", function(elem, ui){
            const value = document.getElementById("accidentTypeLineChartSelect").value;
            localStorage.setItem(chartId+"_frequency",value);
            elem.frequency = value;
            elem.stop();
            elem.start();
        })
        .setIntervalEvent(function(){
            if(fetching) return;
            let url = "/api/statistics/accident/countByTypeAndTime";
            this.frequency = this.frequency ?? localStorage.getItem(chartId +"_frequency");
            if(this.frequency){
                url += "?frequency=" + this.frequency
            }
            fetching = fetch(url,{})
                .then((response) => {
                    return response.json()
                })
                .then((response) => {

                    this.loadingElement?.remove();
                    /*Chart*/
                    let chartLabel = timeLabels;
                    if(this.frequency === "monthly" || this.frequency === "yearly") {
                        chartLabel = [];
                    }
                    const groupData = response.reduce((prev, cur)=> {
                        prev[cur.type] = prev[cur.type] ?? {};
                        prev[cur.type].data = prev[cur.type].data ?? {};
                        prev[cur.type].data[cur.time] = cur;
                        if(chartLabel.indexOf(cur.time) < 0 ) chartLabel.push(cur.time);
                        return prev;
                    }, {});
                    let chartDatasets = [];
                    let totalData = []
                    for(const group in groupData){
                        let data = [];
                        let idx = 0;
                        for(const time of chartLabel){
                            if(groupData[group].data[time]){
                                data.push(groupData[group].data[time].typeCnt);
                                totalData[idx] = (totalData[idx] ?? 0) + groupData[group].data[time].typeCnt;
                            }else{
                                data.push(0);
                                totalData[idx] = (totalData[idx] ?? 0) + 0;
                            }
                            idx++;
                        }
                        chartDatasets.push({
                            label : group,
                            data : data,
                            borderWidth : 1,
                            datalabels: {
                                labels: {
                                    title: null
                                }
                            }
                        })
                    }
                    chartDatasets.push({
                        label : "Total",
                        borderWidth : 1,
                        data : totalData,
                        datalabels: {
                            labels: {
                                title: null
                            }
                        },
                        type: 'bar'
                    });
                    if(this.chart != null){
                        this.updateChartData({
                            labels: chartLabel,
                            datasets: chartDatasets
                        });
                    }else{
                        this.setChartData({
                            labels: chartLabel,
                            datasets: chartDatasets
                        },null,chartId);
                        this.draw(true);
                    }
                }).finally(()=>{
                    fetching = null;
                })
        })
        .append(5,3);
    ui.start();
})();
(function FineSecond(){
    let fetching = null;
    const ui = statisticsControl.generate({
        type : UI_TYPE.BarChartUI,
        direction : "col",
        title : "Monthly Second Fine Payment Statistics"
    }).setIntervalEvent(function(){
        if(fetching) return;
        fetching = fetch("/api/statistics/fine?ntcTy=NTT002")
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                this.loadingElement?.remove();
                /*Chart*/
                const chartId = "fineSecondBarChart";
                fineChart(this,response,chartId);
            })
            .catch(function(err){
                console.log(err);
            })
            .finally(()=>{
                fetching = null;
            })

    })
        .append(3,3);
    ui.start();
})();
(function accidentTable(){
    let fetching = null;
    const ui = statisticsControl.generate({
        type : UI_TYPE.TableUI,
        title : "10 recent accident lists"
    })
        .setIntervalEvent(function(){
            if(fetching) return;
            fetching = fetch("/api/statistics/accident/listByRecently",{})
                .then((response) => {
                    return response.json()
                })
                .then((response) => {
                    this.loadingElement?.remove();
                    this.setTableData({
                        data : response,
                        headers : ["Date","Police Officer","Road Name","Type"],
                        width : [100,100,200,200],
                        metadata : ["genDate","polNm","roadName","type"],
                    }, "accidentRecentlyListTable");
                })
                .catch(function(err){
                    console.log(err);
                })
                .finally(()=>{
                    fetching = null;
                })

        })
        .append(4,3);
    ui.start();
})();

(function enforcementTable(){
    let fetching = null;
    const ui = statisticsControl.generate({
        type : UI_TYPE.TableUI,
        title : "10 recent violation lists"
    })
        .setIntervalEvent(function(){
            if(fetching) return;
            fetching = fetch("/api/statistics/enforcement/listByRecently",{})
                .then((response) => {
                    return response.json()
                })
                .then((response) => {
                    this.loadingElement?.remove();
                    this.setTableData({
                        data : response,
                        headers : ["Date","Name","License ID","Road Name","Type"],
                        width : [100,100,100,200,200],
                        metadata : ["genDate","name","drvLcenId","roadName","type"],
                    }, "enforcementRecentlyListTable");
                })
                .catch(function(err){
                    console.log(err);
                })
                .finally(()=>{
                    fetching = null;
                })

        })
        .append(4,3);
    ui.start();
})();

(function EnforcementTypeChart(){
    let fetching = null;
    const ui = statisticsControl.generate({
        type : UI_TYPE.BarChartUI,
        title : "Monthly Enforcement Type Police/Camera"
    }).setIntervalEvent(function(){
        if(fetching) return;
        fetching = fetch("/api/statistics/enforcementTypeMonthly")
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                this.loadingElement?.remove();
                /*Chart*/
                const chartId = "cameraPoliceBarChart";
                const chartLabel = [];
                const polData = [];
                const cameraData = [];
                response.reduce((prev, cur)=> {
                    prev = prev ?? [];
                    if(chartLabel.indexOf(cur.date) == -1)
                        chartLabel.push(cur.date);
                    polData.push(cur.polCnt);
                    cameraData.push(cur.cameraCnt);
                    return prev;
                }, []);
                if(this.chart != null){
                    this.updateChartData({
                        labels: chartLabel,
                        datasets: [{
                            label: 'Police',
                            data: polData
                        },{
                            label: 'Camera',
                            data: cameraData
                        }]
                    });
                }else{
                    this.setChartData({
                        labels: chartLabel,
                        datasets: [{
                            label: 'Police',
                            data: polData,
                            backgroundColor : rgbToRgba(CHART_COLORS_OBJECT.blue,0.5),
                            borderColor : CHART_COLORS_OBJECT.blue,
                            borderWidth: 1,
                        },{
                            label: 'Camera',
                            data: cameraData,
                            backgroundColor : rgbToRgba(CHART_COLORS_OBJECT.purple,0.5),
                            borderColor : CHART_COLORS_OBJECT.purple,
                            borderWidth: 1
                        }]
                    },null,chartId);
                    this.draw(true);
                }

            })
            .catch(function(err){
                console.log(err);
            })
            .finally(()=>{
                fetching = null;
            })

    })
        .append(4,3);
    ui.start();
})();

function fineChart(ui, response, chartId){
    const chartLabel = [];
    const paidData = [];
    const unpaidData = [];
    let totalAmount = 0;
    let totalPaidAmount = 0;
    response.reduce((prev, cur)=> {
        prev = prev ?? [];
        if(chartLabel.indexOf(cur.date) == -1)
            chartLabel.push(cur.date);
        paidData.push(cur.paidAmount);
        unpaidData.push(cur.unpaidAmount);
        totalAmount += cur.totalAmount;
        totalPaidAmount += cur.paidAmount;
        return prev;
    }, []);
    if(ui.chart != null){
        ui.updateChartData({
            labels: chartLabel,
            datasets: [{
                label: 'Paid Amount',
                data: paidData
            },{
                label: 'Unpaid Amount',
                data: unpaidData
            }]
        });
    }else{
        ui.setChartData({
            labels: chartLabel,
            datasets: [{
                label: 'Paid Amount',
                data: paidData,
                backgroundColor : rgbToRgba(CHART_COLORS_OBJECT.green,0.5),
                borderColor : CHART_COLORS_OBJECT.green,
                borderWidth: 1,
                datalabels: {
                    labels: {
                        title: null
                    }
                }
            },{
                label: 'Unpaid Amount',
                data: unpaidData,
                backgroundColor : rgbToRgba(CHART_COLORS_OBJECT.orange,0.5),
                borderColor : CHART_COLORS_OBJECT.orange,
                borderWidth: 1,
                datalabels: {
                    labels: {
                        title: null
                    }
                }
            }]
        },null,chartId);
        ui.setTitle(totalPaidAmount.toLocaleString()+"MZN / "+totalAmount.toLocaleString()+"MZN");
        ui.draw(true);
    }
}