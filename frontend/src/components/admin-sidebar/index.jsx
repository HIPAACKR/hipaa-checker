'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';

import MenuItem from '@/components/menu-item';
import { get } from '@/utils/api-service';

import './index.scss';

const AdminSidebar = ({ setSidebarClose }) => {
  const pathname = usePathname();
  const [organizationName, setOrganizationName] = useState('Organization');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasOrganization, setHasOrganization] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await get('user', true);
        const data = response?.data;

        const hasOrgData = !!(data.user && 
                             data.user.organization && 
                             data.user.organization.name);
        
        setHasOrganization(hasOrgData);
        
        if (hasOrgData) {
          setOrganizationName(data.user.organization.name);
        }

        if (data.user && data.user.is_admin !== undefined) {
          setIsAdmin(data.user.is_admin);
        }
        
        setIsLoading(false);
      } catch (error) {
        toast.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const baseMenuItems = [
    { icon: 'dashboardBlue', title: 'Dashboard', link: '/user-account/dashboard' },
    {
      icon: 'scanner',
      title: 'Scanner',
      subMenu: [{ title: 'New Scan', link: '/user-account/scan' }],
    },
    // {
    //   icon: 'subscription',
    //   title: 'Subscription',
    //   link: '/user-account/subscription',
    // }
  ];

  const menuItems = (isAdmin && hasOrganization) ? [
    ...baseMenuItems,
    {
      icon: 'rule',
      title: 'Organization',
      link: '/user-account/organization',
    }
  ] : baseMenuItems;

  return (
    <aside className='sidebar'>
      <div className={`sidebar__companayLogoWrapper`}>
        <Link
          className={`sidebar__companayLogoWrapper__logo`}
          href={'/user-account/dashboard'}
        >
          <Image
            src='/images/icons/logo-admin.svg'
            width={168}
            height={37}
            alt='Hipaachecker logo'
          />
        </Link>
      </div>
      <div className={`sidebar__menulists`}>
        {menuItems.map((menuItem, index) => (
          <MenuItem
            key={index}
            setSidebarClose={setSidebarClose}
            activePath={pathname}
            {...menuItem}
          />
        ))}
      </div>
    </aside>
  );
};

export default AdminSidebar;