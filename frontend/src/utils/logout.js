import { toast } from 'react-toastify';

import { clearCookies } from './helper';

export const performLogout = async (removeLocalData, router, subscriptionContext = null) => {
  try {
    removeLocalData();
    clearCookies();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('filesData');
      localStorage.removeItem('rulesData');
      localStorage.removeItem('time');
    }
    
    if (subscriptionContext && subscriptionContext.fetchData) {
      subscriptionContext.fetchData();
    }
    
    router.push('/');
    
    toast.info('Successfully logged out');
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during logout:', error);
    toast.error('Logout failed. Please try again.');
  }
};