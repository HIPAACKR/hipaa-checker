import Image from 'next/image';

import Button from '../button';
import Heading from '../heading';
import Text from '../text';

import './index.scss';

const CardPlugin = ({ logo, width, height, title, description }) => {
  const handleDownload = () => {
    if (title === 'HIPAAChecker plugin for Android Studio(mPlugin)') {
      const link = document.createElement('a');
      link.href = '/download/android.zip';
      link.download = 'hipaachecker.health-VERSION-1.0.8.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      } else if (title === 'HIPAAChecker plugin for iOS') {
      const link = document.createElement('a');
      link.href = 'https://github.com/HIPAACKR/HIPAAChecker-xPlugin/archive/refs/heads/main.zip';
      link.download = 'HIPAAChecker-xPlugin.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
    }
    
  };

  return (
    <div className='cardPlugin'>
      <Image
        src={logo}
        width={width}
        height={height}
        alt='logo'
      />
      <div className='cardPlugin__content'>
        <div className='cardPlugin__content__text'>
          <Heading
            title={title}
            type='h6'
          />
          <Text
            size='fs-16'
            color='neutral-700'
          >
            {description}
          </Text>
        </div>
        <div className='cardPlugin__button'>
          <Button
            isFullWidth
            type='primary'
            size='medium'
            icon={'download'}
            iconPosition={'after'}
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardPlugin;
