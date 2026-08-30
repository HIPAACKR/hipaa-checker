// 'use client';
// import Image from 'next/image';
// import Slider from 'react-slick';

// import { landingPage } from '@/data/static-data';

// import Text from '../text';

// import './index.scss';

// const Testimonial = () => {
//   const { testimonial } = landingPage;

//   const settings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     initialSlide: 0,
//   };

//   return (
//     <div className='testimonial'>
//       <Slider {...settings}>
//         {testimonial?.map((item, index) => (
//           <div
//             key={index}
//             className='testimonial__card'
//           >
//             <Image
//               className='testimonial__logo'
//               src={`/images/icons/${item.companyLogo}`}
//               alt={item.companyLogo}
//               width={140}
//               height={40}
//             />
//             <div className='testimonial__comment'>&quot;{item.comment}</div>
//             <div>
//               <Image
//                 className='testimonial__avatar'
//                 src={`/images/common/${item.user.avatar}.svg`}
//                 alt={item.user.avatar}
//                 width={64}
//                 height={64}
//               />
//               <Text
//                 size='fs-16'
//                 color='neutral-900'
//                 weight='semi-bold'
//                 align='center'
//               >
//                 {item.user.name}
//               </Text>
//               <Text
//                 size='fs-14'
//                 color='neutral-600'
//                 align='center'
//               >
//                 {item.user.designation}
//               </Text>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default Testimonial;
