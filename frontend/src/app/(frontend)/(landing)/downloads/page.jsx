import Downloads from '@/components/downloads';
import EyeCatch from '@/components/eye-catch';
import TabCategories from '@/components/tab-categories';
import { downloadsPageMetadata } from '@/data/seo-config';

import './index.scss';

export const metadata = downloadsPageMetadata;

const data = [
  // {
  //   id: '1',
  //   title: 'HIPAAChecker app for Android',
  //   description: 'A mobile application to check the installed applications of your android mobile',
  //   icon: 'android',
  //   width: '33',
  //   height: '40',
  //   category: 'MOBILE',
  // },
  {
    id: '2',
    title: 'HIPAAChecker plugin for Android Studio(mPlugin)',
    description:
      'Identify and remediate HIPAA-related security vulnerabilities in Android applications during development.',
    icon: 'androidStudio',
    width: '38',
    height: '40',
    category: 'MOBILE',
  },
  {
    id: '3',
    title: 'HIPAAChecker plugin for iOS',
    description: 'Integrate HIPAA technical safeguard checks directly into Xcode during the iOS app development process.',
    icon: 'ios',
    width: '40',
    height: '40',
    category: 'MOBILE',
  },
  // {
  //   id: '4',
  //   title: 'HIPAAChecker plugin for PHP',
  //   description: 'A mobile application to check the installed applications of your android mobile',
  //   icon: 'php',
  //   width: '74',
  //   height: '40',
  //   category: 'WEB',
  // },
  // {
  //   id: '5',
  //   title: 'HIPAAChecker plugin for Rubi on Rails',
  //   description: 'A mobile application to check the installed applications of your android mobile',
  //   icon: 'rails',
  //   width: '114',
  //   height: '40',
  //   category: 'WEB',
  // },
  // {
  //   id: '6',
  //   title: 'HIPAAChecker plugin for Django',
  //   description: 'A mobile application to check the installed applications of your android mobile',
  //   icon: 'django',
  //   width: '114',
  //   height: '40',
  //   category: 'WEB',
  // },
  // {
  //   id: '7',
  //   title: 'HIPAAChecker plugin for ExpressJS',
  //   description: 'A mobile application to check the installed applications of your android mobile',
  //   icon: 'express',
  //   width: '66',
  //   height: '40',
  //   category: 'WEB',
  // },
];

const DownloadsPage = ({ searchParams }) => {
  const options = [
    { title: 'All plugins', url: 'all' },
    // { title: 'All Mobile platform', url: 'mobile' },
    // { title: 'Web platform', url: 'web' },
  ];

  return (
    <div className='downloads'>
      <EyeCatch param='downloads' />
      <div className='downloads__content'>
        <TabCategories
          options={options}
          selectedOptionUrl={searchParams?.category?.toString()}
        />
        <Downloads
          productsData={data}
          options={options}
          selectedOptionUrl={searchParams?.category?.toString()}
        />
      </div>
    </div>
  );
};

export default DownloadsPage;
