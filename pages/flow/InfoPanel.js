import React, {useRef, useState} from "react";
import Close from "./Close";
import styles from './FLOW.module.css';

const InfoPanel = ({team, view, nodeInfo, showInfoPanel, callback, secondsToDhms}) => {
    console.log('InfoPanel', showInfoPanel, nodeInfo);
    if(!showInfoPanel || !nodeInfo || !nodeInfo.analytics)  return false;
    let selected = nodeInfo.to == 'end' ? nodeInfo.from : nodeInfo.to ;
    let pill = view === 'time'? 'Transition Delay' : view === 'frequency' ? 'Most Frequent': 'Excessive Checks';
    let avgpv = nodeInfo.analytics.cloudAveragePageView ? nodeInfo.analytics.cloudAveragePageView : 0;
    let avgtime = nodeInfo.analytics.cloudAverageTime ? nodeInfo.analytics.cloudAverageTime : 0;
    let avgfreq = nodeInfo.analytics.cloudAverageFrequency ? nodeInfo.analytics.cloudAverageFrequency : 0;
    let compare = view === 'time'? secondsToDhms(nodeInfo.seconds - avgtime ) : 
                view === 'frequency' ? nodeInfo.frequency - avgfreq : nodeInfo.pageview - avgpv;
    let unit = view === 'time'? '' : view === 'frequency' ? 'times' : 'views';
    let bar1 = view === 'time'? nodeInfo.time : view === 'frequency' ? nodeInfo.frequency : nodeInfo.pageview;
    let bar2 = view === 'time'? secondsToDhms(avgtime) : view === 'frequency' ? avgfreq : avgpv;
    const val1 = view === 'time'? nodeInfo.seconds : view === 'frequency' ? nodeInfo.frequency : nodeInfo.pageview;
    const val2 = view === 'time'? avgtime : view === 'frequency' ? avgfreq : avgpv;
    const barWidth = 50 * (val2 / val1 );
    return (
        
        <div className={styles.infoPanel+ " "  + (showInfoPanel? '' : styles.hide)}>
            <div className={styles.infoPanelHeader}>
                <div className={styles.active}> Analysis</div> <Close id="infoPanelClose" active={showInfoPanel} callback={()=>callback(false)}/>
                { nodeInfo && <div className={styles.infoPanelContentItem}>{selected}</div> }
                <div className={styles.tab}>Activity Analytics</div>
            </div>
            <div className={styles.infoPanelContent}>
                <div className={styles.pill}>
                    {pill}
                </div>
                
                <div className={"row " + styles.hide}>
                    <div className={"col-1 " + styles.screen}>
                        <img src="/images/flow/screen.svg" style={{'maxWidth':'none'}}/>
                    </div>
                    <div className={"col-5 " +  styles.viewcase }>
                        <div><b>View Case</b> </div>
                        <div>{nodeInfo.pageview} views, {nodeInfo.time}</div>
                    </div>
                    <div className="col-6">
                        <a href="#">View in Process Map</a>
                    </div>
                </div>
            
                <div className={styles.more}>
                    
                    {view == 'time' ? (nodeInfo.analytics.timeMsg? nodeInfo.analytics.timeMsg : <div><b>{bar1} {unit}</b> of delay between activities <b>{nodeInfo.from}</b> and <b>{nodeInfo.to}</b>. Delay is <b>{compare} {unit}</b> more than cloud average.</div>) :
                    view == 'frequency' ? (nodeInfo.analytics.frequencyMsg? nodeInfo.analytics.frequencyMsg : <div> <b>{nodeInfo.from}</b> is followed by <b>{nodeInfo.to}</b> <b>{bar1} {unit}</b>. This is <b>{compare} {unit}</b> more than cloud average.</div>) :
                    (nodeInfo.analytics.pageViewMsg? nodeInfo.analytics.pageViewMsg : <div>The Case is viewed <b>{bar1} times</b> between <b>{nodeInfo.from}</b> and <b>{nodeInfo.to}</b>. This is <b>{compare} times</b> more than cloud average.</div>) }

                </div>
                <div className={styles.legends}>
                    <div className={"row " + styles.team}>
                        <div className={"col-1 " + styles.legend+ ' ' +  styles['bg-red']}> </div>
                        <div className="col-5"> <b>Team {team}</b></div>
                    </div>
                    <div className="row">
                        <div className={"col-1 " + styles.legend+ ' ' +  styles['bg-blue']}> </div>
                        <div className="col-5"> Team Average</div>
                    </div>
                </div>
                <div className={styles.chart}>
                    <div>Need more information</div>
                    <div className=" ">
                        
                        <div className={styles["col-2"]}> <div className={"bar " + styles["bg-red"]} style={{width:'50%'}}> &nbsp; </div> {bar1}&nbsp;{unit}</div>
                        
                    </div>
                    <div className="">
                    
                        <div className={styles["col-2"]}> <div className={"bar " + styles["bg-blue"]} style={{width:barWidth + '%'}}> &nbsp;</div> {bar2}&nbsp;{unit}</div>
                    </div>
                </div>
            </div>
        </div> 
    );

}

export default InfoPanel;
