import EyeCatch from '@/components/eye-catch';
import FeatureContent from '@/components/feature-content';
import TabFeature from '@/components/tab-feature';
import { featuresTabs } from '@/data/features-data';
import { createMetadata } from '@/data/seo-config';

import './index.scss';

export async function generateMetadata({ searchParams }) {
  const slug = searchParams.search || 'access-control';
  let feature = featuresTabs.find((tab) => tab.slug === slug);
  if (!feature) {
    for (const tab of featuresTabs) {
      if (tab.subtitle) {
        feature = tab.subtitle.find((sub) => sub.slug === slug);
        if (feature) break;
      }
    }
  }

  const title = feature ? feature.subTitleName || feature.title : 'Features';
  const description = `Learn more about the ${title} feature of HIPAAChecker.`;

  return createMetadata(
    `${title} | HIPAAChecker Features`,
    description,
    `/features`
  );
}

const FeaturesPage = ({ searchParams }) => {
  return (
    <div className='features'>
      <EyeCatch param='features' />
      <div className='features__body'>
        <TabFeature selectedOptionUrl={searchParams?.search} />

        <FeatureContent selectedOptionUrl={searchParams?.search} />
      </div>
    </div>
  );
};

export default FeaturesPage;
