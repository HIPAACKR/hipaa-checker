import Link from 'next/link';

// import {post} from '@/utils/api-service';
// import API_ENDPOINTS from '@/utils/apiEndpoints';

export default function PaymentSuccess({ searchParams }) {
  // const { amount } = searchParams;
  // const {payment_intent_client_secret,plan_id} = searchParams;
  //
  // const postSubscriptionConfirmation = async () => {
  //     try {
  //         const payload = {
  //             user: {
  //                 stripe_token: payment_intent_client_secret,
  //                 plan_id: plan_id,
  //             },
  //             code: null
  //             };
  //         const response = await post(API_ENDPOINTS.SUBSCRIPTIONS, payload, true);
  //         return response.json().then((data) => {
  //             console.log('payment success response:', data)
  //         });
  //     } catch (error) {
  //         console.error(error)
  //     }
  // };
  //
  // postSubscriptionConfirmation();

  return (
    <div>
      Purchase successful. Go to{' '}
      <Link
        className={'underline'}
        href={'/user-account/dashboard'}
      >
        Dashboard
      </Link>
    </div>
  );
}
