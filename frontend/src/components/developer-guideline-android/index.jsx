// import { useEffect,useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// import Heading from '../heading';

// import './index.scss';

// const DeveloperGuidelineAndroid = ({ activeStep }) => {
//   const [isVideoVisible, setIsVideoVisible] = useState(false);

//   const handleVideoClick = () => {
//     setIsVideoVisible(true);
//   };

//   useEffect(() => {
//     setIsVideoVisible(false);
//   }, [activeStep]);

//   return (
//     <div className="developerGuidelineAndroid">
//       <div className="developerGuidelineAndroid__layout">
//         {isVideoVisible && (
//           <div className="developerGuidelineAndroid__video-content">
//             <Heading
//               title="How to install plugin On Android Studio"
//               type="h3"
//               color="neutral-800"
//               align="left"
//             />
//             <div className="developerGuidelineAndroid__video-image">
//               <iframe
//                 className="developerGuidelineAndroid__youtube__player"
//                 width="800"
//                 height="450"
//                 src="https://www.youtube.com/embed/nfrFJEOHrk8?si=tOiYhsFZ8c4rYYsI"
//                 title="YouTube video player"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                 allowFullScreen
//               ></iframe>
//             </div>
//             <p className="developerGuidelineAndroid__video-description">
//               Watch this video plugin installation from here.
//             </p>
//           </div>
//         )}
//         {!isVideoVisible && activeStep === 1 && (
//           <div className="developerGuidelineAndroid__install-step">
//             <div className="developerGuidelineAndroid__install-step__title">
//               Step 1: Download plugin
//             </div>
//             <div>
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 Download latest hipaachecker{' '}
//                 <strong className='developerGuidelineAndroid__install-step__bold-text'>
//                   build version 1.0.8{' '}
//                 </strong>
//                 <Link
//                   className='developerGuidelineAndroid__install-step__link'
//                   href='/downloads'
//                 >
//                   Click here to Download.
//                 </Link>
//               </p>
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 2 && (
//           <div className='developerGuidelineAndroid__install-step'>
//             <div className='developerGuidelineAndroid__install-step__title'>
//               Step 2: Create a hidden file
//             </div>
//             <div>
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 You need to create a hidden file named{' '}
//                 <span className='developerGuidelineAndroid__install-step__tag developerGuidelineAndroid__install-step__tag--red'>
//                   .hipaa_jwt
//                 </span>{' '}
//                 {`into your Android project's root directory.`}
//               </p>
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 3 && (
//           <div className='developerGuidelineAndroid__install-step'>
//             <div className='developerGuidelineAndroid__install-step__title'>
//               Step 3: Collect API credentials
//             </div>
//             <div>
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 Get and copy your API credentials from here{' \n'}
//                 <Link
//                   className='developerGuidelineAndroid__install-step__link'
//                   href='#'
//                 >
//                   Go to API Credential.
//                 </Link>
//               </p>
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 4 && (

//           <div className='developerGuidelineAndroid__install-step'>
//             <div className='developerGuidelineAndroid__install-step__title'>
//               Step 4: Copy and paste
//             </div>
//             <div>
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 Put the copied{' '}
//                 <strong className='developerGuidelineAndroid__install-step__bold-text developerGuidelineAndroid__install-step__bold-text--medium'>
//                   API KEY(jwt token)
//                 </strong>{' '}
//                 into this hidden file and save it. Sample of API Key inside {''}
//                 <span className='developerGuidelineAndroid__install-step__tag developerGuidelineAndroid__install-step__tag--red'>
//                   .hipaa_jwt
//                 </span>{' '}
//                 file as below:
//               </p>

//               <Image
//                 quality={100}
//                 src='/images/common/copy-and-paste.svg'
//                 alt='Copy and paste API key'
//                 className='developerGuidelineAndroid__install-step__instruction-image developerGuidelineAndroid__install-step__instruction-image--copy-paste'
//                 width={800}
//                 height={423}
//               />
//             </div>
//           </div>
//           )}
//           { !isVideoVisible && activeStep === 5 && (

//           <div className='developerGuidelineAndroid__install-step'>
//             <div className='developerGuidelineAndroid__install-step__title'>
//               Step 5: Install plugin
//             </div>
//             <div>
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 Install the plugin using{' \n'}
//                 <span className='developerGuidelineAndroid__install-step__tag developerGuidelineAndroid__install-step__tag--grey'>
//                   Install Plugin from Disk...
//                 </span>{' '}
//                 option from your Android Studio settings.
//                 <strong className='developerGuidelineAndroid__install-step__bold-text developerGuidelineAndroid__install-step__bold-text--regular'>
//                   {' '}
//                   <br />
//                   {`File -> Settings -> Plugins`}
//                 </strong>{' '}
//               </p>

//               <Image
//                 quality={100}
//                 src={'/images/common/install-plugin.svg'}
//                 alt={'Install plugin from disk'}
//                 className={'developerGuidelineAndroid__install-step__instruction-image'}
//                 width={800}
//                 height={642}
//               />
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 6 && (

//           <div className='developerGuidelineAndroid__install-step'>
//             <div className='developerGuidelineAndroid__install-step__title'>
//               Step 6: Installation status
//             </div>
//             <div>
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 If the plugin is installed successfully, it will look like this as below:
//               </p>

//               <Image
//                 quality={100}
//                 src='/images/common/installation-status.svg'
//                 alt='installation status'
//                 className='developerGuidelineAndroid__install-step__instruction-image'
//                 width={800}
//                 height={642}
//               />
//             </div>
//           </div>
//           )}
//           { !isVideoVisible && activeStep === 7 && (

//           <div className='developerGuidelineAndroid__install-step'>
//             <div className='developerGuidelineAndroid__install-step__title'>
//               Step 7: Menu placement for “Check HIPAA Compliances” in IDE
//             </div>
//             <div>
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 After the plugin gets installed, there will be a menu named{' '}
//                 <span className='developerGuidelineAndroid__install-step__tag developerGuidelineAndroid__install-step__tag--grey'>
//                   Check HIPAA Compliances
//                 </span>{' '}
//                 into the main menu on right most place in Mac and in Linux(Ubuntu), there will be
//                 Check HIPAA in the main menu and then Check HIPAA Compliances will be as sub menu.
//               </p>

//               <Image
//                 quality={100}
//                 src={'/images/common/menu-placement.svg'}
//                 alt={'Menu placement for Check HIPAA Compliances'}
//                 className='developerGuidelineAndroid__install-step__instruction-image developerGuidelineAndroid__install-step__instruction-image--placement'
//                 width={800}
//                 height={222}
//               />
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 Upon clicking on the menu, there will be a few sequential dialogues and you will get
//                 the HIPAA report link in your email Inbox after a while.
//               </p>
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 8 && (

//           <div className='developerGuidelineAndroid__install-step'>
//             <div className='developerGuidelineAndroid__install-step__title'>
//               Step 8: Uninstall process!
//             </div>
//             <div>
//               <p className='developerGuidelineAndroid__install-step__description'>
//                 It is pretty easy to uninstall or disable the plugin from the options on gear icon
//                 of the plugin as below:
//               </p>

//               <Image
//                 quality={100}
//                 src='/images/common/uninstall-process.svg'
//                 alt='uninstall process'
//                 className='developerGuidelineAndroid__install-step__instruction-image developerGuidelineAndroid__install-step__instruction-image--uninstall-process'
//                 width={800}
//                 height={591}
//               />
//             </div>
//           </div>
//           )}
//         </div>

//       </div>

//       // {!isVideoVisible && activeStep === 9 && (      
//       // <div className='developerGuidelineAndroid__ide-demo'>
//       //   <div className='developerGuidelineAndroid__ide-demo__container'>
//       //     <div className='developerGuidelineAndroid__ide-demo__title'>
//       //       The plugin is tested and all the screenshots are taken in the IDE of Android Studio
//       //       Dolphin. More environment specification is given below:
//       //     </div>
//       //     <div className='developerGuidelineAndroid__ide-demo__code'>
//       //       {`Build #AI-213.7172.25.2113.9123335, built on September 30, 2022\nRuntime version: 11.0.13+0-b1751.21-8125866 amd64 \nVM: OpenJDK 64-Bit Server VM by JetBrains s.r.o.\nLinux 5.4.0-135-generic(Ubuntu 18.04.2 LTS) \nGC: G1 Young Generation, G1 Old Generation \nMemory: 1280M\nCores: 8\nRegistry:\nexternal.system.auto.import.disabled=true\nide.text.editor.with.preview.show.floating.toolbar=false \n \n \nCurrent Desktop:GNOME-Flashback:GNOME`}
//       //     </div>
//       //   </div>
//       // </div> 
//       // )}
//     // </div>
//     // </div>
    
//   );
// };

// export default DeveloperGuidelineAndroid;




import { useEffect, useState } from 'react';

import { landingPage } from '@/data/static-data';

import Heading from '../heading';

import './index.scss';

const { androidGuidelineData } = landingPage;

const DeveloperGuidelineAndroid = ({ activeStep }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    setIsVideoVisible(false);
  }, [activeStep]);

  if (!isVideoVisible && activeStep >= 1 && activeStep <= androidGuidelineData.length) {
    const stepData = androidGuidelineData[activeStep - 1];

    return (
      <div className="developerGuidelineAndroid">
        <div className="developerGuidelineAndroid__layout">
          <div className="developerGuidelineAndroid__install-step">
            <div className="developerGuidelineAndroid__install-step__title">
              {stepData.title}
            </div>
            <div>
              <p 
                className="developerGuidelineAndroid__install-step__description"
                dangerouslySetInnerHTML={{ __html: stepData.description }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="developerGuidelineAndroid">
      <div className="developerGuidelineAndroid__layout">
        {isVideoVisible && (
          <div className="developerGuidelineAndroid__video-content">
            <Heading
              title="How to install plugin On Android Studio"
              type="h3"
              color="neutral-800"
              align="left"
            />
            <div className="developerGuidelineAndroid__video-image">
              <iframe
                className="developerGuidelineAndroid__youtube__player"
                width="800"
                height="450"
                src="https://www.youtube.com/embed/nfrFJEOHrk8?si=tOiYhsFZ8c4rYYsI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <p className="developerGuidelineAndroid__video-description">
              Watch this video plugin installation from here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperGuidelineAndroid;