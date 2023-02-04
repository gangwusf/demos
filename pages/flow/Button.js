import React, {useRef, useState} from "react";
import styles from './FLOW.module.css';

const Button = ({id, label, active, disable, callback}) => {
    if(disable)  return false;
    
    return (
        
        
        !active ? 
        <button type="button" className={styles.btn + " btn btn-outline-primary btn-sm closed"} id={id} onClick={()=>callback(!active)}>
            {label} <div className="arrow-down-grey"></div>
        </button> : false
    );

}

export default Button;