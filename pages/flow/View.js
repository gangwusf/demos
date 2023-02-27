import React, {useRef, useState} from "react";
import styles from './FLOW.module.css';

const View = ({view, attribute, attributes, setView, reset}) => {

    if( !attributes || !attributes.includes(attribute) )  return false;
    
    return (
        <div className={styles.pathPanelFilterItem}>
            <img src={"/images/"+attribute+".svg"} alt={attribute} onClick={()=>{setView(attribute); reset()}} className={view === attribute ? styles.selected : ''} /> &nbsp; {attribute} &nbsp;
        </div>
    );

}

export default View;