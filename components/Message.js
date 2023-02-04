import { set } from "nprogress";
import React, {useRef, useEffect, useState} from "react";
import { XCircleFill } from 'react-bootstrap-icons';

const Message = ({msg, setMessage}) => {

    let clss = 'alert alert-success  alert-dismissable';
    let styles = {margin:'50px', position:'fixed', top:'-20px', right:'100px', width:'350px'};

    if(msg) {
        if(msg.indexOf('Error') > -1 || msg.indexOf('Fail') > -1) {
           styles.backgroundColor = 'red';
           styles.color = 'white';
        }
        else {
            if(msg != "loading ..." && msg != "Uploading ...") {
                setTimeout(() => setMessage(null), 5000);
            }
        }

        return (
            <div className={clss} style={styles} > 
                <XCircleFill id="x" className="close" onClick={()=> setMessage(null)} /> 
                <span id="msg"> &nbsp; {msg}</span> 
            </div>
        );

    }
    else{

        return false;
         
    }
  
  };
  
  export default Message;
