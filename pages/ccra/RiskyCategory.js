import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "right",
      boxWidth: 400,
      boxHeight: 300,
    },
  },
};



const RiskyCategory = ({rows}) => {
  if(!rows) return null;

   let labels = [];
   let values = [];
   const colors = [ 
    'rgba(0,0,139, 0.2)',    //darkblue
    'rgba(30,144,255, 0.2)', //dodgerblue
   'rgba(70,130,180, 0.2)',  //steelblue
   'rgba(0,191,255, 0.2)',   //deepskyblue
   'rgba(135,206,235, 0.2)', //skyblue
   'rgba(135,206,250, 0.2)'];//lightskyblue
   const borders = [
    'rgba(0,0,139, 1)',
    'rgba(30,144,255, 1)',
    'rgba(70,130,180, 1)',
    'rgba(0,191,255, 1)',
    'rgba(135,206,235, 1)',
    'rgba(135,206,250, 1)'
  ]
    let total = rows.total;
   rows.rows && rows.rows.forEach(element => {
    labels.push(element.changeCategory);
    values.push(element.count);
   });
   
   const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total: ' + total,
        data: values,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth: 1,
      },
    ],
  };

  return <>
            <div className="risk_category">
              <Doughnut data={data} options={options} /><div className="risky_total">Total: {total}</div>
            </div>
            <div className="risk_legend">
              <div className={"risk_legend_item " + (values && values[0] ? '' : 'hide')}>
                <div className="risk_legend_item_color" style={{borderColor: borders[0], backgroundColor: colors[0]}}></div>
                <div className="risk_legend_item_label"><label title={labels[0]}> {labels[0]}:</label><span className='number'> {values ? values[0] : ''}</span> <span className="percent">{values ? (values[0] * 100 / total).toFixed(2) : 0}%</span></div>
              </div>
              <div className={"risk_legend_item " + (values && values[1] ? '' : 'hide')}>
              <div className="risk_legend_item_color" style={{borderColor: borders[1], backgroundColor: colors[1]}}></div>
                <div className="risk_legend_item_label"><label title={labels[1]}>{labels[1]}:</label><span className='number'> {values ? values[1] : ''}</span> <span className="percent">{values && values[1] ? (values[1] * 100 / total).toFixed(2) : 0}%</span></div>
              </div>
              <div className={"risk_legend_item " + (values && values[2] ? '' : 'hide')}>
              <div className="risk_legend_item_color" style={{borderColor: borders[2], backgroundColor: colors[2]}}></div>
                <div className="risk_legend_item_label"><label title={labels[2]}>{labels[2]}:</label><span className='number'> {values ? values[2] : ''}</span> <span className="percent">{values && values[2] ? (values[2] * 100 / total).toFixed(2) : 0}%</span></div>
              </div>
              <div className={"risk_legend_item " + (values && values[3] ? '' : 'hide')}>
              <div className="risk_legend_item_color" style={{borderColor: borders[3], backgroundColor: colors[3]}}></div>
                <div className="risk_legend_item_label"><label title={labels[3]}>{labels[3]}:</label><span className='number'> {values ? values[3] : ''}</span> <span className="percent">{values && values[3] ? (values[3] * 100 / total).toFixed(2) : 0}%</span></div>
              </div>
              <div className={"risk_legend_item " + (values && values[4] ? '' : 'hide')}>
              <div className="risk_legend_item_color" style={{borderColor: borders[4], backgroundColor: colors[4]}}></div>
                <div className="risk_legend_item_label"><label title={labels[4]}>{labels[4]}:</label><span className='number'> {values ? values[4] : ''}</span> <span className="percent">{values && values[4] ? (values[4] * 100 / total).toFixed(2) : 0}%</span></div>
              </div>
            </div>
        </>;
}

export default RiskyCategory;