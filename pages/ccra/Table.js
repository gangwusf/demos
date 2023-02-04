import React from "react";
import Td from "./Td";

const Table = ({ data, setFilter , filter}) => { 
    //console.log('Table:', data, setFilter, filter);
    if(!Array.isArray(data ))   return <div> No data </div>

    return (
        <table className="table">
            <tbody>
            <tr>
                <td scope="col" className="table-success"></td>
                <td scope="col" className="table-success"></td>
                <td scope="col" colSpan="4" className="table-success">Predicted Class</td>
                </tr>
                <tr>
                <td scope="col" className="table-success"></td>
                <td scope="col"></td>
                <td scope="col" className="table-warning">Low</td>
                <td scope="col" className="table-warning">Medium</td>
                <td scope="col" className="table-warning">High</td>
                <td scope="col" className="table-warning">Severe</td>
                </tr>
                <tr>
                    <td scope="row" className="table-success" rowSpan="5">Actual Class</td>
                </tr>
                <tr>
                <td scope="row" className="table-warning">Low</td>
                <Td data={data[0][0]} predicted={"low"} actual={"low"} setFilter={setFilter} filter={filter}/>
                <Td data={data[0][1]} predicted={"medium"} actual={"low"} setFilter={setFilter} filter={filter}/>
                <Td data={data[0][2]} predicted={"high"} actual={"low"} setFilter={setFilter} filter={filter}/>
                <Td data={data[0][3]} predicted={"severe"} actual={"low"} setFilter={setFilter} filter={filter}/>
                </tr>
                <tr>
                <td scope="row" className="table-warning">Medium</td>
                <Td data={data[1][0]} predicted={"low"} actual={"medium"}  setFilter={setFilter} filter={filter}/>
                <Td data={data[1][1]} predicted={"medium"} actual={"medium"} setFilter={setFilter} filter={filter}/>
                <Td data={data[1][2]} predicted={"high"} actual={"medium"} setFilter={setFilter} filter={filter}/>
                <Td data={data[1][3]} predicted={"severe"} actual={"medium"} setFilter={setFilter} filter={filter}/>
                </tr>
                <tr>
                <td scope="row" className="table-warning">High</td>
                <Td data={data[2][0]} predicted={"low"} actual={"high"}  setFilter={setFilter} filter={filter}/>
                <Td data={data[2][1]} predicted={"medium"} actual={"high"} setFilter={setFilter} filter={filter}/>
                <Td data={data[2][2]} predicted={"high"} actual={"high"} setFilter={setFilter} filter={filter}/>
                <Td data={data[2][3]} predicted={"severe"} actual={"high"} setFilter={setFilter} filter={filter}/>
                </tr>
                <tr>
                <td scope="row" className="table-warning">Severe</td>
                <Td data={data[3][0]} predicted={"low"} actual={"severe"}  setFilter={setFilter} filter={filter}/>
                <Td data={data[3][1]} predicted={"medium"} actual={"severe"} setFilter={setFilter} filter={filter}/>
                <Td data={data[3][2]} predicted={"high"} actual={"severe"} setFilter={setFilter} filter={filter}/>
                <Td data={data[3][3]} predicted={"severe"} actual={"severe"} setFilter={setFilter} filter={filter}/>
                </tr>
            </tbody>
            </table>
  )};
  
  export default Table;