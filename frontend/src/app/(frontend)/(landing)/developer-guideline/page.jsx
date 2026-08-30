import DeveloperGuideline from '@/components/developer-guideline';
import EyeCatch from '@/components/eye-catch';
import TabGuideline from '@/components/tab-guideline';
import { developerGuideMetadata } from '@/data/seo-config';

export const metadata = developerGuideMetadata;

const DeveloperGuidelinePage = ({ searchParams }) => {
  const options = [
    { title: 'Android Studio', url: 'android' },
    { title: 'XCode', url: 'x-code' },
  ];

  return (
    <div>
      <EyeCatch param='developer-guideline' />
      <TabGuideline
        options={options}
        selectedOptionUrl={searchParams?.platform?.toString()}
      />
      <DeveloperGuideline
        options={options}
        selectedOptionUrl={searchParams?.platform?.toString()}
      />
    </div>
  );
};

export default DeveloperGuidelinePage;
