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
  plugins: {
    title: {
      display: false,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
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
};



export function App() {
  return ;
}

const  ModelPerformance = ({data}) => {
  if(!data) return null;
  const labels = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    labels.push(key);
    values.push(value);
  });
  const d = {
    labels,
    datasets: [
      {
        label: 'Avg. Precision',
        data: values,
        borderColor: 'rgb(30,144,255, 1)',
        backgroundColor: 'rgba(30,144,255, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Bar options={options} data={d} />
  );
}

export default ModelPerformance;