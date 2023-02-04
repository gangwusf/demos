import React, {useRef, useState, useLayoutEffect} from "react";
import styles from './FLOW.module.css';

import {
	Box,
	boxesIntersect,
	useSelectionContainer
  }  from "@air/react-drag-to-select";



const DragSelectionContainer = ({paths, selectedIndexes, setSelectedIndexes, handleSelect}) => {
  if(paths == null || paths.length == 0) return null;
  if(selectedIndexes == null) return null;


  const [selectionBox, setSelectionBox] = useState(null);
  const selectableItems = useRef([]);
  const elementsContainerRef = useRef(null);
  let { DragSelection } = useSelectionContainer({
    //eventsElement: ddContainerRef.current,
    onSelectionChange: (box) => {
      /**
       * Here we make sure to adjust the box's left and top with the scroll position of the window
       * @see https://github.com/AirLabsTeam/react-drag-to-select/#scrolling
       */
      
      if(box.left > 210) return;

      const  scrollAwareBox = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      };
     
      setSelectionBox(scrollAwareBox);
      const indexesToSelect  = [];
      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(scrollAwareBox, item)) {
          indexesToSelect.push(index);
        }
      });
      
      if(!indexesToSelect.equals(selectedIndexes)){
        setSelectedIndexes(indexesToSelect);
        //console.log("onSelectChange", box, selectableItems, indexesToSelect);
      }
     
    },
    onSelectionStart: (box) => {
      //console.log("OnSelectionStart", this, box);
    },
    onSelectionEnd: (box) => {
      //console.log("OnSelectionEnd", this, selectedIndexes, selectionBox, selectableItems, box)
      handleSelect();
    },
    disabled_shouldStartSelecting: (target) => {
      /**
       * In this example, we're preventing users from selecting in elements
       * that have a data-disableselect attribute on them or one of their parents
       */
      if (target instanceof HTMLElement) {
        let el = target;
        while (el.parentElement && !el.dataset.disableselect) {
          el = el.parentElement;
        }

        console.log("shouldStartSelecting", el.dataset.disableselect)
        return el.dataset.disableselect !== "true" && el.dataset.disableselect !== undefined;
      }
  
      /**
      * If the target doesn't exist, return false
      * This would most likely not happen. It's really a TS safety check
      */
      return false;
    },
    selectionProps: {
      style: {
        border: "2px dashed purple",
        borderRadius: 4,
        backgroundColor: "blue",
        opacity: 0.5,
		    display: "none"
      }
    },
    isEnabled: true
  });


  

		if (elementsContainerRef.current) {
        selectableItems.current = [];
				Array.from(elementsContainerRef.current.children).forEach((item) => {
          const { left, top, width, height } = item.getBoundingClientRect();
          selectableItems.current.push({ left, top, width, height });
				});
       // console.log('selectableItems', selectableItems.current)
		}
		  

    let max = 0;
    Object.keys(paths).forEach((key, i) => {
        if(paths[key]['percentage'] > max) max = paths[key]['percentage'];
    });
    const rate =  max == 0 ? 1: 50/max;
    
    const first = selectedIndexes[0];
    const last = selectedIndexes[selectedIndexes.length - 1];
    console.log('selectedIndexes', max, rate, selectedIndexes, first, last);
    return (
    <>
      <div className={styles.grid}>
        <div className={styles.col1}><label>0%</label></div>
        <div className={styles.col2}><label>{Math.round(rate * 20)}%</label></div>
        <div className={styles.col3}><label>{Math.round(rate * 40)}%</label></div>
        <div className={styles.col4}><label>{Math.round(rate * 60)}%</label></div>

      </div>
      <div id="elements-container" className={styles['elements-container']} ref={elementsContainerRef}  data-disableselect={false} >
        {Object.keys(paths).map((key, i) => (
            <div
            data-testid={`grid-cell-${i}`}
            key={i}
            className={styles.element + ` ${
            (selectedIndexes.includes(i) ? styles.selected : "") 
            + (parseInt(i) == first ? ' ' + styles.first : "")
            + (parseInt(i) == last ? ' ' + styles.last : "")
            } `}
        > <label>Variants {paths[key]['id']}</label> <div className={styles.bar} style={{width: paths[key]['percentage'] * rate + '%'}}></div> {paths[key]['percentage'] + '%'}</div>))}

        
      </div>
      <DragSelection />
      </>
    );

}

export default DragSelectionContainer;