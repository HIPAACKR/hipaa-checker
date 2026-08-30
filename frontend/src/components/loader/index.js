import Text from '../text';

import './index.scss';

const Loader = ({ size, count = false }) => {
  return (
    <div
      className={`e-loader-container ${count && 'e-loader-container-count'} ${
        size == 'large' && 'e-loader-container--large'
      }`}
    >
      <div className={`e-loader-container__spinner--${size}`}></div>
      <Text
        color='neutral-400'
        size='fs-14'
        weight='regular'
        align='center'
      >
        Data Fetching from server
      </Text>
    </div>
  );
};

export default Loader;
