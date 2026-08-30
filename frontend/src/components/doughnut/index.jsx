'use client';
import { useEffect, useState } from 'react';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import Skeleton from '../skeleton-row';
import Text from '../text';

import './index.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const VulnerabilityDoughnutChart = ({
  insufficientAuthorization,
  inadequateDataSecurity,
  insecureNetworkCommunication,
  inconsistentAutditTrail,
  insufficientAuthorizationAct,
  inadequateDataSecurityAct,
  insecureNetworkCommunicationAct,
  inconsistentAutditTrailAct,
  isLoading,
  insufficientAuthorizationRiskRemaining,
  inadequateDataSecurityRiskRemaining,
  insecureNetworkCommunicationRiskRemaining,
  inconsistentAuditTrailRiskRemaining,
  insufficientAuthorizationRiskMitigated,
  inadequateDataSecurityRiskMitigated,
  insecureNetworkCommunicationRiskMitigated,
  inconsistentAuditTrailRiskMitigated,
}) => {
  const [vulnerability, setVulnerability] = useState(null);
  useEffect(() => {
    let maxValue = 0;
    let maxLabel = '';
    const values = [
      inconsistentAutditTrail,
      inadequateDataSecurity,
      insecureNetworkCommunication,
      insufficientAuthorization,
    ];
    const labels = [
      'inconsistentAutditTrail',
      'insecureNetworkCommunication',
      'inadequateDataSecurity',
      'insufficientAuthorization',
    ];
    for (let i = 0; i < values.length; i++) {
      if (values[i] > maxValue) {
        maxValue = values[i];
        maxLabel = labels[i];
      }
    }
    setVulnerability(maxLabel);
  }, [
    insufficientAuthorization,
    inadequateDataSecurity,
    insecureNetworkCommunication,
    inconsistentAutditTrail,
  ]);
  const data = {
    labels: ['Inc. Audit Trail', 'Ins. Communication', 'Ina. Data Security', 'Ins. Authorization'],
    datasets: [
      {
        data: [
          insufficientAuthorizationAct,
          inadequateDataSecurityAct,
          insecureNetworkCommunicationAct == 0 &&
          insufficientAuthorizationAct == 0 &&
          inadequateDataSecurityAct == 0 &&
          inconsistentAutditTrailAct == 0
            ? 100
            : insecureNetworkCommunicationAct,
          inconsistentAutditTrailAct,
        ],
        backgroundColor: [
          '#D6293D',
          '#F14B4B',
          insecureNetworkCommunicationAct == 0 &&
          insufficientAuthorizationAct == 0 &&
          inadequateDataSecurityAct == 0 &&
          inconsistentAutditTrailAct == 0
            ? '#3192ff'
            : '#FF6B6B',
          '#FF8F8F',
        ],
        borderColor: ['#FFF', '#FFF', '#FFF', '#FFF'],
        borderWidth: 1,
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: (context) => {
  //           const label = context.label || '';
  //           const value = context.raw || '';
  //           return `Actual Value : ${value}`;
  //         },
  //       },
  //     },
  //   },
  // };

  const riskRemainingValues = [
    inconsistentAuditTrailRiskRemaining,
    inadequateDataSecurityRiskRemaining,
    insecureNetworkCommunicationRiskRemaining,
    insufficientAuthorizationRiskRemaining,
  ];

  const riskMitigatedValues = [
    inconsistentAuditTrailRiskMitigated,
    insecureNetworkCommunicationRiskMitigated,
    inadequateDataSecurityRiskMitigated,
    insufficientAuthorizationRiskMitigated,
  ];

  // console.log('RiskMit:', riskMitigatedValues)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // console.log('Tooltip Context:', context); // Log context to console

            const label = context.label || '';
            const value = context.raw || '';
            const index = context.dataIndex;
            const riskRemaining = riskRemainingValues[index] || 0;
            const riskMitigated = riskMitigatedValues[index] || 0;

            return [
              `Actual Value: ${value}`,
              `Risk Remaining: ${riskRemaining}`,
              `Risk Mitigated: ${riskMitigated}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div className='doughnut'>
      <div className={`doughnut__figure doughnut__figure--${vulnerability}`}>
        <div className='doughnut__diagram'>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Doughnut
              data={data}
              options={options}
            />
          )}
        </div>
        {/* <Subtitle>
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              {vulnerability} {vulnerability !== ' inconsistentAutditTrail' && 'vulnerable'}
            </>
          )}
        </Subtitle> */}
      </div>
      <div>
        <Text
          size='fs-14'
          color='neutral-900'
          weight='semi-bold'
        >
          This project contains
        </Text>
        <div className='doughnut__legendWrapper'>
          <div className='doughnut__legend'>
            <span className='doughnut--font-weight-600'>{insufficientAuthorization} %</span>
            <span className='ml-2'>Insufficient Authorization</span>
          </div>

          <div className='doughnut__legend'>
            <span className='doughnut--font-weight-600'>{inadequateDataSecurity} %</span>
            <span className='ml-2'>Inadequate Data Security</span>
          </div>

          <div className='doughnut__legend'>
            <span className='doughnut--font-weight-600'>{insecureNetworkCommunication} %</span>
            <span className='ml-2'>Insecure Network Communication</span>
          </div>

          <div className='doughnut__legend'>
            <span className='doughnut--font-weight-600'>{inconsistentAutditTrail} %</span>
            <span className='ml-2'>Inconsistent Audit Trail</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VulnerabilityDoughnutChart;
