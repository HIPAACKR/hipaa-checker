import './index.scss';

const ProgressBar = ({ percentage, color, innerPercentage }) => {
  return (
    <div className='progressBar'>
      <div className='progressBar__line'>
        <div
          className={`progressBar__fill progressBar--${color}`}
          style={{ width: `${percentage}%` }}
        >
          {innerPercentage !== undefined && (
            <div
              className={`progressBar__inner-fill progressBar--${color}-inner`}
              style={{ width: `${innerPercentage}%` }}
            ></div>
          )}
        </div>
      </div>
      <span>{innerPercentage !== undefined ? innerPercentage : percentage}%</span>
    </div>
  );
};

export default ProgressBar;
