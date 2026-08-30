'use client';

import { useEffect, useState } from 'react';
import { ArcElement, Chart, PointElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import Skeleton from '../skeleton-row';

import './index.scss';

Chart.register(ArcElement, PointElement);

const data = {
  datasets: [
    {
      data: [2, 2.5, 3.5, 2],
      backgroundColor: ['#33C37F', '#FF9900', '#F03546', '#ac0c22'],
      display: true,
      borderColor: ['#FFF', '#FFF', '#FFF'],
      borderWidth: 2,
      circumference: 180,
      rotation: 270,
    },
  ],
};

export default function HalfDoughnut({ pointervalue, comment, isLoading, displayFormat }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [pointervalue]);

  const doughnutPointer = {
    id: 'doughnutPointer',
    afterDatasetsDraw: (chart, args, plugins) => {
      const { ctx, data } = chart;

      const centerX = chart.getDatasetMeta(0).data[0].x;
      const centerY = chart.getDatasetMeta(0).data[0].y;
      const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
      const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
      const angle = Math.PI / 180;

      const doughnutThickness = outerRadius - innerRadius;

      function sumArray(arr) {
        return arr.reduce((acc, current) => acc + current, 0);
      }

      const dataPointerArray = data.datasets[0].data.map((datapoint, index) => {
        return datapoint;
      });

      const totalSum = 100;
      const dataPointerValuePercentage = (pointervalue / totalSum) * 100;
      const targetPointerRotation = (pointervalue / totalSum) * 180 - 90;

      //pointer
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * targetPointerRotation);
      ctx.beginPath();

      ctx.roundRect(0, 0 - outerRadius - 6, 3, doughnutThickness + 30, 5);

      //clock view
      //ctx.roundRect(0, 0 - innerRadius , 5, doughnutThickness + 35, 5);

      ctx.fillStyle = 'black'; // Customize pointer color
      ctx.fill();

      ctx.restore();

      // Determine the display format
      let displayText;
      const formattedValue = parseFloat(pointervalue).toFixed(1); // Ensures one decimal place

      displayText = formattedValue; // Default format

      // Text
      ctx.font = 'bold 30px AlbertSans';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(displayText, centerX, centerY);
    },
  };

  return (
    <div className='halfDoughnut'>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Doughnut
          key={key}
          data={data}
          options={{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            aspectRatio: 3,
            cutout: '92%',
            innerCutout: '70%',
            maintainAspectRatio: true,
          }}
          plugins={[doughnutPointer]}
        />
      )}
      {!isLoading && (
        <>
          <div className='halfDoughnut__minScrore'>0</div>
          <div className='halfDoughnut__comment'>
            <span>{comment}</span>
          </div>
          <div className='halfDoughnut__maxScrore'>100</div>
        </>
      )}
    </div>
  );
}
