'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { Badge } from '@/components/ui/Badge';
import SubscriptionContext from '@/context/subscriptionContext';
import { performLogout } from '@/utils/logout';
import useLocalStorage from '@/utils/useLocalData';

import './index.scss';

const AdminHeader = ({ toggleSidebar }) => {
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
    <header className='adminHeader'>
      <div
        className='adminHeader__icon'
        onClick={toggleSidebar}
      >
        <Icon
          name='menu'
          size={24}
          color='gray'
        />
      </div>
      <div
        className='adminHeader__profile'
        onClick={toggleDropdown}
        ref={profileRef}
      >
        <span className='adminHeader__profileIcon'>
          {displayData?.first_name?.substring(0, 2).toUpperCase()}
        </span>
        <span className='adminHeader__profileTitle'>
          {displayData?.first_name && displayData?.first_name + ' ' + displayData?.last_name}
          <Icon
            name='chevron-down'
            color='light-gray'
            size='20'
          />
        </span>
        {isDropdownOpen && (
          <div className='adminHeader__dropdownMenu'>
            <div className='adminHeader__dropdownHead'>
              <div
                className='adminHeader__dropdownProfile cursor-pointer p-1 rounded-md hover:bg-neutral-100'
                onClick={() => {
                  router.push('/user-account/profile');
                }}
              >
                <div className='adminHeader__profileIcon'>
                  {displayData?.first_name?.substring(0, 2).toUpperCase()}
                </div>
                <span>
                  {displayData?.first_name &&
                    displayData?.first_name + ' ' + displayData?.last_name}
                  <br />
                  <span>{displayData?.email && displayData?.email}</span>
                  <br />
                  <span>
                    {subscriptionContext?.showRoleOnHeader && displayData?.roles?.length > 0 && (
                      <Badge
                        className='border-0 bg-[#F0F9FF] text-xs text-[#0092E3] py-[4px] px-[5px] mt-1'
                        variant='custom'
                      >
                        {displayData.roles[0]?.name[0].toUpperCase() +
                          displayData.roles[0]?.name.slice(1)}
                      </Badge>
                    )}
                  </span>
                </span>
              </div>
            </div>
            <div
              className='adminHeader__dropdownMenuItem'
              onClick={async () => {
                setIsDropdownOpen(false);
                router.push('/');
              }}
            >
              <Icon
                name='site'
                size={16}
                color='gray'
              />
              Back to home
            </div>
            <div
              className='adminHeader__dropdownMenuItem'
              onClick={async () => {
                setIsDropdownOpen(false);
                await performLogout(removeLocalData, router);
              }}
            >
              <Icon
                name='logout'
                size={16}
                color='gray'
              />
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
