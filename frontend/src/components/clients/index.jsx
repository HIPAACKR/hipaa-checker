// 'use client';
// import Image from 'next/image';
// import Link from 'next/link';
// import Slider from 'react-slick';

// import { landingPage } from '@/data/static-data';

// import './index.scss';

// const Clients = () => {
//   const { items } = landingPage.clients;
//   const settings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 3,
//     initialSlide: 0,
//     responsive: [
//       {
//         breakpoint: 1080,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 3,
//         },
//       },
//       {
//         breakpoint: 850,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 3,
//         },
//       },
//       {
//         breakpoint: 650,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 3,
//         },
//       },
//     ],
//   };
//   return (
//     <Slider
//       {...settings}
//       className='clients'
//     >
//       {items?.map((item, index) => (
//         <Link
//           href={item?.url}
//           target='_blank'
//           key={index}
//           className='clients__logo-wrapper'
//         >
//           <Image
//             className='clients__logo'
//             src={`/images/icons/${item?.icon}`}
//             alt={item}
//             width={230}
//             height={80}
//           />
//         </Link>
//       ))}
//     </Slider>
//   );
// };

// export default Clients;
