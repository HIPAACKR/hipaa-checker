'use client';

import { useEffect, useRef } from 'react';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HipaaRiskChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx || !data) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Transform data for Chart.js
    const labels = data.map(item => item.ruleId);
    const noRiskData = data.map(item => item.noRisk);
    const lowRiskData = data.map(item => item.lowRisk);
    const mediumRiskData = data.map(item => item.mediumRisk);
    const highRiskData = data.map(item => item.highRisk);

    // Get computed CSS variable values
    const rootStyles = getComputedStyle(document.documentElement);
    const colors = {
      red: rootStyles.getPropertyValue('--risk--red').trim(),
      green: rootStyles.getPropertyValue('--risk--green').trim(),
      orange: rootStyles.getPropertyValue('--risk--orange').trim(),
      gray: rootStyles.getPropertyValue('--risk--gray').trim(),
      cornellRed: rootStyles.getPropertyValue('--risk--cornell-red').trim(),
    };

    // Use computed colors or fallback
    const chartColors = {
      red: colors.red || '#FF4C4C',
      green: colors.green || '#4CAF50',
      orange: colors.orange || '#FFA500',
      gray: colors.gray || '#9CA3AF',
      cornellRed: colors.cornellRed || '#B31B1B',
    };

    const chartData = {
      labels,
      datasets: [
        {
          label: 'no_risk_count',
          data: noRiskData,
          backgroundColor: chartColors.gray,
          borderWidth: 0,
          stack: 'Stack 0',
        },
        {
          label: 'low_risk_count',
          data: lowRiskData,
          backgroundColor: chartColors.green,
          borderWidth: 0,
          stack: 'Stack 0',
        },
        {
          label: 'medium_risk_count',
          data: mediumRiskData,
          backgroundColor: chartColors.orange,
          borderWidth: 0,
          stack: 'Stack 0',
        },
        {
          label: 'high_risk_count',
          data: highRiskData,
          backgroundColor: chartColors.red,
          borderWidth: 0,
          stack: 'Stack 0',
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Hide default legend since we have custom one
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: true,
            color: '#e5e7eb',
            lineWidth: 1,
            drawBorder: false,
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 10,
            },
            maxRotation: 45,
            minRotation: 45,
          },
          border: {
            display: false,
          },
        },
        y: {
          display: true,
          min: 0,
          max: 300,
          ticks: {
            stepSize: 50,
            color: '#6b7280',
            font: {
              size: 12,
            },
          },
          grid: {
            display: true,
            color: '#e5e7eb',
            lineWidth: 1,
            drawBorder: false,
          },
          border: {
            display: false,
          },
          title: {
            display: true,
            text: 'Risk Count',
            color: 'black',
            font: {
              size: 18,
              weight: 600,
            },
          },
        },
      },
      layout: {
        padding: {
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        },
      },
    };

    chartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: chartData,
      options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  // Custom legend component
  const CustomLegend = () => (
    <div className="flex items-center justify-center gap-6 py-4 px-6 bg-white absolute right-0 z-10 top-[-32px]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 risk--cornell-red rounded-full"></div>
            <span className="text-sm text-gray-700">Critical Risk</span>
          </div>
        
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 risk--red rounded-full"></div>
            <span className="text-sm text-gray-700">High Risk</span>
          </div>
        
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 risk--orange rounded-full"></div>
            <span className="text-sm text-gray-700">Medium Risk</span>
          </div>
        
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 risk--green rounded-full"></div>
            <span className="text-sm text-gray-700">Low Risk</span>
          </div>
        
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 risk--gray rounded-full"></div>
            <span className="text-sm text-gray-700">No Risk</span>
          </div>
      </div>
  );

  return (
    <div className="w-full bg-white">
      <div className="mb-6">
        <h3 className="text-left text-xl font-semibold mb-2">HIPAA Rule Risk Distribution</h3>
      </div>

      <div className="relative">
        <div className="">
          <CustomLegend />
        </div>
        
        {/* Chart container */}
        <div className="h-96 mt-8">
          <canvas ref={chartRef} />
        </div>
        
        {/* X-axis label */}
        <div className="text-center mt-2">
          <div className="text-base font-semibold">
            HIPAA Rule ID
          </div>
        </div>
      </div>
    </div>
  );
};

export default HipaaRiskChart;