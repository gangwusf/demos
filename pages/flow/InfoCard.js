import React, {useEffect, useRef, useState} from "react";
import { X, ChevronRight, ChevronLeft } from 'react-bootstrap-icons';
import styles from './FLOW.module.css';

const InfoCard = ({ view, alertEdges, showInfoCard, setShowInfoCard, setShowInfoPanel, setNodeInfo, nodeInfo, selected, setSelected}) => {

    if(!(showInfoCard && alertEdges && alertEdges[selected])) return false;
   
    let icon = view === 'time'? 'clock' : view === 'frequency' ? 'loop': 'search'
    
    const prev = () => {
        if(selected > 0) {
            setSelected(selected - 1);
            setNodeInfo(alertEdges[selected -1]);
        }

    }
    const next = () => {
        if(selected < alertEdges.length - 1) {
            setSelected(selected + 1);
            setNodeInfo(alertEdges[selected + 1]);
        }
    }
    //console.log('InfoCard', view, edge, selected, dg)
    /*
    if(selected >=0 && selected < alertEdges.length){
        
    }
    else {
        selected = 0;
    }
    
    */
    useEffect(()=>{
        if(!nodeInfo){
                setNodeInfo(alertEdges[selected]);
        }
    }, [alertEdges, selected, nodeInfo, setNodeInfo]) 
  
    return (

        <div className={"card "  + styles.card + ' ' +styles.info}>
            <div className={styles['info-close']} onClick={()=>setShowInfoCard(false)}>
                    <X />
                </div>
            <div className={'card-head ' + styles["card-header"]}>
                <div className="info-title">
                    
                </div>
                
            </div>
            <div className={'card-body ' + styles["card-body"]}>
                <div className="info-body-content">
                 <span className={styles.red + " " + view}><img src={'/demos/images/flow/'+icon+'.svg'} /> {view === 'time'? 'Significant delay' : view === 'frequency' ? 'Most Frequent': 'Excessive checks'} </span>
                  between <b>{alertEdges[selected].from}</b> and <b>{alertEdges[selected].to}</b>
                </div>
            </div>
            <div className={'card-footer ' + styles["card-footer"]}>

                <div className="info-footer-content">
                    {selected > 0 ? <ChevronLeft onClick={prev} /> : <div className={styles.space} />}
                    
                    <div className={styles.viewMore} onClick={()=>{setShowInfoPanel(true); }}>
                        View Analysis
                    </div>
                    {selected < alertEdges.length - 1 ? <ChevronRight onClick={next} /> :  <div className={styles.space} />}
                    
                </div>
            </div>
        </div>

    );

}

export default InfoCard;
