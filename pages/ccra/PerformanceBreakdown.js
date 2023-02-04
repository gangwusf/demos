import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  scales: {

    y: {
      ticks: {
        min: 0,
        max: 100,
        callback: function (value) {
          return value  + '%'; 
        },
      },
      scaleLabel: {
        display: true,
        labelString: 'Percentage',
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['Precision', 'Recall'];


const  PerformanceBreakdown = ({data}) => {
  //console.log('PerformanceBreakdown', data);
  if(!data) return null;
  let predict = [0,0,0,0];
  let recall = [0,0,0,0];
  if(data && data[0]){
    recall = data[0];
  }


  
  if(data && data[1]){
    predict = data[1];
  }

  const d = {
    labels,
    datasets: [
      {
        label: 'Severe',
        data: [predict[3], recall[3]],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
      },
      {
        label: 'High',
        data: [predict[2], recall[2]],
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
          label: 'Medium',
          data: [predict[1], recall[1]],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
        {
          label: 'Low',
          data: [predict[0], recall[0]],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
    ],
  };

  return (
    <Bar options={options} data={d} />
  );
}

export default PerformanceBreakdown;
