import React, {useRef, useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap/dist/js/bootstrap.min.js";
import Layout from '../../components/Layout';
import Message from "../../components/Message";
import "cytoscape-context-menus/cytoscape-context-menus.css";
import "cytoscape-navigator/cytoscape.js-navigator.css";
import http from "../../http-common";
import { getDemoConfigWithId, numberWithCommas } from '../../utils';
import State from "./State";
import Path from "./Path";
import Close from "./Close";
import Button from "./Button";
import InfoCard from "./InfoCard";
import DragSelectionContainer from "./DragSelectionContainer";
import FlowDiagram from "./FlowDiagram";
import InfoPanel from "./InfoPanel";
import View from "./View";
//import UncontrolledDiagram from "./UncontrolledDiagram";
import data from "../../public/data/flow/data";
import data2 from "../../public/data/flow/data2";
import { set } from "nprogress";
import styles from './FLOW.module.css';
// require('./index.less');
// require('./flow.less');



//console.log('styles', styles);

function App() {
	//const svr = 'http://localhost:8888 ';
	const demoData = getDemoConfigWithId('flow'); 
	let svr = demoData.backend_api_url;
	svr = 'https://www.postman-echo.com/post';
	const [openAmount, setOpenAmount] = useState(0);
	const [openPercent, setOpenPercent] = useState(0);
	const [openColor, setOpenColor] = useState('red');
	const [csatAmount, setCsatAmount] = useState(0);
	const [csatPercent, setCsatPercent] = useState(0);
	const [csatColor, setCsatColor] = useState('red');
	const [time2CloseAmount, setTime2CloseAmount] = useState(0);
	const [time2ClosePercent, setTime2ClosePercent] = useState(0);
	const [time2CloseColor, setTime2CloseColor] = useState('red');
	const [vs, setVs] = useState('Last 3 months');
  	const [message, setMessage] = useState(undefined);
	const [showPathPanel, setShowPathPanel] = useState(true);
	const [showInfoPanel, setShowInfoPanel] = useState(false);
	const [view, setView] = useState('Time');
	const [maxDate, setMaxDate] = useState('2023-01-01');
	const [minDate, setMinDate] = useState('2023-02-01');
	const [attributes, setAttributes] = useState([]);
	const [showInfoCard, setShowInfoCard] = useState(true);
	const [maxView, setMaxView] = useState(false);
	const [paths, setPaths] = useState([]);
	const [teams, setTeams] = useState([]);
	const [timeInfo, setTimeInfo] = useState([]);
	const [frequencyInfo, setFrequencyInfo] = useState([]);
	const [pageviewInfo, setPageviewInfo] = useState([]);
	const [nodeInfo, setNodeInfo] = useState(undefined);
	const [schema, setSchema] = useState(undefined);
	const [dataset, setDataset] = useState('any');
	const [startDate, setStartDate] = useState('2023-01-01');
	const [endDate, setEndDate] = useState('2023-02-01');
	const [dataVersion, setDataVersion] = useState(0);
	const [team, setTeam] = useState('');
	const [dataId, setDataId] = useState('940c3492-5ec3-11ed-9b6a-0242ac120002');
	
  	const [selectedIndexes, setSelectedIndexes] = useState([0]);
	const [prevouseSelectedIndexes, setPrevouseSelectedIndexes] = useState([0]);
	const [selected, setSelected] = useState(0);


	const handleZoomReset = (isMax) => {
		if(isMax){
			
			//setShowInfoPanel(false);
			setMaxView(true);
		}else{
			
			setMaxView(false);
		}
		
	}

	const reset  = () => {
		//console.log('reset')
		//setShowInfoPanel(false);
		setShowInfoCard(true);
		
		
		setSelected(0);
		
	}
	
	

	function secondsToDhms(seconds) {
		seconds = Number(seconds);
		var d = Math.floor(seconds / (3600*24));
		var h = Math.floor(seconds % (3600*24) / 3600);
		var m = Math.floor(seconds % 3600 / 60);
		var s = Math.floor(seconds % 60);
		
		var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
		var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
		var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
		var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
		return dDisplay + hDisplay + mDisplay + sDisplay;
	}

	const transform = (data) => {
		let schema = [];
		let clss= "nodeIcon ";

		data.allActivities.forEach((activity) => {
			activity.id = activity.name;
			activity.displayName = activity.name;
			
			//console.log('activity', activity);
			if(activity.name && activity.name.includes('Status Changed to')){
				activity.status = activity.name.replace('Status Changed to ', '');
			}
			else 
			{
				activity.status = '';
			}
			//console.log('activity', activity);

			activity.kind = activity.displayName == 'New Case Opened' ? 'start' : activity.displayName == 'end' ? 'end' : 'case';
			schema.push({group: 'nodes', classes: clss, data: activity});
		});

		let timeEdges = [];
		let frequencyEdges = [];
		let pageviewEdges = [];
		data.graph.forEach((edge) => {
			edge.source = edge.from;
			edge.target = edge.to;
			edge.group = 'edges';
			edge.classes = 'edge';
			edge.timeError = false;
			edge.id = edge.from + '-' + edge.to;
			edge.frequencyError = false;
			edge.pageviewError = false;
			edge.seconds = edge.time;
			edge.time = secondsToDhms(edge.time);
			schema.push({data: edge});
			if(edge.analytics['delaySeverity'] !== 'NONE'){
				timeEdges.push(edge);
				edge.timeError = true;
			}
			if(edge.analytics['isMostFrequent'] === true){
				frequencyEdges.push(edge);
				edge.frequencyError = true;
			}
			if(edge.analytics['isMostViewed'] === true){
				pageviewEdges.push(edge);
				edge.pageviewError = true;
			}
		});
		setTimeInfo(timeEdges);
		setFrequencyInfo(frequencyEdges);
		setPageviewInfo(pageviewEdges);
		

		
		//console.log('transform', schema, timeEdges, frequencyEdges, pageviewEdges)
		return schema;
	}

	const postVariants = () => {

		
		  
		let data = {"variants": [{"id": 1, "percentage": 25.5}, {"id": 2, "percentage": 50.2}, {"id": 3, "percentage": 10.2}, {"id": 4, "percentage": 5.1}, {"id": 5, "percentage": 4.6}, {"id": 6, "percentage": 2.5}, {"id": 7, "percentage": 1.7}, {"id": 8, "percentage": 1.2}], "dataIdentifier": "940c3492-5ec3-11ed-9b6a-0242ac120002"}


			setPaths(data.variants);
			setDataId(data.dataIdentifier);
			postGraph(data.variants, data.dataIdentifier);
		
	};

	const handleSelect = () => {
		if(prevouseSelectedIndexes.equals(selectedIndexes)){
			return;
		}

		setPrevouseSelectedIndexes(selectedIndexes);
		postGraph(paths, dataId);
	}

	const postGraph = (paths, dataId) => {
		
 		let data = {"graph": [{"from": "New Case Opened", "to": "Owner Changed", "time": null, "frequency": null, "pageview": null, "analytics": {"cloudAverageTime": 350, "cloudAverageFrequency": 200, "cloudAveragePageView": 100, "delaySeverity": "NONE", "isMostFrequent": true, "isMostViewed": true}}, {"from": "New Case Opened", "to": "Status Changed to Working", "time": 86400, "frequency": 345, "pageview": 250, "analytics": {"cloudAverageTime": 600, "cloudAverageFrequency": 20, "cloudAveragePageView": 50, "delaySeverity": "SEVERE_DELAY", "isMostFrequent": true, "isMostViewed": false}}, {"from": "Owner Changed", "to": "Status Changed to Need More Information", "time": 7200, "frequency": 345, "pageview": 2000, "analytics": {"cloudAverageTime": 100, "cloudAverageFrequency": 2, "cloudAveragePageView": 4, "delaySeverity": "NONE", "isMostFrequent": false, "isMostViewed": true}}, {"from": "Status Changed to Need More Information", "to": "Status Changed to Need More Information", "time": 86400, "frequency": 315, "pageview": 2000, "analytics": {"cloudAverageTime": 100, "cloudAverageFrequency": 2, "cloudAveragePageView": 4, "delaySeverity": "SEVERE_DELAY", "isMostFrequent": false, "isMostViewed": true}}, {"from": "Status Changed to Need More Information", "to": "Status Changed to Working", "time": 2500, "frequency": 320, "pageview": 10, "analytics": {"cloudAverageTime": 300, "cloudAverageFrequency": 200, "cloudAveragePageView": 100, "delaySeverity": "NONE", "isMostFrequent": false, "isMostViewed": false}}, {"from": "Status Changed to Working", "to": "Status Changed to Closed", "time": 10800, "frequency": 345, "pageview": 50, "analytics": {"cloudAverageTime": 300, "cloudAverageFrequency": 250, "cloudAveragePageView": 100, "delaySeverity": "NONE", "isMostFrequent": false, "isMostViewed": false}}, {"from": "Status Changed to Working", "to": "Owner Changed", "time": 10800, "frequency": 2445, "pageview": 100, "analytics": {"cloudAverageTime": 600, "cloudAverageFrequency": 20, "cloudAveragePageView": 8, "delaySeverity": "NONE", "isMostFrequent": false, "isMostViewed": false}}, {"from": "Status Changed to Working", "to": "Status Changed to Solution Provided", "time": 10800, "frequency": 2445, "pageview": 100, "analytics": {"cloudAverageTime": 400, "cloudAverageFrequency": 20, "cloudAveragePageView": 8, "delaySeverity": "NONE", "isMostFrequent": false, "isMostViewed": false}}, {"from": "Status Changed to Closed", "to": "end", "time": 10800, "frequency": 2445, "pageview": 100, "analytics": {"cloudAverageTime": 600, "cloudAverageFrequency": 20, "cloudAveragePageView": 8, "delaySeverity": "NONE", "isMostFrequent": false, "isMostViewed": false}}], "allActivities": [{"name": "New Case Opened"}, {"name": "Owner Changed", "frequency": 4, "noOfCases": 49728}, {"name": "Status Changed to Working", "frequency": 7, "noOfCases": 49728}, {"name": "Status Changed to Need More Information", "frequency": 11, "noOfCases": 12754}, {"name": "Status Changed to Solution Provided", "frequency": 4, "noOfCases": 1572}, {"name": "Status Changed to Closed", "frequency": 5, "noOfCases": 29868}, {"name": "end"}], "avgTimeToClose": {"value": 108000, "percent": 25, "color": "green"}, "avgCSAT": {"value": 55.31, "percent": 15, "color": "red"}, "openCases": {"value": 4712, "percent": 50, "color": "red"}, "attributes": ["Time", "Frequency", "PageView"]}


			setSchema(transform(data));
			setOpenAmount(data.openCases['value']);
			setOpenPercent(data.openCases['percent']);
			setOpenColor(data.openCases['color']);
			setCsatAmount(data.avgCSAT['value']);
			setCsatPercent(data.avgCSAT['percent']);
			setCsatColor(data.avgCSAT['color']);
			setTime2CloseAmount(data.avgTimeToClose['value'] );
			setTime2ClosePercent(data.avgTimeToClose['percent']);
			setTime2CloseColor(data.avgTimeToClose['color']);
			setAttributes(data.attributes);
			setMessage(undefined);
			setDataVersion(dataVersion + 1);
			
			reset(undefined);
		
	};


	const getTeams = () => {
		const response = {"teams": ["Northwest", "Southwest", "East", "West", "North", "South", "Central"], "startDate": 1671819168000, "endDate": 1674497568000};

			setTeams(response.teams);
			setTeam(response.teams[0]);
			const startDate = new Date(response.startDate ).toISOString().split('T')[0];
			const endDate = new Date(response.endDate ).toISOString().split('T')[0];
		
			setMaxDate(endDate);
			setMinDate(startDate);
			setStartDate(startDate);
			setEndDate(endDate);
			postVariants();
	};

	useEffect(() => {
		getTeams();	
	}, []);   

  	return (
		<Layout currentMenu={"/flow"} title={demoData.name}  data-disableselect={true} clean={true}>
			<div className={styles.container}>
				<div className={styles.generate}>
				<form className="form">
					<div className={'row ' + styles.row }>
						<div className="col-3">
							<label>Team</label>
							<select className="form-select" value={team} onChange={(e)=>setTeam(e.target.value)}>
								{teams && teams.map((team, index) => (
									<option key={index} value={team}>{team}</option>
								))}
							</select>
						</div>
						<div className="col-3">
							<label>Start Date</label>
							<input type="date" className="form-control" value={startDate} min={minDate} max={endDate} onChange={(e)=>setStartDate(e.target.value)}/>
						</div>
						<div className="col-3">
							<label>End Date</label>
							<input type="date" className="form-control" value={endDate} min={startDate} max={maxDate}  onChange={(e)=>setEndDate(e.target.value)}/>
						</div>
						<div className="col-3">
							
							<button type="button" className="btn btn-primary btn-sm" onClick={postVariants}>Generate</button>
						</div>
					</div>
				</form>
				</div>
				<div className={'menu ' + styles.menu}>
					<div className="">
						<Path topCount={selectedIndexes.length} selector={nodeInfo} />
						<State title="Open &nbsp;&nbsp;&nbsp; Cases" amount={numberWithCommas(openAmount)} percent={openPercent} color={openColor} width={33}/>
						<State title="Average CSAT" amount={csatAmount} percent={csatPercent} color={csatColor} width={33}/>
						<State title="Average &nbsp;&nbsp;&nbsp; Time to Close" amount={time2CloseAmount} percent={time2ClosePercent} color={time2CloseColor} width={63}/>
						<State title={"vs " + vs} width={80}/>
					</div>
				</div>
				<div className={styles["container-fluid"] + ' ' + styles["fill-height"]}>
					<Button id="pathPanelExtend" label="Change View" active={showPathPanel} disable={maxView} callback={setShowPathPanel}/>
					



					<div className={styles.pathPanel + ' ' + (showPathPanel? '' : styles.hide)}>
						<div className={styles.pathPanelHeader}>
							Change View <Close id="pathPanelClose" active={showPathPanel} callback={setShowPathPanel}/>
						</div>
						<div className={styles.pathPanelFilter}>
							<View attribute="Time" view={view} setView={setView} reset={reset} attributes={attributes} />
							<View attribute="Frequency" view={view} setView={setView} reset={reset} attributes={attributes} />
							<View attribute="PageView" view={view} setView={setView} reset={reset} attributes={attributes} />
						</div>
						<div className={styles.pathPanelPath} >
							<div className={styles.pathHeader}>
								Variants
							</div>
							<DragSelectionContainer paths={paths} selectedIndexes={selectedIndexes} setSelectedIndexes={setSelectedIndexes} handleSelect={handleSelect}/>
							
						</div>
					</div>
					
					<div className={styles.diagram+  ' ' + (maxView? styles['full-screen'] :  "" ) + ' ' + (showPathPanel?  styles.leftMargin : "") + ' ' + (showInfoPanel? styles.rightMargin : '')}>
						<FlowDiagram data={schema} handleZoomReset={handleZoomReset}  
							showPathPanel={showPathPanel} 
							maxView={maxView} 
							setMaxView={setMaxView} 
							showInfoPanel={showInfoPanel}
							setShowInfoPanel={setShowInfoPanel}
							view={view.toLowerCase()}
							setView={setView}
							dataVersion={dataVersion}
							nodeInfo={nodeInfo}
							setNodeInfo={setNodeInfo}
							/>
						
						<InfoPanel callback={setShowInfoPanel} team={team} view={view.toLowerCase()} showInfoPanel={showInfoPanel} nodeInfo={nodeInfo} secondsToDhms={secondsToDhms} />
					</div>
					
				</div>
			</div>
			
			{view === 'Time' ? <InfoCard  view={view.toLowerCase()} alertEdges={timeInfo} showInfoCard={showInfoCard} setShowInfoCard={setShowInfoCard} setShowInfoPanel={setShowInfoPanel} setNodeInfo={setNodeInfo} nodeInfo={nodeInfo} selected={selected} setSelected={setSelected} />	:
			view === 'Frequency' ? <InfoCard  view={view.toLowerCase()} alertEdges={frequencyInfo} showInfoCard={showInfoCard} setShowInfoCard={setShowInfoCard} setShowInfoPanel={setShowInfoPanel} setNodeInfo={setNodeInfo} nodeInfo={nodeInfo}  selected={selected} setSelected={setSelected} />	:
			view === 'PageView' ? <InfoCard  view={view.toLowerCase()} alertEdges={pageviewInfo} showInfoCard={showInfoCard} setShowInfoCard={setShowInfoCard} setShowInfoPanel={setShowInfoPanel} setNodeInfo={setNodeInfo} nodeInfo={nodeInfo}  selected={selected} setSelected={setSelected} />	: null}		
			<Message msg={message} setMessage={setMessage}/>
  
		</Layout>
  	);
}

export default App;
