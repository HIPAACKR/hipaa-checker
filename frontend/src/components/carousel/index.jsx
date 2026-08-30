'use client';
import Slider from 'react-slick';

import { featureArray } from '@/utils/constant-data';

import CardFeature from '../card-feature';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.scss';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          // rows: 2,
          slidesPerRow: 1,
        },
      },
    ],
  };
  return (
    <div className='carousel'>
      <Slider {...settings}>
        {featureArray?.map((item) => (
          <CardFeature
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            slug={item.slug}
          />
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
