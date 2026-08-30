import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

import { get } from '@/utils/api-service';
import API_ENDPOINTS from '@/utils/apiEndpoints';

const CheckoutForm = ({ closeModal, id }) => {
  const [riskData, setRiskData] = useState([]);
  const API_BASE_URL_V2 = process.env.NEXT_PUBLIC_API_BASE_URL_V2;
  const fetchHippaRiskBreakDown = async () => {
    const response = await get(
      `${API_ENDPOINTS.USER_UPLOADS}/user_uploads/${id}/rule_wise`,
      true,
      2,
    );
    const data = response?.data;
    setRiskData(data?.user_upload?.hipaa_risk_scores?.risk_breakdown || []);
  };

  useEffect(() => {
    fetchHippaRiskBreakDown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPieCharts = () => {
    return riskData.map((item, index) => {
      const data = {
        labels: ['Total Risk Score', 'CVSS Risk Score', 'Risk Mitigation', 'Risk Remaining'],
        datasets: [
          {
            label: item.risk_category,
            data: [
              item.total_risk_score,
              item.cvss_risk_score,
              item.cvss_risk_mitigation,
              item.cvss_risk_remaining,
            ],
            backgroundColor: ['#FFCE56', '#4BC0C0', '#36A2EB', '#FF6384'],
          },
        ],
      };

      return (
        <div
          key={index}
          style={{ width: '300px', margin: '20px' }}
        >
          <h3>{item.risk_category}</h3>
          <Pie data={data} />
        </div>
      );
    });
  };

  return (
    <>
      <div>
        <h2 className='text-center'>Risk Breakdown</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {renderPieCharts()}
        </div>
      </div>
    </>
  );
};

// import { useEffect, useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// // Register required Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend);

// const CheckoutForm = ({ id }) => {
//   const [riskData, setRiskData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchHippaRiskBreakDown = async () => {
//     try {
//       const url = `${API_BASE_URL_V2}/${API_ENDPOINTS.USER_UPLOADS}/${id}/rule_wise`;
//       const localData = JSON.parse(localStorage.getItem('user'));
//       const jwt_token = localData?.jwt_token;
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${jwt_token}`,
//         },
//       });
//       const data = await response.json();
//       setRiskData(data?.user_upload?.hipaa_risk_scores?.risk_breakdown || []);
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHippaRiskBreakDown();
//   }, []);

//   const generatePieData = (metric) => ({
//     labels: riskData.map((item) => item.risk_category),
//     datasets: [
//       {
//         label: metric,
//         data: riskData.map((item) => item[metric]),
//         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
//       },
//     ],
//   });

//   return (
//     <div className='flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md'>
//       {loading ? (
//         <p className='text-gray-500 text-lg'>Loading...</p>
//       ) : riskData.length > 0 ? (
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//           {/* Total Risk Score */}
//           <div className='bg-white rounded-lg shadow p-4'>
//             <h3 className='text-center text-lg font-semibold mb-2'>Total Risk Score</h3>
//             <Pie data={generatePieData('total_risk_score')} />
//           </div>
//           {/* CVSS Risk Score */}
//           <div className='bg-white rounded-lg shadow p-4'>
//             <h3 className='text-center text-lg font-semibold mb-2'>CVSS Risk Score</h3>
//             <Pie data={generatePieData('cvss_risk_score')} />
//           </div>
//           {/* CVSS Risk Mitigation */}
//           <div className='bg-white rounded-lg shadow p-4'>
//             <h3 className='text-center text-lg font-semibold mb-2'>CVSS Risk Mitigation</h3>
//             <Pie data={generatePieData('cvss_risk_mitigation')} />
//           </div>
//           {/* CVSS Risk Remaining */}
//           <div className='bg-white rounded-lg shadow p-4'>
//             <h3 className='text-center text-lg font-semibold mb-2'>CVSS Risk Remaining</h3>
//             <Pie data={generatePieData('cvss_risk_remaining')} />
//           </div>
//         </div>
//       ) : (
//         <p className='text-red-500 text-lg'>No data available.</p>
//       )}
//     </div>
//   );
// };

const RiskBreakDownModal = ({ closeModal, id }) => {
  return (
    <CheckoutForm
      closeModal={closeModal}
      id={id}
    />
  );
};

export default RiskBreakDownModal;
