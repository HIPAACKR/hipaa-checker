'use client';

import { useEffect, useState } from 'react';
import { ArcElement, Chart, PointElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

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

const RiskGauge = ({ score, label, isLoading }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [score]);

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

      const totalSum = 100;
      const targetPointerRotation = (score / totalSum) * 180 - 90;

      // Pointer
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * targetPointerRotation);
      ctx.beginPath();

      ctx.roundRect(0, 0 - outerRadius - 6, 3, doughnutThickness + 30, 5);

      ctx.fillStyle = 'black';
      ctx.fill();

      ctx.restore();

      // Score text
      const displayText = parseFloat(score).toFixed(1);
      ctx.font = 'bold 30px AlbertSans';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(displayText, centerX, centerY);
    },
  };

  return (
    <div className='riskGauge'>
      {isLoading ? (
        <div className='riskGauge__skeleton'></div>
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
          <div className='riskGauge__minScore'>0</div>
          <div className='riskGauge__comment'>
            <span>{label}</span>
          </div>
          <div className='riskGauge__maxScore'>100</div>
        </>
      )}
    </div>
  );
};

export default RiskGauge;