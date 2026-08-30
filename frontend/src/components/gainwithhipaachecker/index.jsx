import Image from 'next/image';

import './index.scss';

const GainWithHIPAAChecker = ({ data }) => {
  return (
    <section className='home__gainWithHIPAAChecker '>
      <div className='gain__container'>
        <div className='gain__image'>
          <Image
            src='/images/common/gain.png'
            alt='Graph showing gains with HIPAAChecker'
            width={300}
            height={300}
          />
        </div>

        <div className='gain__content'>
          <div>
            <h2 className='text-3xl md:text-4xl'>
              What You Gain with <span className='font-bold'>HIPAAChecker</span>
            </h2>
          </div>
          <div className='gain__items'>
            <div className='gain__row'>
              {data.gains.slice(0, 2).map((item, index) => (
                <div
                  className='gain__item gain__item--centered'
                  key={index}
                >
                  <h3>{item.stat}</h3>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
            <div className='gain__item gain__item--centered'>
              <h3>{data.gains[2].stat}</h3>
              <h4>{data.gains[2].title}</h4>
              <p>{data.gains[2].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GainWithHIPAAChecker;