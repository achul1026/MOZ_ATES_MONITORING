import "../../libs/chartjs/chartjs.4.4.1.min.js"
import "../../libs/chartjs/chartjs.datalabels.js"

class Loading {
    html = `<div class="p-4 space-y-4 animate-pulse">
                <div class="w-full h-32 bg-gray-200 rounded"></div>
                <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>`;
}
const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

const NAMED_COLORS = [
    CHART_COLORS.red,
    CHART_COLORS.orange,
    CHART_COLORS.yellow,
    CHART_COLORS.green,
    CHART_COLORS.blue,
    CHART_COLORS.purple,
    CHART_COLORS.grey,
];

function namedColor(index) {
    return NAMED_COLORS[index % NAMED_COLORS.length];
}
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
function array_move(arr, old_index, new_index) {
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
}
class StatisticsUI {
    interval_event = null;
    interval_callback = null;
    interval_time = 60*1000;
    wrapper = document.createElement("article");
    callbackStack = [];
    bodyInnerArray = [];
    searchQueryObject = {};

    constructor(direction  = "row"){
        this.direction = direction;
        this.wrapper.className = `shadow bg-white text-gray-800 flex flex-col rounded-md border border-gray-300`;
        this.body =  this.body ?? document.createElement("div");
        this.headerHtml = document.createElement("div");
        this.wrapper.appendChild(this.headerHtml);
        this.wrapper.appendChild(this.body);
        return this;
    }

    header(title){
        this.headerHtml.className = "sm:text-sm xl:text-sm px-6 py-3 flex flex-row justify-between h-auto border-b border-b-gray-300";
        const titleElement = document.createElement("span");
        titleElement.innerText = title;
        this.headerHtml.appendChild(titleElement);

    }

    headerAside(rightElement,eventName,callback) {
        this.headerHtml.appendChild(rightElement);
        if(typeof callback === "function") rightElement.addEventListener(eventName, callback.bind(rightElement,this));
    }
    clearBody(){
        this.body.innerHTML = "";
    }

    updateBody(index, html) {
        this.body.children[index]
    }
    addBody(html, width,id, callback){
        this.body.className = `sm:text-xs xl:text-sm px-6 py-6 flex flex-${this.direction} h-full gap-2 overflow-auto`
        let bodyInner = document.getElementById(id);
        let exists = true;        
        if(bodyInner == null){
            bodyInner = document.createElement("div");
            bodyInner.className = "relative w-full h-full flex items-center " + (width ? `max-w-[${width}px]` : "");
            exists = false;
            if(id) bodyInner.id = id;
            this.body.appendChild(bodyInner);
        }
        
        if(typeof html === "string"){
            bodyInner.innerHTML = html;
        }else{
            if(html.tagName === "CANVAS"){
                bodyInner.appendChild(html);
            }else{
                bodyInner.innerHTML = html.outerHTML;
            }
        }
        if(typeof callback === "function" ) this.callbackStack.push(callback.bind(this));
    }
    loading(){
        this.loadingElement = document.createElement('div');
        this.loadingElement.innerHTML = `<div class="animate-pulse flex space-x-4 px-6 py-6">
        <div class="rounded-full bg-slate-300 h-10 w-10"></div>
        <div class="flex-1 space-y-6 py-1">
          <div class="h-4 bg-slate-300 rounded"></div>
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="h-4 bg-slate-300 rounded col-span-2"></div>
              <div class="h-4 bg-slate-300 rounded col-span-1"></div>
            </div>
            <div class="h-4 bg-slate-300 rounded"></div>
          </div>
        </div>
      </div>`;
        this.body.append(this.loadingElement);
    }

    // content(html, callback) {
    //     this.body.appendChild(html);
    //     callbackStack.push(callback.bind(this));
    // }

    footer(html, callback){
        this.footer = document.createElement("div");
        this.footer.className = ""
    }
    get(w=1,h=1){
        this.wrapper.classList.add(`col-span-${w}`);
        this.wrapper.classList.add(`row-span-${h}`);
        return this.wrapper;
    }
    interval(callback, interval){
        if(typeof callback !== "function") return;
        this.interval_callback = callback;
        this.interval_time = interval ?? 60*1000;
    }
    start(){
        this.stop();
        this.interval_callback();
        this.interval_event = setInterval(this.interval_callback, this.interval_time);
        // console.log(this.interval_event);
    }
    stop(){
        if(this.interval_event) clearInterval(this.interval_event);
    }
    doCallback(){
        for(const callback of this.callbackStack) {
            if(typeof callback === "function") callback();
        }
    }
}

