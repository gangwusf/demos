import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

import { Line } from 'react-chartjs-2';




ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
 
 export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
  };




const CaseVolume = ({data}) => {

  if(!data) return  <div> No data </div>;
 // console.log('CaseVolume', data);
  const labels = Object.keys(data);

  const significant = [];
  const minor = [];
  Object.entries(data).forEach(([key, value]) => {
    significant.push(value.Significant);
    minor.push(value.Minor);
  });
  const d = {
      labels,
      datasets: [
        {
          label: 'Significant',
          data: significant,
          borderColor: 'rgb(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderWidth: 1,
        },
        {
          label: 'Minor',
          data: minor,
          borderColor: 'rgb(53, 162, 235, 1)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderWidth: 1,
        },
      ],
     
    };

    return (
        <div>
            <Line data={d} options={options} />
        </div>
    )
}


export default CaseVolume;