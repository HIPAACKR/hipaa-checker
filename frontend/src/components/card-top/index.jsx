import Icon from '@/components/icon';

import './index.scss';

const CardTop = ({ title, color, icon, value }) => {
  return (
    <div className='cardTop'>
      <div className='cardTop__detail'>
        <span className='cardTop__title'>{title}</span>
        <span className='cardTop__value'>
          {value}
          {title !== 'Total Scanned'}
        </span>
      </div>
      <div className={`cardTop__imageContent cardTop--${color}`}>
        <span className='cardTop__icon'>
          <Icon
            name={icon}
            size={21}
          />
        </span>
      </div>
    </div>
  );
};

export default CardTop;