export class CustomUI extends StatisticsUI {

}
class TableUI extends StatisticsUI {
    tableWrapper = document.createElement("div");
    table = document.createElement("table");
    tableHead = document.createElement("thead");
    tableBody = document.createElement("tbody");
    tableRows = [];
    tableData = null;
    tableId = "";
    constructor(){
        super();
        this.tableWrapper.className = "overflow-y-auto  text-xs absolute top-0 left-0 bottom-0";
        this.table.className = "w-full table-fixed";
        this.tableHead.className = "bg-gray-100 sticky top-0";
        this.tableBody.className = "overflow-y-auto";

        this.table.appendChild(this.tableHead);
        this.table.appendChild(this.tableBody);
        this.tableWrapper.appendChild(this.table);
        this.tableId = "table-"+parseInt(Math.random()*1000);
        this.table.id = this.tableId;
    }

    setTableData({
        data,
        headers,
        align = [],
        metadata, width,
    }, id){
        let rows = [];
        const exists = document.getElementById(this.tableId);
        rows = data.map((d)=>{
            let obj = {};
            for(const key of metadata){
                obj[key] = d[key];
            }
            return obj;
        });
        if(exists){
            this.tableBody.innerHTML = "";
        }
        this.tableData = rows;
        for(const row of rows) {
            const tr = document.createElement("tr");
            let colIdx = 0;
            for(const col in row) {
                const td = document.createElement("td");
                td.className = "border-b border-b-gray-100 px-1 py-1";
                if(width !== null && width[colIdx] != null){
                    td.classList.add(`w-[${width[colIdx]}px]`);
                }
                const span = document.createElement("span");
                if(typeof align[colIdx] !== "undefined") {
                    td.classList.add("text-"+align[colIdx]);
                }else{
                    td.classList.add("text-center");
                }
                span.innerText = row[col];
                td.appendChild(span);
                tr.appendChild(td);
                colIdx++;
            }
            
            this.tableBody.appendChild(tr);
        }
        this.table.appendChild(this.tableBody);
        
        if(!exists){
            let headerTR = document.createElement("tr");
            let colIdx = 0;
            for(const headText of headers) {
                const th = document.createElement("th");
                th.className = "px-1 py-1";
                if(width !== null && width[colIdx] != null){
                    th.classList.add(`w-[${width[colIdx]}px]`);
                }
                th.innerText = headText;
                headerTR.appendChild(th);
                colIdx++;
            }
            this.tableHead.appendChild(headerTR);
        }

        this.addBody(this.tableWrapper, null, id);
    }
}

