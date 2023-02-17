import React, { useMemo } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";
import { PenFill } from 'react-bootstrap-icons';
const sortmap = {'severe': 0, 'high': 1, 'medium': 2, 'low': 3};
const predictedRiskLevelSorter = (rowA, rowB) => {

    const a = sortmap[rowA['Predicted Risk Level'].toLowerCase()];
    const b = sortmap[rowB['Predicted Risk Level'].toLowerCase()];

    if (a > b) {
        return 1;
    }

    if (b > a) {
        return -1;
    }

    return 0;
};

const actualRiskLevelSorter = (rowA, rowB) => {

    const a = sortmap[rowA['Actual Risk Level'].toLowerCase()];
    const b = sortmap[rowB['Actual Risk Level'].toLowerCase()];

    if (a > b) {
        return 1;
    }

    if (b > a) {
        return -1;
    }

    return 0;
};

const incidentSorter = (rowA, rowB) => {
  return rowA['Incident Case ID'] > rowB['Incident Case ID'];
};

const sevSorter = (rowA, rowB) => {
  const a =  rowA['Incident SEV'] ? rowA['Incident SEV'].toLowerCase() : '';
  const b =  rowB['Incident SEV'] ? rowB['Incident SEV'].toLowerCase() : '';

  return a > b;
};

const caseIdSorter = (rowA, rowB) => {
  return rowA['Change Case ID'] - rowB['Change Case ID'];
};

const fixurl = (url) => {
  return '';
  if(!url) return '';
  if(url.indexOf('https://') === 0) {
    return url;
  }
  return 'https://' + url;
}

const Table = ({data, filter, setNote,  setMessage}) => {
    const columns = [
        {name:"Case Create", selector: row => row['Case Create Date'], sortable: true, grow: 2},
        {name:"Change Case ID", selector: row => <div><a target="_blank" href={fixurl(row['ChangeCase_URL'])}>{row['Change Case ID']}</a></div>, sortable: true, sortFunction: caseIdSorter,  width: "140px" },
        {name:"Change Type", selector: row => row['Change Type'], sortable: true, width: "130px" },
        {name:"CI Status", selector: row => row['CI Status'], sortable: true, grow: 2},
        {name:"Predicted Risk", selector: row => row['Predicted Risk Level'], sortable: true, sortFunction: predictedRiskLevelSorter, width: "140px"},
        {name:"Actual Risk", selector: row => row['Actual Risk Level'], sortable: true, sortFunction: actualRiskLevelSorter, width: "120px"},
        {name:"Change Category", selector: row => row['Change Category'], sortable: true, grow:3.5},
        {name:"Business Name", selector: row => row['Business Name'], sortable: true, grow:4},
        {name:"Pipeline", selector: row => row['Pipeline'], sortable: true, grow:3},
        {name:"Incident Case ID", selector: row => <div><a target="_blank" href={fixurl(row['IncidentCase_URL'])}>{row['Incident Case ID']}</a></div>, sortable: true, sortFunction: incidentSorter, width: "150px"},
        {name:"Incident SEV", selector: row => row['Incident SEV'], sortable: true,  sortFunction: sevSorter, width: "130px"},
        //{name:"Prediction Rationale/Comments", selector: row => row.PredictionRationaleComments, sortable: true, hide: "md"},
        //{name:"CCRA Version", selector: row => row.CCRAVersion, sortable: true, hide: "md", width: "130px"},
        //{name:"GCM Notes", sortable: true, hide: "md", width: "130px",cell: row => <div className="editable" data-toggle="modal" data-target="#editorModal" onClick={()=>setNote(row)}>{row.GCMNotes} <PenFill /></div>},
        //{name:"GCM/Research", selector: row => row.GCMResearchIdeas, sortable: true, hide: "md", width: "140px"},
    ];

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

  
  let filteredItems = [];
  if(data && data.length > 0) {
   filteredItems = data.filter(
    (item) => {
      const test = JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
      const test2 = (filter && filter[0] === item['Predicted Risk Level'] && filter[1] === item['Actual Risk Level']) || !filter;
      return test && test2;
    }
  );
  }
  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
        setMessage={setMessage}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <DataTable
      //title="Change Case Risk Predictions"
      columns={columns}
      data={filteredItems}
      defaultSortFieldId={1}
      defaultSortAsc={false}
      pagination
      subHeader 
      subHeaderComponent={subHeaderComponent}
    />
  );
};

export default Table;
