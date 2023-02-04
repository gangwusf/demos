import React, {useRef, useState} from "react";
import styles from './FLOW.module.css';

const Path = ({topCount, selector=undefined}) => {
//console.log('path', selector);
let s = undefined;
if(selector !== undefined){
    s = selector.to !== 'end' ?  selector.to : selector.from ;
} 
    return (
        <div className={styles.path}>
            <span>For Top {topCount} variants</span> { selector !== undefined? <span> ⟩  {s} </span> : null }
        </div>
    );

}

export default Path;