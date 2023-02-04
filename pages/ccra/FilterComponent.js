import React from "react";
import styled from "styled-components";
import { X } from 'react-bootstrap-icons';
import { CloudArrowDown } from 'react-bootstrap-icons';

import FileUpload from "../../components/FileUpload";

const Input = styled.input.attrs(props => ({
  type: "text",
  size: props.small ? 5 : undefined
}))`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
`;

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear, setMessage }) => (
  <>
    <FileUpload url={"/api/upload"} label="icon" title="upload file" name="file" setMessage={setMessage}/>
    
    <a href="/uploads/model_predictions.csv" className="download"><CloudArrowDown /></a>
    
    <Input
      id="search"
      type="text"
      placeholder="Filter data..."
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton onClick={onClear}><X /></ClearButton>
  </>
);

export default FilterComponent;
