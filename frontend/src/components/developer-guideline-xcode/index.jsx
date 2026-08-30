// 'use client';
// import { useEffect,useState } from 'react';
// import Image from 'next/image';

// import Heading from '../heading';

// import './index.scss';

// const DeveloperGuidelineXcode = ({ activeStep }) => {
// const [isVideoVisible, setIsVideoVisible] = useState(false);

//   const handleVideoClick = () => {
//     setIsVideoVisible(true);
//   };

//   useEffect(() => {
//     setIsVideoVisible(false);
//   }, [activeStep]);
//   return (
//     <div className='developerGuidelineXcode'>
//       <div className="developerGuidelineXcode__layout">
//         {isVideoVisible && (
//           <div className='developerGuidelineXcode__video-content'>
//           <Heading
//             title='How to install plugin On XCode'
//             type='h3'
//             color='neutral-800'
//             align='left'
//           />
//           <div className='developerGuidelineXcode__video-image'>
//             <iframe
//               className='developerGuidelineXcode__youtube__player'
//               width='800'
//               height='450'
//               src='https://www.youtube.com/embed/9z4EgX2acUQ'
//               title='YouTube video player'
//               frameBorder='0'
//               allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
//               referrerPolicy='strict-origin-when-cross-origin'
//               allowFullScreen
//             ></iframe>
            
//           </div>
//           <p className='developerGuidelineXcode__video-description'>
//             Watch this video plugin installation from here.
//           </p>
//           </div>
//         )}
        
