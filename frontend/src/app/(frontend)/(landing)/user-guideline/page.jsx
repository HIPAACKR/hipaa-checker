import { userGuideMetadata } from '@/data/seo-config';

import UserGuidelineClient from './UserGuidelineClient';

import './index.scss';

export const metadata = userGuideMetadata;

const UserGuideline = () => {
  return <UserGuidelineClient />;
};

export default UserGuideline;
