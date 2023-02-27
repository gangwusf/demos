import React, {useRef, useState} from "react";
import styles from './FLOW.module.css';

const ButtonGroup = ({handleZoomIn, handleZoomOut, handleZoomReset, showPathPanel, maxView}) => {

    const svg = maxView? 'contract' : 'expend';
    return (
        <div className={styles["btn-group"] + ' btn-group ' + (showPathPanel? styles.leftMargin : '')} role="group" >
            <button type="button" className={styles.btn + " btn btn-outline-secondary btn-sm"} onClick={handleZoomIn}><img src="/images/zoomout.svg" /></button>
            <button type="button" className={styles.btn + " btn btn-outline-secondary btn-sm"} onClick={()=>handleZoomReset(!maxView)}><img src={"/images/"+svg+".svg"} /></button>
            <button type="button" className={styles.btn + " btn btn-outline-secondary btn-sm"} onClick={handleZoomOut}><img src="/images/zoomin.svg" /></button>
        </div>
    );

}

export default ButtonGroup;