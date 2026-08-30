import { useContext, useEffect,useState } from 'react';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';

import arrowUp from '@/../public/images/icons/arrowDiagonal.svg';
import greenCheckBoxWithoutBG from '@/../public/images/icons/checked_green_without_bg.svg';
import redCrossIconWithoutBG from '@/../public/images/icons/cross_red_without_bg.svg';
import stackIcon from '@/../public/images/icons/stacks.svg';
import Button from '@/components/button';
import { UnsubscribeCurrentPlanModal } from '@/components/modals/profile/unsubscribe_current_plan';
import { Badge } from '@/components/ui/Badge'; 
import subscriptionContext from '@/context/subscriptionContext';

const SubscriptionPlanCard = () => {
  const router = useRouter();
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const { userData , handleConfirmPlanCancel, fetchData, setSelectedPlan} = useContext(subscriptionContext);
  const currentPlan = userData?.plan ?? {};

  useEffect(() => {
    setSelectedPlan(currentPlan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseUnsubscribeModal = () => {
    setShowUnsubscribeModal(false);
  };

  const onConfirmPlanCancel = async () => {
    await handleConfirmPlanCancel(handleCloseUnsubscribeModal);
    await fetchData();
  };

  return (
    <div className='profile-group'>
      {Object.keys(currentPlan).length > 0 
      ? (
          <div>
            <div  className='profile-group__content'>
              <div>
                <div className='profile-group__title'>Subscription Plan</div>
                <p className='profile-group__description'>Pick an account plan that fits your workflow.</p>
              </div>
            </div>

            <div className='subscription-card'>
              <div className="subscription-card__header">
                <div className='subscription-card__header-content'>
                  <div className='subscription-card__icon-wrapper'>
                    <Image
                      src={stackIcon}
                      alt="info"
                      width={18}
                      height={18}
                    />
                  </div>
                  <p className="subscription-card__title">
                    {currentPlan?.name && currentPlan.name[0].toUpperCase() + currentPlan.name.slice(1)} Plan
                  </p>
                </div>
              </div>
              
              <div className='subscription-card__price'>
                <p className='subscription-card__price-text'>
                  {/* TODO: need interval */}
                  <span className="subscription-card__price-amount">${currentPlan?.price} </span> per month
                </p>
                <Badge className='subscription-card__badge'>Current Plan</Badge>
              </div>
              
              <div className="subscription-card__features">
                <div className="subscription-card__features-column">
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.user_count > 0 ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>max users: ${currentPlan?.user_count}</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.get_hipaa_score ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>get hipaa score</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.get_summerized_reports ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>get summerized reports</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.support_multiple_device ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>support multiple device</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.view_source_code ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>view source code</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.support_customer_service ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>support customer service</p>
                  </div>
                </div>
                
                <div className="subscription-card__features-column">
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.limit_per_day > 0 ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>limit per day : {currentPlan?.limit_per_day}</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.get_vulnerability_breakdown ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>get vulnerability breakdown</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.get_specific_reports ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>get specific reports</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.support_dashboard_service ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>support dashboard service</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.fix_vulnerabilities ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>fix vulnerabilities</p>
                  </div>
                  <div className='subscription-card__features-item'>
                    <Image
                      className='subscription-card__features-icon'
                      src={currentPlan?.support_hipaa_experts ? greenCheckBoxWithoutBG : redCrossIconWithoutBG}
                      alt="info"
                      width={20}
                      height={20}
                    />
                    <p className='subscription-card__features-text'>support hipaa experts</p>
                  </div>
                </div>
              </div>
              
              <div className='subscription-card__actions'>
                <Button
                  type='button'
                  size='small'
                  className='subscription-card__button--secondary'
                  onClick={() => setShowUnsubscribeModal(true)}
                >
                  Unsubscribe plan
                </Button>
                <Button
                  type='primary'
                  size='small'
                  iconPosition={'after'}
                  onClick={() => {
                    router.push('/user-account/subscription');
                  }}
                >
                  Upgrade Plan 
                  <span className="arrow-wrapper">
                    <Image
                      src={arrowUp}
                      alt="arrow up right"
                      width={20}
                      height={20}
                    />
                  </span>
                </Button>
              </div>
            </div>
          </div>
      )
      : (
        <p>No subscription plan found.</p>
      )
      }

      <UnsubscribeCurrentPlanModal 
        isOpen={showUnsubscribeModal} 
        onClose={handleCloseUnsubscribeModal} 
        onUnsubscribe={onConfirmPlanCancel} 
        plan={currentPlan?.name && currentPlan.name[0].toUpperCase() + currentPlan.name.slice(1)}
      />
    </div>
  )
}

export default SubscriptionPlanCard;