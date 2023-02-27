import React, {useRef, useState, useEffect} from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import ButtonGroup from "./ButtonGroup";
import styles from './FLOW.module.css';

var nodeHtmlLabel = require("cytoscape-node-html-label");
var expandCollapse = require("cytoscape-expand-collapse");

var navigator = require("cytoscape-navigator");
cytoscape.use(dagre);

if (typeof cytoscape("core", "expandCollapse") === "undefined") {
  expandCollapse(cytoscape);
}
if (typeof cytoscape("core", "nodeHtmlLabel") === "undefined") {
  nodeHtmlLabel(cytoscape);
}

if (typeof cytoscape("core", "navigator") === "undefined") {
  navigator(cytoscape);
}

const nav_config = {
  container: '#navigation', // html dom element
  viewLiveFramerate: 0, // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
  thumbnailEventFramerate: 30, // max thumbnail's updates per second triggered by graph updates
  thumbnailLiveFramerate: false, // max thumbnail's updates per second. Set false to disable
  dblClickDelay: 200, // milliseconds
  removeCustomContainer: false, // destroy the container specified by user on plugin destroy
  rerenderDelay: 100 // ms to throttle rerender updates to the panzoom for performance
};

const FlowDiagram = ({ data, handleZoomReset, showPathPanel, maxView, setMaxView, showInfoPanel, setShowInfoPanel, view,  dataVersion, setNodeInfo, nodeInfo}) => {

  if(data === undefined) {
    return null;
  }
  let red = "#BA0517";
  
  const default_level = 1.8;
  const [level, setLevel] = useState(default_level);
  const [cyto, setCyto] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [diagramView, setDiagramView] = useState(undefined);
  const [nav, setNav] = useState(undefined);
  const [version, setVersion] = useState(undefined);
  const [showInfo, setShowInfo] = useState(undefined);
  const [sel, setSel] = useState(undefined);
  //console.log('FlowDiagram ',view, diagramView, selector);


  const handleZoomIn = () => {
    cyto.zoom({level:level - 0.1});
		setLevel(level - 0.1);
		//console.log('level', level);
        
	}

	const handleZoomOut = () => {
    cyto.zoom({level:level + 0.1});
		setLevel(level + 0.1);
        //console.log('level', level);
        
	}


const init = () => {
  //console.log('    init',view, diagramView, sel !== undefined, selector)
  
  nav && nav.destroy();
  cyto && cyto.destroy();
  let cy = cytoscape({
    container: document.getElementById("cy"),
  /*
    ready: function () {

  
      var api = this.expandCollapse({
        layoutBy: {
          name: "dagre",
          animate: "end",
          randomize: false,
          fit: false
        },
        fisheye: false,
        animate: true,
        undoable: false,
        cueEnabled: true,
        expandCollapseCuePosition: "top-left",
        expandCollapseCueSize: 16,
        expandCollapseCueLineSize: 24,
        expandCueImage: "./imgs/ic_expand_more.svg",
        collapseCueImage: "./imgs/ic_expand_less.svg",
        expandCollapseCueSensitivity: 1,
        edgeTypeInfo: "edgeType",
        groupEdgesOfSameTypeOnCollapse: false,
        allowNestedEdgeCollapse: true,
        zIndex: 999
      });
    },

  */
    style: [
      //CORE
      {
        selector: "core",
        css: {
          "active-bg-size": 0, //The size of the active background indicator.
          
        }
      },
  
      //NODE
      {
        selector: "node",
        css: {
          width: "14px",
          height: "14px",
         // shape: "none",
          //"background-color": "#fafafa",
          "font-family": "Nokia Pure Regular",
          "background-opacity": "1"
        }
      },
      //GROUP
      /*
      {
        selector: "node.cy-expand-collapse-collapsed-node",
        css: {
          width: "56px",
          height: "56px",
          "background-opacity": "0",
          "font-family": "Nokia Pure Regular"
        }
      },
      */
      {
        selector: "$node > node",
        css: {
          "background-color": "#fff",
          "background-opacity": "1",
          "border-width": "1px",
          "border-color": "#dcdcdc",
  
          //LABEL
          //label: "data(name)",
          color: "#000",
          shape: "rectangle",
          "text-opacity": "0.56",
          "font-size": "10px",
          "text-transform": "uppercase",
          "text-wrap": "none",
          "text-max-width": "75px",
          "padding-top": "16px",
          "padding-left": "16px",
          "padding-bottom": "16px",
          "padding-right": "16px"
        }
      },
      {
        selector: ":parent",
        css: {
          "text-valign": "top",
          "text-halign": "center"
        }
      },
      //EDGE
      {
        selector: "edge",
        style: {
          width: 1,
          "line-color": (ele) => { return (ele.data('timeError') && view == 'time')?  red :  
                                          ele.data('frequencyError') && view == 'frequency'? red:  
                                          ele.data('pageviewError') && view == 'pageview'? red: "#b8b8b8" },
          //"curve-style": "taxi", 
          //"taxi-direction": "leftward", 
          'font-family': 'FontAwesome, Nokia Pure Regular, helvetica neue Cantarell',
          "curve-style": "bezier",
          'target-arrow-shape': (ele) => { return view == 'frequency' && ele.data('frequencyError') ? 'triangle' : 'none' },
          'target-arrow-color': red,
          'arrow-scale': 0.8,
          
          //LABEL
          label: (ele) => { 
            let data = '';
            
            if(view == 'time') {
              if(ele.data('timeError')) {
                data = " \uf071" + ' Delay - ' + ele.data('time') ;
              } else {
                data = ele.data('time');
              }
            } else if(view == 'frequency') {
              if(ele.data('frequencyError')) {
                data = " \uf071" + ' Most Frequent - ' + (ele.data('frequency') ? ele.data('frequency') : ''  );
              } else {
                data = ele.data('frequency')? ele.data('frequency') : '' ;
              }
            } else if(view == 'pageview') {
              if(ele.data('pageviewError')) {
                data = " \uf071" + ' Checked - ' + (ele.data('pageview') ? ele.data('pageview') : '' ) ;
              } else {
                data = ele.data('pageview')? ele.data('pageview') : '';
              }
            }
            return data;
          },
          "text-opacity": 1, //"0.56",
          "font-size": "4px",
          "color":  (ele) => { return (ele.data('timeError') && view == 'time')?  "#fff"  :  
                                      ele.data('frequencyError') && view == 'frequency'? "#fff":  
                                      ele.data('pageviewError') && view == 'pageview'? "#fff": "#000" },
          "text-background-color":  (ele) => { return (ele.data('timeError') && view == 'time')?  red  :  
                                                      ele.data('frequencyError') && view == 'frequency'? red:  
                                                      ele.data('pageviewError') && view == 'pageview'? red: "#b8b8b8" },
          "text-background-opacity": 1,
          "text-background-padding": "2px",
          "text-margin-y": -4,
          /*
          "text-border-color": (ele) => { return (ele.data('timeError') && view == 'time')?  "#ff0000"  :  
                                                  ele.data('frequencyError') && view == 'frequency'? "#ff0000":  
                                                  ele.data('pageviewError') && view == 'pageview'? "#ff0000": "#ccc" },
          "text-border-style": "solid",
          "text-border-width": "0.5px",
          "text-border-opacity": 1,*/
          "text-background-shape": "roundrectangle", //not working

        }
      },
      /*
      {
        selector: "edge.hover",
        style: {
          width: 2,
          "line-color": "#239df9"
        }
      },*/
      {
        selector: "edge:selected",
        style: {
          width: 2
          
        }
      }
    ],
  
    layout: {
      name: "dagre",
      padding: 24,
      spacingFactor: 1.5,
      fit: true
    },
  
    elements: data,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    autoungrabify: false
  });
  
  setCyto(cy);
  //cy.fit();
  //NODE EVENTS
  cy.on("mouseover", "node", function (e) {
    e.target.addClass("hover");
  });
  cy.on("mouseout", "node", function (e) {
    e.target.removeClass("hover");
  });
  
  cy.on("mousedown", "node", function (e) {
    e.target.addClass("hover");
  });
  cy.on("click", "node", function (e) {
    console.log("clicked:" + this);

  });
  
  //EDGES EVENTS
  cy.on("mouseover", "edge", function (e) {
    e.target.addClass("hover");
  });
  cy.on("mouseout", "edge", function (e) {
    e.target.removeClass("hover");
  });
  
  cy.on("click", "edge", function (e) {
    setNodeInfo(this.data());
    nodeInfo = this.data();
    setShowInfoPanel(true);
  });
  cy.nodeHtmlLabel([
    /*
    {
      query: ".groupIcon",
      halign: "center",
      valign: "center",
      halignBox: "center",
      valignBox: "center",
      tpl: function (data) {
        return `<div class="group ${data.collapsedChildren ? "show" : "hide"}">
                  <span class="group-graphic alarmSeverity-${data.alarmSeverity}">
                    <i class="icon icon-group"></i>
                    <span class="overlay"></span>
                  </span>
                  <span class="group-label">${data.displayName}</span>
                </div>`;
      }
    },
    {
      query: ".groupIcon.hover",
      halign: "center",
      valign: "center",
      halignBox: "center",
      valignBox: "center",
      tpl: function (data) {
        return `<div class="group ${data.collapsedChildren ? "show" : "hide"}">
                  <span class="group-graphic hover alarmSeverity-${
                    data.alarmSeverity
                  }">
                    <i class="icon icon-group"></i>
                    <span class="overlay"></span>
                  </span>
                  <span class="group-label">${data.displayName}</span>
                </div>`;
      }
    },
    {
      query: ".groupIcon:selected",
      halign: "center",
      valign: "center",
      halignBox: "center",
      valignBox: "center",
      tpl: function (data) {
        return `<div class="group ${data.collapsedChildren ? "show" : "hide"}">
                  <span class="group-graphic selected alarmSeverity-${
                    data.alarmSeverity
                  }">
                    <i class="icon icon-group"></i>
                    <span class="overlay"></span>
                  </span>
                  <span class="group-label">${data.displayName}</span>
                </div>`;
      }
    },
    {
      query: ".groupIcon.hover:selected",
      halign: "center",
      valign: "center",
      halignBox: "center",
      valignBox: "center",
      tpl: function (data) {
        return `<div class="group ${data.collapsedChildren ? "show" : "hide"}">
                  <span class="group-graphic hover selected alarmSeverity-${
                    data.alarmSeverity
                  }">
                    <i class="icon icon-group"></i>
                    <span class="overlay"></span>
                  </span>
                  <span class="group-label">${data.displayName}</span>
                </div>`;
      }
    },
   */
    {
      query: ".nodeIcon",
      halign: "center",
      valign: "center",
      halignBox: "center",
      valignBox: "center",
      tpl: function (data) {
        const cls = styles[data.kind];
        if(data.status == '')
        {
          return `<div class="${styles.element}  ${cls} ">
            <span class="${styles['element-graphic']}">
              
              <img src="/images/flow/${data.kind}.svg" class="${styles.icon}" />
            </span>
            <div title="${data.displayName}" class="${styles['element-label']}">
              <b>${data.displayName}</b>
              <span class="overlay"></span>
            </div>
          </div>`;
        }
        else{
          return `<div class="${styles.element}   ${cls}}">
            <span class="${styles['element-graphic']}">
              
              <img src="/images/flow/${data.kind}.svg" class="${styles.icon}" />
            </span>
            <div title="${data.displayName}" class="${styles['element-label']}">
              <div>Status Changed To</div>
              <b>${data.status}</b>
              <span class="overlay"></span>
            </div>
          </div>`;
        }
        
      }
    },
    {
      query: ".nodeIcon.hover",
      halign: "center",
      valign: "center",
      halignBox: "center",
      valignBox: "center",
      tpl: function (data) {
        
        const cls = styles[data.kind];
        if(data.status == '')
        {
          return `<div class="${styles.element}   ${cls}">
            <span class="${styles['element-graphic']}">
            <img src="/images/flow/${data.kind}.svg" class="${styles.icon}" />
              
            </span>
            <div title="${data.displayName}" class="${styles['element-label']} hover">
              <b>${data.displayName}</b>
              <span class="${styles.overlay}"></span>
            </div>
          </div>`;
        }
        else{
          return `<div class="${styles.element}   ${cls}">
            <span class="${styles['element-graphic']}">
            <img src="/images/flow/${data.kind}.svg" class="${styles.icon}" />
              
            </span>
            <div title="${data.displayName}" class="${styles['element-label']} hover">
              <div>Status Changed To</div>
              <b>${data.status}</b>
              <span class="${styles.overlay}"></span>
            </div>
          </div>`;
        }
      }
    },
    {
      query: ".nodeIcon:selected",
      halign: "center",
      valign: "center",
      halignBox: "center",
      valignBox: "center",
      tpl: function (data) {
        const cls = styles[data.kind];
        if(data.status == '')
        {
          return `<div class="${styles.element}   ${cls}">
            <span class="${styles['element-graphic']}">
            <img src="/images/flow/${data.kind}.svg" class="${styles.icon}" />
              
            </span>
            <div title="${data.displayName}" class="${styles['element-label']} ${styles['selected']}">
              <b>${data.displayName}</b>
              <span class="${styles.overlay}"></span>
            </div>
          </div>`;
        }
        else{
          return `<div class="${styles.element}   ${cls}">
            <span class="${styles['element-graphic']} ">
            <img src="/images/flow/${data.kind}.svg" class="${styles.icon}" />
              
            </span>
            <div title="${data.displayName}" class="${styles['element-label']} ${styles['selected']}">
              <div>Status Changed To</div>
              <b>${data.status}</b>
              <span class="${styles.overlay}"></span>
            </div>
          </div>`;
        }
      }
    },
    {
      query: ".nodeIcon.hover:selected",
      halign: "center",
      valign: "center",
      halignBox: "center",
      valignBox: "center",
      tpl: function (data) {
        const cls = styles[data.kind];
        if(data.status == '')
        {
          return `<div class="${styles.element} ${cls}">
            <span class="${styles['element-graphic']}">
            <img src="/images/flow/${data.kind}.svg" class="${styles.icon}" />
              
            </span>
            <div title="${data.displayName}" class="${styles['element-label']} ${styles['hover']} ${styles['selected']}">
              <b>${data.displayName}</b>
              <span class="${styles.overlay}"></span>
            </div>
          </div>`;
        }
        else{
          return `<div class="${styles.element} ${cls}">
            <span class="${styles['element-graphic']}">
            <img src="/images/flow/${data.kind}.svg" class="${styles.icon}" />
              
            </span>
            <div title="${data.displayName}" class="${styles['element-label']} ${styles['hover']} ${styles['selected']}">
              <div>Status Changed To</div>
              <b>${data.status}</b>
              <span class="${styles.overlay}"></span>
            </div>
          </div>`;
        }
      }
    }
  ]);
  /*
  cy.nodes().on("expandcollapse.beforecollapse", function (e) {
    console.log("Triggered before a node is collapsed");
  });
  
  cy.nodes().on("expandcollapse.aftercollapse", function (e) {
    console.log("Triggered after a node is collapsed");
  });
  
  cy.nodes().on("expandcollapse.beforeexpand", function (e) {
    console.log("Triggered before a node is expanded");
  });
  
  cy.nodes().on("expandcollapse.afterexpand", function (e) {
    console.log("Triggered after a node is expanded");
  });
  
  cy.edges().on("expandcollapse.beforecollapseedge", function (e) {
    console.log("Triggered before an edge is collapsed");
  });
  
  cy.edges().on("expandcollapse.aftercollapseedge", function (e) {
    console.log("Triggered after an edge is collapsed");
  });
  
  cy.edges().on("expandcollapse.beforeexpandedge", function (e) {
    console.log("Triggered before an edge is expanded");
  });
  
  cy.edges().on("expandcollapse.afterexpandedge", function (e) {
    console.log("Triggered after an edge is expanded");
  });
  
  cy.nodes().on("expandcollapse.beforecollapse", function (event) {
    var node = this;
    event.cy
      .nodes()
      .filter((entry) => entry.data().parent === node.id())
      .map((entry) => entry.data("_hidden", "node-hidden"));
    node.data("_hidden", "");
  });
  
  cy.nodes().on("expandcollapse.afterexpand", function (event) {
    var node = this;
    event.cy
      .nodes()
      .filter((entry) => entry.data().parent === node.id())
      .map((entry) => entry.data("_hidden", ""));
    node.data("_hidden", "node-hidden");
  });
  
*/
  cy.reset();
  cy.fit();
  cy.zoom({level:level});

  

  setNav(cy.navigator(nav_config));
  setVersion(dataVersion);
  setShowInfo(showInfoPanel);
  setDiagramView(view);
  setSel(nodeInfo);
}



if(cyto !== null && view !== undefined && (view !== diagramView || version !== dataVersion )){
  //console.log("reinit", view, diagramView, version, dataVersion, showInfoPanel, showInfo);
  setLevel(default_level);
  init();

}
else if(cyto !== null && cyto !== undefined && view !== undefined && (nodeInfo !== undefined && nodeInfo !== sel )){
 /*
  cyto.reset()
  cyto.zoom({level:level});
  cyto.fit( cyto.$(':selected'), 500 );
  cyto.nodes().shift({ x: -90, y: -100 });
*/
/*
  let selected = selector.to.toLowerCase() == 'end' ? selector.from : selector.to ;
  let node = cyto.nodes().filter(function( ele ){
    if( ele.data('name') == selected){
       ele.select();
       return true;
    }
    else {
      ele.unselect();
    }

  });
  */
  //node.select();



  
  setNodeInfo(nodeInfo);
  setSel(nodeInfo);
  
} /*else if(cyto !== null && cyto !== undefined && view !== undefined && (showInfoPanel !== showInfo)){
  //console.log("reset", view, diagramView, version, dataVersion, showInfoPanel, showInfo);
  setTimeout(() => {
    //cyto.reset();
    cyto.fit();
    cyto.zoom({level:level});
    
    setShowInfo(showInfoPanel);
 } , 900);
  
}*/

//console.log("    Selector", cyto, view, selector)
if(cyto !== null && cyto !== undefined && view !== undefined /*&& (showInfoPanel !== showInfo)*/){
  cyto.edges().filter(function( ele ){
    if(nodeInfo && ele.data('id') == nodeInfo.id)
    {
      
      ele.select();
    }
    else{
      ele.unselect();
    }
  });
}

useEffect(() => {
   // console.log('useEffect')
    init();
},[])

const toggleMap = () => {
  setShowMap(!showMap);
}


    return (
      <div>
        <div id="cy" className={styles.cy}></div>
        <div id="map" className={styles.map +' ' + (showInfoPanel? styles.rightMargin : '') + ' ' + (showMap? '' : styles.zero)}>
            <div id="navigation" className={styles.navigation}></div>
            
            <div className={styles.expand}  onClick={toggleMap}>
              {showMap ? <img src="/images/collapse.png" alt="collapse" /> : <img src="/images/expand.png" alt="expand" />}
            </div>
          </div>
        <ButtonGroup handleZoomIn={handleZoomIn} handleZoomReset={handleZoomReset} handleZoomOut={handleZoomOut} showPathPanel={showPathPanel} maxView={maxView} setMaxView={setMaxView} />
      </div>
    );

}

export default FlowDiagram;
