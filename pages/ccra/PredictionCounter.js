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
      //boxWidth: 20,
    },
  },
};



const PredictionCounter = ({rows}) => {
  if(!rows) return null;
  let total = rows.total;
  let values = rows.rows && rows.rows.slice(0, 3);
  //console.log('Prediction: ', total, values);
   const data = {
    //labels: ['Severe', 'High', 'Medium','Low'],
    labels: ['Severe', 'High', 'Medium'],
    datasets: [
      {
        label: '# of Votes',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          //'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)',
          //'rgba(75, 192, 192, 1)'
         
        ],
        borderWidth: 1,
      },
    ],
  };

  return <>
          <div className="prediction_counter">
                  <Doughnut data={data} options={options}/>
                  <div className="prediction_total">Total: {total}</div>
          </div>
            <div className="prediction_legend">
              <div className={"prediction_legend_item " + (values && values[0] ? '' : 'hide')}>
                <div className="prediction_legend_item_color" style={{borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)'}}></div>
                <div className="prediction_legend_item_label"><label>Severe:</label><span className='number'> {values ? values[0] : ''}</span> <span className="percent">{values ? (values[0] * 100 / total).toFixed(2) : 0}%</span></div>
              </div>
              <div className={"prediction_legend_item " + (values && values[1] ? '' : 'hide')}>
                <div className="prediction_legend_item_color" style={{borderColor: 'rgba(255, 159, 64, 1)',backgroundColor: 'rgba(255, 159, 64, 0.2)'}}></div>
                <div className="prediction_legend_item_label"><label>High:</label><span className='number'> {values ? values[1]: ''}</span> <span className="percent">{values ? (values[1] * 100 / total).toFixed(2) : 0}%</span></div>
              </div>
              <div className={"prediction_legend_item " + (values && values[2] ? '' : 'hide')}>
                <div className="prediction_legend_item_color" style={{borderColor: 'rgba(255, 206, 86, 1)',backgroundColor: 'rgba(255, 206, 86, 0.2)'}}></div>
                <div className="prediction_legend_item_label"><label>Medium:</label><span className='number'> {values ? values[2]:''}</span> <span className="percent">{values ? (values[2] * 100 / total).toFixed(2) : 0}%</span></div>
              </div>
              </div>
        </>;
}

export default PredictionCounter;