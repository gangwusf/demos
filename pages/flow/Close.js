import React, {useRef, useState} from "react";
import styles from './FLOW.module.css';

const Close = ({id, active, callback}) => {

    
    return (
        <img src="/images/close.svg" id={id} className={styles.close} alt="close" onClick={()=>callback(!active)}/>
    );

}

export default Close;