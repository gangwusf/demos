import React, {useEffect, useRef, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from '../../components/Layout';
import Message from "../../components/Message";
import { getDemoConfigWithId } from '../../utils';
import Papa from 'papaparse';
import DataTable from "./DataTable";
import Table from "./Table";
import CaseVolume from "./CaseVolume";
import PerformanceBreakdown from "./PerformanceBreakdown";
import PredictionCounter from "./PredictionCounter";
import ModelPerformance from "./ModelPerformance";
import RiskyCategory from "./RiskyCategory";
// require('./index.less');

function App() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const demoData = getDemoConfigWithId('ccra');
    const svr = demoData.backend_api_url;
    const [message, setMessage] = useState(undefined);
    const [rows, setRows] = useState([]);
    const [confusionMonth, setConfusionMonth] = useState([[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]]);
    const [confusionAll, setConfusionAll] = useState([[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]]);
    const [predictionCounterAll, setPredictionCounterAll] = useState([0,0,0,0]);
    const [predictionCounterMonth, setPredictionCounterMonth] = useState([0,0,0,0]);
    const [riskyCategoryAll, setRiskyCategoryAll] = useState([0,0,0,0,0]);
    const [riskyCategoryMonth, setRiskyCategoryMonth] = useState([0,0,0,0,0]);
    const [performanceBreakdownAll, setPerformanceBreakdown] = useState([[],[]]);
    const [performanceBreakdownMonth, setPerformanceBreakdownMonth] = useState([[],[]]);
    const [caseVolume, setCaseVolume] = useState([0,0,0,0]);
    const [modelPerformance, setModelPerformance] = useState([0,0,0,0]);
    const [confusionFilter, setConfusionFilter] = useState(undefined);
    const [note, setNote] = useState(undefined);
    const [lastMonth, setLastMonth] = useState(undefined);
    const [firstMonth, setFirstMonth] = useState(undefined);
    const [lastMonth0, setLastMonth0] = useState(undefined);
    const [overall, setOverall] = useState(undefined);

    const filterLastMonth = (data) => { 
        const max = data.reduce(function(prev, current) {
            if(current['Case Create Date'] == null)
            {
                console.log(prev, current);
                return  prev;
            }
            
            return  prev['Case Create Date'] > current['Case Create Date'] ? prev : current
        });

        const min = data.reduce(function(prev, current) {
            if(current['Case Create Date'] == null)
            {
                console.log(prev, current);
                return  prev;
            }
            return  prev['Case Create Date'] < current['Case Create Date'] ? prev : current
        });

        //console.log('error max min date', max, min);
        
        
        const lastDay = new Date(max['Case Create Date'].replace(/-/g, '\/'));
        const firstDay = new Date(min['Case Create Date'].replace(/-/g, '/'));
        const lastMonth = monthNames[lastDay.getMonth()] + ' ' + lastDay.getFullYear();
        const firstMonth = monthNames[firstDay.getMonth()] + ' ' + firstDay.getFullYear();
        setLastMonth(lastMonth);
        setFirstMonth(firstMonth);
        setOverall(firstMonth + ' - ' + lastMonth);
        const maxdate = max['Case Create Date'].substring(0, 7);
        const result = data.filter((row) => { 
            if(row['Case Create Date'] == null)
            {
                console.log(row);
                return false;
            }
            const d = row['Case Create Date'].substring(0, 7);
            return d == maxdate;
        });
//console.log('result', result);
        return result;
    };

    const getConfusionMatrix = (rows) => {
        let cm = [[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0],[0, 0, 0, 0]];
        const preds = rows.map(row => row['Predicted Risk Level']);
        const trues = rows.map(row => row['Actual Risk Level']);
        const map = {
            'low': 0,
            'medium': 1,
            'high': 2,
            'severe': 3
        }
        //console.log('preds', preds);
        for (let i = 0; i < preds.length; i++) {
            if(preds[i] == null || trues[i] == null)
            {
                console.log('error', preds[i], trues[i]);
                continue;
            }
            cm[map[trues[i]]][map[preds[i]]] += 1;
        }
 
        //console.log('cm', cm);
        return cm;
    };

    const getPerformanceBreakdown = (data) => {
        let precision = [];
        let recall = [];
        const vsum = vertical_sum(data);
        const hsum = horizontal_sum(data);
        for (let i = 0; i < data.length; i++) {
            if(hsum[i] == 0 ){
                
                recall.push(100);
            }
            else if( data[i][i] == 0){
                recall.push(0);
            }
            else{
                recall.push((data[i][i] * 100) / hsum[i]);
            }

            if(vsum[i] == 0 ){
                precision.push(100);
            }else{
                precision.push((data[i][i] * 100)/ vsum[i]);
            }
        }
        return [ recall,precision];
    };

    const predictionCounter = (data) => {
        let total = 0;
        //console.log('predictionCounter', data);
        const predictedRiskLevels = Object.values(
            data.reduce((r, cur) => {
                if(r[cur['Predicted Risk Level']] == undefined){
                    r[cur['Predicted Risk Level']] = {"Predicted Risk Level": cur['Predicted Risk Level'], count: 0};
                }
                r[cur['Predicted Risk Level']].count++;
                total += 1;
                return r;
            }, {})
        );

        let resultArray = [0,0,0,0];
        predictedRiskLevels.forEach(element => {
            if(element['Predicted Risk Level'] == "severe"){
                resultArray[0] = element.count;
            }
            if(element['Predicted Risk Level'] == "high"){
                resultArray[1] = element.count;
            }
            if(element['Predicted Risk Level'] == "medium"){
                resultArray[2] = element.count;
            }
            if(element['Predicted Risk Level'] == "low"){
                resultArray[3] = element.count;
            }});

        return {rows:resultArray, total:total};
    };

    const getCaseVolumn = (data) => {
        //console.log('data', data);
        const caseVolumn = Object.values(
            data.reduce((r, cur) => {
                
                const d = new Date(cur['Case Create Date'].replace(/-/g, "/"));

                let month = d.getMonth() + 1;
                
                month = month < 10 ? '0' + month : month;
                const year = d.getFullYear();
                //console.log('cur', month, year);
                const yearmonth =  year + "/" + month;
                const key = cur['Change Type'] + '-' + yearmonth;
                if(r[key] == undefined){
                    r[key] = {"Change Type": cur['Change Type'], month: yearmonth, count: 0};
                }
                r[key].count++;

                return r;
            }, {}));

        let zip = {};
        caseVolumn.forEach(element => {
            const month = element.month;
            if(zip[month] == undefined){
                zip[month] = {month:month, Minor:null, Significant:null};
            }
            if(element['Change Type'] == "Minor"){
                zip[month].Minor = element.count;
            }
            if(element['Change Type'] == "Significant"){
                zip[month].Significant = element.count;
            }
        });
        //console.log('getCaseVolumn', zip);
        return Object.keys(zip).sort().reduce((r, k) => (r[k] = zip[k], r), {});
    };

    const vertical_sum = (matrix) => {
        let result = [0,0,0,0];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                result[j] += matrix[i][j];
            }
        }
        return result;
    };

    const horizontal_sum = (matrix) => {
        let result = [0,0,0,0];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                result[i] += matrix[i][j];
            }
        }
        return result;
    };

    const getModelPerformance = (data) => {
        const modelPerformance = Object.values(
            data.reduce((r, cur) => {
                const d = new Date(cur['Case Create Date'].replace(/-/g, "/"));
                let month = d.getMonth() + 1;
                month = month < 10 ? '0' + month : month;
                const key =  d.getFullYear() + "/" + month;
                if(r[key] == undefined){
                    r[key] = [];
                }
                r[key].push({"Predicted Risk Level": cur['Predicted Risk Level'], "Actual Risk Level": cur['Actual Risk Level'], month: key, count: 0});

                return r;
            }, {}));

        let zip = {};
        modelPerformance.forEach(element => {
            const cm = getConfusionMatrix(element);
            //console.log('month', element[0].month);
            //console.log('cm', cm);

            const vsum = vertical_sum(cm);
            //console.log('vsum', vsum);
            let precision_level = 0;
            for (let i = 0; i < cm.length; i++) {
                if(vsum[i] == 0 && cm[i][i] == 0){
                    precision_level += 1;
                }else{
                    precision_level += cm[i][i] / vsum[i];
                }
            }
            //console.log('precision_level', precision_level);
            zip[element[0].month] = ((precision_level * 100 )/ 4).toFixed(2);
        });
        //console.log('getModelPerformance', zip);
        return Object.keys(zip).sort().reduce((r, k) => (r[k] = zip[k], r), {});
        
    };

    const getRiskyCategory = (data) => {
        let total = 0;
        const riskyCategory = Object.values(
            data.reduce((r, cur) => {
                if(cur['Predicted Risk Level'] == 'severe'){
                    //console.log('cur', cur);
                    total += 1;
                    if(r[cur['Change Category']] == undefined){
                        r[cur['Change Category']] = {changeCategory:cur['Change Category'], count:1};
                    }else{
                        r[cur['Change Category']].count += 1;
                    }
                }
                return r;
            }, {}));
        const rtn = riskyCategory.sort((a, b) => (a.count < b.count) ? 1 : -1).slice(0, 5);

        return {rows:rtn, total:total};
    };


    const getData = (d) => {

        let data = [];
        let index = 0;

        d.forEach(element => {
            ++index;
            if(element['Predicted Risk Level'] !== undefined ){
                data.push(element);
            }
            else{
                //console.log('undefined', index, element);
            }
           
        });
        const max = data.reduce(function(prev, current) {
            if(current['Case Create Date'] == null)
            {
                console.log('debug', prev, current);
                return  prev;
            }
            
            return  prev['Case Create Date'] > current['Case Create Date'] ? prev : current
        });

        const maxdate = new Date(max['Case Create Date'].replace(/-/g, "/"));
        let maxMonth = monthNames[maxdate.getMonth()] + ' ' + maxdate.getFullYear();
        
        setLastMonth0(maxMonth);
        const lastMonth = filterLastMonth(data);
        setRows(data);
        setCaseVolume(getCaseVolumn(data));
        setRiskyCategoryAll(getRiskyCategory(data));
        setRiskyCategoryMonth(getRiskyCategory(lastMonth));
        setPredictionCounterAll( predictionCounter(data));
        setPredictionCounterMonth( predictionCounter(lastMonth));

        maxMonth = max['Case Create Date'].substring(0, 7);
        let data2 = [];
        data.forEach(element => {
            ++index;
            if( element['Case Create Date'].substring(0, 7) !== maxMonth){
                data2.push(element);
            }
            else{
                //console.log('undefined', index, element);
            }
           
        });

        

        const lastMonth2 = filterLastMonth(data2);

     
        
        const confusion_all = getConfusionMatrix(data2);
        const confusion_lastMonth = getConfusionMatrix(lastMonth2);
        setConfusionAll(confusion_all);
        setConfusionMonth(confusion_lastMonth);

        setPerformanceBreakdown(getPerformanceBreakdown(confusion_all));
        setPerformanceBreakdownMonth(getPerformanceBreakdown(confusion_lastMonth));

       
        setModelPerformance(getModelPerformance(data2));


        
        
    }

    const parseData = ( url, callBack)  =>{
        Papa.parse(url, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                callBack(results.data);
            }
        });
    }



    useEffect(() => {
        parseData(svr, getData);
    }, []);   






    return (
            <Layout currentMenu={"/ccra"} title={demoData.name}>
                <style jsx global>{`
                body {
                    font-family: 'Open Sans', sans-serif;
                    font-size: 14px;
                    line-height: 1.42857143;
                    color: rgb(116, 115, 115);
                    background-color: #fff;
                }
                
                body, html, .step, .main-content {
                     display: flex; 
                     flex-direction: column; 
                     height: 100%; 
                }
                
                #__next .body-container .main-content {
                    padding: 0;
                }
                
                
                
                .header {
                    background-color: #ffffff;
                    padding: 14px;
                    text-align: center;
                    font-size: 1.25rem;
                }
                
                .shade > div{
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 0px 8px;
                }
                
                .shade header button, .shade header input {
                    border: 1px solid rgb(199, 201, 201);
                    height:23px;
                }
                
                .shade header button {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                    border-left: none;
                }
                
                .row {
                    margin-bottom:20px;
                }
                
                .nav-link {
                    padding: 0.0rem 0.0rem;
                    margin-right:0.4rem;
                    color:rgb(54, 53, 53)
                }
                
                .nav-link.active {
                    border-bottom: #0d9dda 2px solid;
                }
                .nav {
                    margin-top: -3px;
                    margin-bottom: 5px;
                    z-index: 1000;
                }
                
                .card {
                    height:280px;
                    width:422px;
                    float:left;
                    margin: 0 10px 10px 0;
                }
                
                .main-content{
                    height:5000px;
                }
                
                .doughnut {
                
                    position: relative;
                    top: 34px;
                    left: 20px;
                }
                
                .doughnut .risk_category {
                    width:135px;
                    margin-right:10px;
                    float:left;
                }
                
                .doughnut .risk_legend {
                    float:left;
                    margin-top:14px;
                }
                
                .doughnut .risk_legend .risk_legend_item_color {
                    width: 10px;
                    height: 10px;
                    display: inline-block;
                    margin-right: 5px;
                    border:1px solid;
                }
                .doughnut .risk_legend .risk_legend_item_label {
                    display: inline-block;
                     font-size: 14px;
                    
                }
                
                .doughnut .risk_legend .risk_legend_item_label label{
                    width:160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                   line-height: 16px;
                   vertical-align: sub;
                }
                
                .doughnut .risk_legend .risk_legend_item_label .number{
                    width:20px;
                    display:inline-block;
                    text-align: right;
                }
                
                .doughnut .risk_legend .risk_legend_item_label .percent{
                    color:grey;
                    font-size: 10px;
                    display:inline-block;
                    text-align: right;
                    width:35px;
                }
                
                
                
                
                
                .doughnut .prediction_counter {
                    width:135px;
                    margin-right:10px;
                    float:left;
                }
                
                .doughnut .prediction_legend {
                    float:left;
                    margin-top:30px;
                }
                
                .doughnut .prediction_legend .prediction_legend_item_color {
                    width: 10px;
                    height: 10px;
                    display: inline-block;
                    margin-right: 5px;
                    border:1px solid;
                }
                .doughnut .prediction_legend .prediction_legend_item_label {
                    display: inline-block;
                }
                
                .doughnut .prediction_legend .prediction_legend_item_label label{
                    width:60px;
                }
                
                .doughnut .prediction_legend .prediction_legend_item_label .number{
                    min-width:40px;
                    display:inline-block;
                    text-align:right;
                }
                
                .doughnut .prediction_legend .prediction_legend_item_label .percent{
                    color:grey;
                    font-size: 10px;
                    text-align:right;
                    display:inline-block;
                    width:40px;
                }
                
                
                
                
                .table {
                    line-height: 14px;
                }
                
                .top-padding {
                    padding-top: 30px;
                }
                
                button svg {
                    position: relative;
                    bottom: 1px;
                }
                
                .risky_total {
                    position:relative;
                    top: -72px;
                    left:43px;
                    font-size: 10px;
                    font-weight: bold;
                }
                
                .prediction_total {
                    position:relative;
                    top: -73px;
                    left:41px;
                    font-size: 10px;
                    font-weight: bold;
                }
                
                .rdt_TableHead  .rdt_TableHeadRow{
                    background-color:#ebebeb;
                    font-weight:bold;
                    color:grey;
                }
                
                .table td {
                    cursor: pointer;
                }
                
                .table {
                    color:grey;
                }
                
                .editable {
                    cursor: pointer;
                    color: grey;
                }
                
                .modal {
                    display:block;
                }
                
                .hide {
                    display:none;
                }
                
                .modal-content button{
                    --bs-btn-padding-y: .25rem; 
                    --bs-btn-padding-x: .5rem;
                    --bs-btn-font-size: .75rem;
                    padding:5px 9px;
                }
                
                a.download {
                    margin:0 20px;
                    color:rgb(119, 119, 119);
                }
                
                .upload {
                    cursor: pointer;
                }
                
                .nav a.nav-link {
                    color:rgb(119, 119, 119);
                }
                
                .nav-item {
                    margin-left: 10px;
                }
                
                .rdt_TableBody a {
                    color: var(--bs-link-color);
                    text-decoration: underline;
                }

                `}</style>
                <div className="container">
                            <div className="card" >
                                <div className="card-header">
                                    Confusion Matrix
                                </div>
                                <div className="card-body">
                                    <ul className="nav nav-pills0 justify-content-end">
                                        <li className="nav-item">
                                            <a className="nav-link active" aria-current="page" data-bs-toggle="pill" href="#t1">{lastMonth}</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-bs-toggle="pill" href="#t2">{overall}</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="t1" className="tab-pane active">
                                            <Table key={new Date()}  data={confusionMonth}/>
                                        </div>
                                        <div id="t2" className="tab-pane fade">
                                            <Table data={confusionAll} setFilter={setConfusionFilter} filter={confusionFilter}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       
                            <div className="card" >
                                <div className="card-header">
                                Breakdown of Risk Levels
                                </div>
                                <div className="card-body">
                                    <ul className="nav nav-pills0 justify-content-end">
                                        <li className="nav-item">
                                            <a className="nav-link active" aria-current="page" data-bs-toggle="pill" href="#t11">{lastMonth0}</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-bs-toggle="pill" href="#t21">{firstMonth + ' - ' + lastMonth0}</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="t11" className="tab-pane active">
                                            <div className="doughnut">
                                             <PredictionCounter rows={predictionCounterMonth}/>
                                            </div>
                                        </div>
                                        <div id="t21" className="tab-pane fade">
                                            <div className="doughnut">
                                            <PredictionCounter rows={predictionCounterAll}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="card" >
                                <div className="card-header">
                                Severe Risk Change Categories
                                </div>
                                <div className="card-body">
                                    <ul className="nav nav-pills0 justify-content-end">
                                        <li className="nav-item">
                                            <a className="nav-link active" aria-current="page" data-bs-toggle="pill" href="#t111">{lastMonth0}</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-bs-toggle="pill" href="#t211">{firstMonth + ' - ' + lastMonth0}</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">
                                        <div id="t111" className="tab-pane active">
                                            <div className="doughnut">
                                             <RiskyCategory rows={riskyCategoryMonth}/>
                                            </div>
                                        </div>
                                        <div id="t211" className="tab-pane fade">
                                            <div className="doughnut">
                                            <RiskyCategory rows={riskyCategoryAll}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                    
                        
                        <div className="card" >
                                <div className="card-header">
                                    Case Volume
                                </div>
                                <div className="card-body top-padding">
                                    <CaseVolume data={caseVolume} />
                                </div>
                            </div>
                        
                        <div className="card" >
                                <div className="card-header">
                                    Model Performance
                                </div>
                                <div className="card-body top-padding">
                                    <ModelPerformance data={modelPerformance} />
                                </div>
                            </div>
                       
                        <div className="card" >
                            <div className="card-header">
                                Performance Breakdown
                            </div>
                            <div className="card-body">
                                <ul className="nav nav-pills0 justify-content-end">
                                    <li className="nav-item">
                                        <a className="nav-link active" aria-current="page" data-bs-toggle="pill" href="#t12">{lastMonth}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" data-bs-toggle="pill" href="#t22">{overall}</a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div id="t12" className="tab-pane active">
                                        <PerformanceBreakdown data={performanceBreakdownMonth}/>
                                    </div>
                                    <div id="t22" className="tab-pane fade">
                                    <PerformanceBreakdown data={performanceBreakdownAll}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                </div>
                <div className="container shade">
                    <DataTable   data={rows}  filter={confusionFilter} setNote={setNote}  setMessage={setMessage}/>
                </div>

                <div className={"modal " + (note === undefined? 'hide' : '')} tabIndex="-1" role="dialog" id="editorModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit GCM Note</h5>
                            
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setNote(undefined)}></button>
                        </div>
                        <div className="modal-body">
                            <form role="form" method="POST" action="">
                            <div className="mb-3">
                                <label className="form-label">Business Name</label>
                                <div>
                                    <input type="text" className="form-control " name="email" readOnly value={note? note.BusinessName : ''} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">GCM Notes</label>
                                <div>
                                    
                                    <textarea  name="note" className="form-control " value={note? note.GCMNotes : ''} onChange={()=>setNote(this.value)}/>
                                </div>
                            </div>
                            
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary btn-sm " onClick={()=>setNote(undefined)}>Save changes</button>
                            <button type="button" className="btn btn-secondary btn-sm " data-dismiss="modal" onClick={()=>setNote(undefined)}>Close</button>
                        </div>
                        </div>
                    </div>
                    </div>

                <Message msg={message} setMessage={setMessage} />
            </Layout>
    );
}

export default App;
