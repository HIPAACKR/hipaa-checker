'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import SubscriptionContext from '@/context/subscriptionContext';
import { performLogout } from '@/utils/logout';
import useLocalStorage from '@/utils/useLocalData';

const AdminHeaderHome = () => {
  const subscriptionContext = useContext(SubscriptionContext);
  const profileRef = useRef(null);
  const [localData, removeLocalData] = useLocalStorage('user');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Use context userData as source of truth, fallback to localStorage
  const displayData = subscriptionContext?.userData || localData;
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileRef]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className='p-2 flex items-center '
      ref={profileRef}
    >
      <div className='bg-blue-900 text-white font-bold rounded-full h-9 w-9 flex items-center justify-center mr-2'>
        <span>{displayData?.first_name?.substring(0, 2).toUpperCase()}</span>
      </div>
      <div className='text-white'>
        <span>{displayData?.first_name && displayData?.first_name + ' ' + displayData?.last_name}</span>
      </div>
      <div
        className='ml-2 cursor-pointer'
        onClick={toggleDropdown}
      >
        <Icon
          name='Down-arrow-icon'
          size={16}
          color='white'
        />
      </div>

      {isDropdownOpen && (
        <div className='absolute right-20 mt-48 w-72 bg-[#1D2939] text-neutral-300 shadow-lg rounded-sm'>
          <div>
            <div
              className='px-4 py-2 hover:bg-neutral-300 hover:text-neutral-900 cursor-pointer flex'
              onClick={() => {
                router.push('/user-account/profile');
              }}
            >
              <span className='bg-blue-900 text-white font-bold rounded-full h-9 w-9 flex items-center justify-center mr-2 mt-1'>
                <span>{displayData?.first_name?.substring(0, 2).toUpperCase()}</span>
              </span>
              <span>
                {displayData?.first_name && displayData?.first_name + ' ' + displayData?.last_name}
                <br />
                <span>{displayData?.email && displayData?.email}</span>
              </span>
            </div>
            <div className='h-[1px] bg-neutral-300 w-[90%] mx-auto'></div>
            <div
              className='px-4 py-2 hover:bg-neutral-300 hover:text-neutral-900 cursor-pointer'
              onClick={async () => {
                setIsDropdownOpen(false);

                await performLogout(removeLocalData, router, subscriptionContext);
              }}
            >
              <Icon
                name='logout'
                size={12}
                color='gray'
              />
              <span className='ml-2'>Logout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeaderHome;
