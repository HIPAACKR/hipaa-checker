import { ToastContainer } from 'react-toastify';

import { SubscriptionProvider } from '@/context/subscriptionContext';

import 'react-toastify/dist/ReactToastify.css';
import '@/design/styles/index.scss';
import './layout.scss';

export const metadata = {
  title: 'HIPAAChecker',
  description: 'Hipaa Checker application',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`rootLayout`}>
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />
        <SubscriptionProvider>
          <main>{children}</main>
        </SubscriptionProvider>
      </body>
    </html>
  );
}