class ChartUI extends StatisticsUI {
    added_element_classes = "";
    canvas = document.createElement("canvas");
    chartBodyId = "";
    chart = null;
    width = null;
    frequency = null;
    legendMargin = {
        id : "legendMargin",
        beforeInit(chart, legend, options) {
            const fitValue = chart.legend.fit;
            chart.legend.fit = function fit(){
                fitValue.bind(chart.legend)();
                return this.left += 50;
            }
        }
    }
    chart_option = {
        plugins: [ChartDataLabels, this.legendMargin],
        options: {
            layout: {
                padding: {
                    left : 10,
                    right : 0
                }
            },
            maintainAspectRatio: false,
            scales : {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize:100,
                    }
                },
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    display: true,
                    labels: {
                        padding:10,
                        boxWidth:12,
                        font: {
                            size:11,
                        }
                    }
                },
                datalabels: {
                    backgroundColor: function(context) {
                        return context.dataset.backgroundColor;
                    },
                    borderColor: 'white',
                    borderRadius: 50,
                    borderWidth: 1,
                    color: 'white',
                    display: function(context) {
                        var dataset = context.dataset;
                        var count = dataset.data.length;
                        var value = dataset.data[context.dataIndex];
                        return true;
                        //return value > count * 1.5;
                    },
                    font: {
                        weight: 'bold'
                    },
                    padding: 6,
                    formatter: Math.round
                },
                title: {
                    display: false
                }
            }
        }
    };
    chart_data = {};
    constructor(direction){
        super(direction);
    }
    setLegned({position = "top",display = true}){
        this.chart_option.options.plugins.legend.position = position;
        this.chart_option.options.plugins.legend.display = display;
    }
    setAxis(axis = 'y'){
        this.chart_option.options.indexAxis = axis;
    }
    setTitle(title){
        this.chart_option.options.plugins.title.display = true;
        this.chart_option.options.plugins.title.text = title;
        this.chart_option.options.plugins.title.position = "bottom";
        this.chart_option.options.plugins.title.padding = {
            top: 30
        }
        this.chart_option.options.plugins.title.font = {
            size : 20,
        }
    }
    setChartData(data, width, id){
        if(this.chart) {
            console.error("Use updateChartData method.");
            return;
        }
        this.chartBodyId = id;
        this.width = width;
        this.chart_option.data = data;
        // this.chart_option = Object.assign(this.chart_option, data);
    }
    replaceChartData(data) {
        this.chart.data = data;
        this.chart.update();
    }
    updateChartData(data) {
        if(!this.chart) {
            console.error("The chart has not been created yet.");
            return;
        }

        if(data.labels)
            this.chart.data.labels = data.labels

        let inertedDatasetLabels = [];
        for(const dataset of data.datasets){
            // let existsDataset = this.chart.data.datasets.find((obj)=> obj.label === dataset.label);
            let existsDataset = this.chart.data.datasets.find((obj) => {
                return obj.label === dataset.label;
            });

            if(!existsDataset){
                const dsColor = namedColor(this.chart.data.datasets.length);
                dataset.backgroundColor = rgbToRgba(dsColor, 0.5);
                dataset.borderColor = dsColor;
                this.chart.data.datasets.push(dataset);
            }else{
                existsDataset.data = dataset.data;
            }
            inertedDatasetLabels.push(dataset.label);
        }
        let indexForDelete = [];
        let idx = 0;
        for(let dataset of this.chart.data.datasets){
            if(inertedDatasetLabels.indexOf(dataset.label) < 0){
                indexForDelete.push(idx);
            }
            idx++;
        }
        for(const index of indexForDelete.reverse()){
            this.chart.data.datasets.splice(index,1);
        }
        if(this.chart.options.type === "line") {
            let totalIdx = 0;
            for (const dataset of this.chart.data.datasets) {
                if (dataset.label !== "Total") {
                    totalIdx++
                }else{
                    break;
                }
            }
            if (totalIdx !== 0) {
                // TODO :: total 맨뒤로
                // this.chart.data.datasets = array_move(this.chart.data.datasets, totalIdx, this.chart.data.datasets.length - 1);
            }
        }
        this.chart.update();
    }
    draw(direct = false){
        this.addBody(this.canvas, this.width, this.chartBodyId);
        if(direct){
            window.requestAnimationFrame(() => {
                this.chart = new Chart(this.canvas, this.chart_option);
            })
        }else {
            this.callbackStack.push(()=>{
                window.requestAnimationFrame(() => {
                    this.chart = new Chart(this.canvas, this.chart_option);
                })
            });
        }

    }
}

export class PieChartUI extends ChartUI {
    constructor(){
        super();
        this.chart_option.type = "pie";
        delete this.chart_option.options.scales;
        this.chart_option.options.plugins.legend.position = 'right';
    }
}
export class LineChartUI extends ChartUI {
    constructor(){
        super();
        this.chart_option.type = "line";
        this.chart_option.scales = {
            y: {
                beginAtZero: true
            },
            x: {
                beginAtZero: true
            },
        }
        this.chart_option.options.interaction = {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    }
}
export class BarChartUI extends ChartUI {
    constructor(direction = "row"){
        super(direction);
        this.chart_option.type = "bar";
        this.chart_option.scales = {
            y: {
                beginAtZero: true
            },
            x: {
                beginAtZero: true
            },
        }
        this.chart_option.options.interaction = {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    }
}
export const UI_TYPE = {
    "PieChartUI" : PieChartUI,
    "LineChartUI" : LineChartUI,
    "BarChartUI" : BarChartUI,
    "TableUI" : TableUI,
    "CustomUI" : CustomUI
};