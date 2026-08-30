import { useEffect, useState } from 'react';

import { get } from '@/utils/api-service';

import ThreeDotDropDown from '../three-dot-dropdown';

import './index.scss';

const PlanCard = ({ plan, openModal, isSelected }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const plan_category = {
    MONTHLY: 'month',
    ANNUALLY: 'year',
  };
  
  const displayFeatures = [
    'get_hipaa_score',
    'get_vulnerability_breakdown',
    'get_summerized_reports',
    'get_specific_reports',
    'support_multiple_device',
    'support_dashboard_service',
    'view_source_code',
    'fix_vulnerabilities',
    'support_customer_service',
    'support_hipaa_experts',
  ];
  
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       setLoading(true);
  //       const fixedUrl = `${API_BASE_URL}user`.replace(/\/\/+/g, '/').replace('https:/', 'https://');
  //       const response = await fetch(fixedUrl, {
  //         credentials: 'include',
  //         headers: {
  //           'Accept': 'application/json'
  //         }
  //       });
        
  //       
    
  //   fetchUserData();
  // }, []);
  
   useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await get('user', true);
          const data = response?.data;
          
          if (data && typeof data === 'object') {
            setUserData(data);
          } else {
            throw new Error('Invalid user data format');
          }
        } catch (error) {
          setError(error.message || 'Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    }, []);

  useEffect(() => {
    if (userData) {
      // console.log('Updated userData state:', userData);
      // console.log('Updated is_admin value:', userData.user.is_admin);
    }
  }, [userData]);

  const filteredFeatures = plan && displayFeatures.filter((key) => key in plan);

  const isButtonDisabled = 
    isSelected || 
    loading || 
    // error || 
    (userData && userData.user.is_admin === false);

  if (!plan) {
    return <div className="subscription__plan subscription__plan--loading">Loading plan...</div>;
  }
  
  return (
    <div className='subscription__plan'>
      <h2 className='subscription__plan-name'>{plan.name.toUpperCase()}</h2>
      <p className='subscription__plan-price'>
        ${plan.price}
        <span className='subscription__plan-period'>
          {plan.interval === plan_category.ANNUALLY ? '/year' : '/month'}
        </span>
      </p>
      <ul className='subscription__plan-features'>
        <li
          key={'max_user'}
          className='subscription__plan-feature'
        >
          max users : {plan.user_count}
        </li>
        <li
          key={'limit_per_day'}
          className='subscription__plan-feature'
        >
          limit per day : {plan.limit_per_day ? `${plan.limit_per_day}` : 'None'}
        </li>
        {filteredFeatures && filteredFeatures.map((feature, featureIndex) => (
          <li
            key={featureIndex}
            className={
              plan[feature] ? 'subscription__plan-feature' : 'subscription__plan-feature--cross'
            }
          >
            {feature.replace(/_/g, ' ')}
          </li>
        ))}
      </ul>
      {isSelected ? (
        <div className='flex gap-2'>
          <button
            className={`flex-grow subscription__plan-btn ${isSelected ? 'subscription__plan-btn--current' : ''}`}
            disabled={isSelected}
            onClick={() => openModal(plan.id)}
          >
            Current Plan
          </button>
          {
            plan.name !== 'Free' && (
            <ThreeDotDropDown
              text='Cancel Plan'
              onClick={() => openModal(plan.id)}
          />
            )

          }
        </div>
      ) : (
        <button
          className={`subscription__plan-btn ${isButtonDisabled ? 'subscription__plan-btn--disabled' : ''}`}
          disabled={isButtonDisabled}
          onClick={() => openModal(plan.id)}
        >
          {loading ? 'Loading...' : 'Choose Plan'}
        </button>
      )}
      {!loading && !isSelected && (
        userData && userData.is_admin === false ? (
          <p className="subscription__plan-admin-note">Admin privileges required to change plans</p>
        ) : error ? (
          <div></div>
        ) : null
      )}
    </div>
  );
};

export default PlanCard;