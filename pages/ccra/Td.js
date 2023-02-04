import React, {useEffect, useRef, useState} from "react";

const Td = ({ data, predicted, actual, setFilter, filter }) => { 
   // console.log('Table:', data);
    if(data === undefined)   return <td> No data </td>

   
    const handleClick = (e) => {
        if(!setFilter) return;
        //console.log('handleClick:', setFilter, filter);
        if(filter && filter[0] === predicted && filter[1] === actual) {
            setFilter(undefined);
           
        } else {
            
            setFilter([predicted, actual]);
        }
    }

   
    return (<td className={ predicted + ' ' + actual + ' ' + ((filter && filter[0] === predicted && filter[1] === actual) ? 'table-info' : '')} onClick={handleClick}>{data}</td>)
    };

export default Td;