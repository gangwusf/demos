import React, {useRef, useState} from "react";
import styles from './FLOW.module.css';

const State = ({title, amount='', percent='', color='', width=36}) => {

    const cardWidth = width+70+'px';
    const headerWidth = width+'px';
    
    return (
        <div className={"card " + styles.card} style={{width:cardWidth}}>
        <div className={"card-header " + styles['card-header']} style={{width:headerWidth}}>
            {title}
        </div>
        <div className={"card-body " + styles['card-body']}>
            <div className="amount">
                    <h6>{amount}</h6>
            </div>
            <div className={"percent " +color}>
                <div className={color === 'red'? styles['arrow-down'] : color === 'green' ? styles['arrow-up'] : ''}></div> {percent === ''? '' : percent+'%'}
            </div>
        </div>
    </div>
    );

}

export default State;