//           {!isVideoVisible && activeStep === 1 && (
//           <div className='developerGuidelineXcode__install-step'>
//             <div className='developerGuidelineXcode__install-step__title'>
//               Step 1: Create Project
//             </div>
//             <div>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 From the iOS IDE - Xcode, create a project
//                 <strong className='developerGuidelineXcode__install-step__bold-text'></strong>
//               </p>
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 2 && (
//           <div className='developerGuidelineXcode__install-step'>
//             <div className='developerGuidelineXcode__install-step__title'>Step 2: Add Package</div>
//             <div>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 Click on the File option Xcode and click
//                 <span style={{ color: '#c16f6f', fontWeight: 'bold' }}>
//                   {' '}
//                   &quot;Add Package....&quot;
//                 </span>
//               </p>
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 3 && (
//           <div className='developerGuidelineXcode__install-step'>
//             <div className='developerGuidelineXcode__install-step__title'>
//               Step 3: Download Package from Github
//             </div>
//             <div>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 <span className='step-number'>1.</span> Search for HIPAAChecker-iOS or paste the
//                 GitHub repository link.
//                 <br />
//                 <span className='step-number'>2.</span> Select the main branch.
//                 <br />
//                 <span className='step-number'>3.</span> Click
//                 <span style={{ color: '#c16f6f', fontWeight: 'bold' }}>
//                   {' '}
//                   &quot;Add Package&quot;
//                 </span>
//                 .<br />
//                 <span className='step-number'>4.</span> HIPAAChecker main will be shown in the
//                 project Package Dependencies.
//               </p>
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 4 && (

//           <div className='developerGuidelineXcode__install-step'>
//             <div className='developerGuidelineXcode__install-step__title'>
//               Step 4: Project Build Phase configuration
//             </div>
//             <div>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 <span className='step-number'>1.</span> Select the project file in Xcode.
//                 <br />
//                 <span className='step-number'>2.</span> Go to Build Phases.
//                 <br />
//                 <span className='step-number'>3.</span> Expand Link Binary With Libraries.
//                 <br />
//                 <span className='step-number'>4.</span> Click
//                 <span style={{ color: '#c16f6f', fontWeight: 'bold' }}> &quot;+&quot; </span> icon.
//                 <br />
//                 <span className='step-number'>5.</span> Search for HIPAAChecker.
//                 <br />
//                 <span className='step-number'>6.</span> Add HIPAAChecker.
//               </p>

//               <Image
//                 quality={100}
//                 src='/images/common/s1.jpg'
//                 alt='Add HIPAAChecker package'
//                 className='developerGuidelineXcode__install-step__instruction-image developerGuidelineXcode__install-step__instruction-image--copy-paste'
//                 width={800}
//                 height={423}
//               />
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 5 && (

//           <div className='developerGuidelineXcode__install-step'>
//             <div className='developerGuidelineXcode__install-step__title'>
//               Step 5: Project configuration
//             </div>
//             <div>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 <span className='step-number'>1.</span> Go to the initial file that would be run
//                 after starting the project. It can be AppDelegate or SceneDelegate or any other root
//                 viewcontroller
//                 <br />
//                 <span className='step-number'>2.</span> Import HIPAAChecker.
//                 <br />
//               </p>

//               <Image
//                 quality={100}
//                 src={'/images/common/s2.jpg'}
//                 alt={'Import HIPAAChecker'}
//                 className='developerGuidelineXcode__install-step__instruction-image mb-6'
//                 width={800}
//                 height={642}
//               />
//               <Image
//                 quality={100}
//                 src={'/images/common/s3.jpg'}
//                 alt={'Initialize HIPAAChecker'}
//                 className='developerGuidelineXcode__install-step__instruction-image'
//                 width={800}
//                 height={642}
//               />
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 6 && (

//           <div className='developerGuidelineXcode__install-step'>
//             <div className='developerGuidelineXcode__install-step__title'>
//               Step 6: Package Initialization
//             </div>
//             <div>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 If the plugin is installed successfully, the package API will be accessible.
//               </p>
//               <p className='developerGuidelineXcode__install-step__description'>Just add:</p>
//               <pre className='developerGuidelineXcode__install-step__code'>
//                 <code>
//                   <span style={{ color: '#943ead' }}>let _ </span>
//                   <span style={{ color: '#f31c16 ' }}>= </span>
//                   <span style={{ color: '#13610d' }}>HIPAAChecker</span>
//                   <span style={{ color: '#f31c17 ' }}>(</span>
//                   <span style={{ color: '#13610d' }}>in</span>
//                   <span style={{ color: '#f31c16 ' }}>:</span>
//                   <span style={{ color: '#6a177f ' }}>self.</span>
//                   <span style={{ color: '#b52ad8  ' }}>view</span>
//                   <span style={{ color: '#f31c17' }}>,</span>

//                   <span style={{ color: '#98c379' }}>projectPath</span>
//                   <span style={{ color: '#f31c17' }}>:</span>
//                   <span style={{ color: '#c16f6f' }}>&quot; &quot;</span>
//                   <span style={{ color: '#f31c17' }}>,</span>

//                   <span style={{ color: '#98c379' }}>email</span>
//                   <span style={{ color: '#f31c17' }}>:</span>
//                   <span style={{ color: '#c16f6f' }}>&quot; &quot;</span>
//                   <span style={{ color: '#f31c17' }}>,</span>

//                   <span style={{ color: '#98c379' }}>password</span>
//                   <span style={{ color: '#f31c17' }}>:</span>
//                   <span style={{ color: '#c16f6f' }}>&quot; &quot;</span>
//                   <span style={{ color: '#f31c17' }}>)</span>
//                 </code>
//               </pre>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 <br />
//                 <strong>Self.view</strong> will be the view that needs to be passed. It can be a
//                 window view or any view in a controller.
//               </p>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 Project path needs to be given. It can be copied from the Xcode right panel or from
//                 Finder in Mac. That is the root directory of the project.
//               </p>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 The email and password are the credentials of the HIPAA checker platform.
//               </p>

//               <Image
//                 quality={100}
//                 src={'/images/common/st4.jpg'}
//                 alt={'HIPAAChecker initialization'}
//                 className='developerGuidelineXcode__install-step__instruction-image  mb-6'
//                 width={800}
//                 height={642}
//               />
//               <Image
//                 quality={100}
//                 src={'/images/common/s6.jpg'}
//                 alt={'HIPAAChecker initialization with credentials'}
//                 className='developerGuidelineXcode__install-step__instruction-image'
//                 width={800}
//                 height={642}
//               />
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 7 && (

//           <div className='developerGuidelineXcode__install-step'>
//             <div className='developerGuidelineXcode__install-step__title'>Step 7: Run Package</div>
//             <div>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 After adding these code in the project, just run the project. It will traverse the
//                 project with valid token and find the HIPAA rules implementation on the project. The
//                 report can be shown on the HIPAA checker web platform. The above code should be
//                 comment out if the developer do not want to check the HIPAA rules everytime when the
//                 project started.
//               </p>
//             </div>
//           </div>
//           )}
//           {!isVideoVisible && activeStep === 8 && (

//           <div className='developerGuidelineXcode__install-step'>
//             <div className='developerGuidelineXcode__install-step__title'>
//               Step 8: Uninstall process!
//             </div>
//             <div>
//               <p className='developerGuidelineXcode__install-step__description'>
//                 <span className='step-number'>1.</span> Go to the Package Dependencies from Project
//                 navigation.
//                 <br />
//                 <span className='step-number'>2.</span> Remove the package by clicking{' '}
//                 <span style={{ color: '#c16f6f', fontWeight: 'bold' }}>&quot;-&quot; </span>after
//                 selecting the package.
//                 <br />
//               </p>

//               <Image
//                 quality={100}
//                 src={'/images/common/s8.jpg'}
//                 alt={'Remove HIPAAChecker package'}
//                 className='developerGuidelineXcode__install-step__instruction-image developerGuidelineXcode__install-step__instruction-image--uninstall-process'
//                 width={800}
//                 height={591}
//               />
//             </div>
//           </div>
//           )}
//         </div>
//       </div>
//   );
// };

// export default DeveloperGuidelineXcode;


'use client';
import { useEffect, useState } from 'react';

import { landingPage } from '@/data/static-data';

import Heading from '../heading';

import './index.scss';

const { xcodeGuidelineData } = landingPage;

const DeveloperGuidelineXcode = ({ activeStep }) => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    setIsVideoVisible(false);
  }, [activeStep]);

  if (!isVideoVisible && activeStep >= 1 && activeStep <= xcodeGuidelineData.length) {
    const stepData = xcodeGuidelineData[activeStep - 1];
    
    return (
      <div className="developerGuidelineXcode">
        <div className="developerGuidelineXcode__layout">
          <div className="developerGuidelineXcode__install-step">
            <div className="developerGuidelineXcode__install-step__title">
              {stepData.title}
            </div>
            <div>
              <p 
                className="developerGuidelineXcode__install-step__description"
                dangerouslySetInnerHTML={{ __html: stepData.description }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="developerGuidelineXcode">
      <div className="developerGuidelineXcode__layout">
        {isVideoVisible && (
          <div className="developerGuidelineXcode__video-content">
            <Heading
              title="How to install plugin On XCode"
              type="h3"
              color="neutral-800"
              align="left"
            />
            <div className="developerGuidelineXcode__video-image">
              <iframe
                className="developerGuidelineXcode__youtube__player"
                width="800"
                height="450"
                src="https://www.youtube.com/embed/9z4EgX2acUQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <p className="developerGuidelineXcode__video-description">
              Watch this video plugin installation from here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperGuidelineXcode;