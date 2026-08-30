import Image from 'next/image';

import './index.scss';

const CompliancePainPoints = ({ data }) => {
  return (
    <>
    <div>
      <h2 className="text-3xl md:text-5xl text-[#1D2939] text-center">
        <span className="font-bold ">Why Compliance</span> Slows Development
      </h2>
    </div>
      <div className='compliancePainPoints__items'>
        {data.items.map((item, index) => (
          <div key={index} className='compliancePainPoints__item'>
            <div className='compliancePainPoints__icon'>
              <Image 
                src={`/images/common/${item.icon}`} 
                alt={item.title} 
                width={40} 
                height={40}
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <h3 className='compliancePainPoints__title'>{item.title}</h3>
            <p className="compliancePainPoints__description">
              {item.description}
            </p>
      </div>
        ))}
      </div>
    </>
  );
};

export default CompliancePainPoints;