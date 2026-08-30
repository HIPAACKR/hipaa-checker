'use client';
import { useEffect,useMemo,useState } from 'react';
import Image from 'next/image';

import UserGuidelineClient from '@/app/(frontend)/(landing)/user-guideline/UserGuidelineClient';
import { landingPage } from '@/data/static-data';

import DeveloperGuidelineAndroid from '../developer-guideline-android';
import DeveloperGuidelineXcode from '../developer-guideline-xcode';

import './index.scss';

const { userGuidelineData, androidGuidelineData, xcodeGuidelineData } = landingPage;

const Documentation = () => {
  const [openDevMenu, setOpenDevMenu] = useState(false);
  const [openAndroidSteps, setOpenAndroidSteps] = useState(false);
  const [openXcodeSteps, setOpenXcodeSteps] = useState(false);

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  // const [videoReady, setVideoReady] = useState(false);
  const [activePlatform, setActivePlatform] = useState(null);
  const [defaultGettingStarted, setDefaultGettingStarted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileGettingStartedOpen, setMobileGettingStartedOpen] = useState(false);
  const [xcodeVideoReady, setXcodeVideoReady] = useState(false);
  const [androidVideoReady, setAndroidVideoReady] = useState(false);
  const [readyVideo, setReadyVideo] = useState(null);



  const androidSteps = useMemo(() => 
    androidGuidelineData.map((step, index) => ({
      number: index + 1,
      title: step.title.replace(/^Step \d+:\s*/, ''),
    })),
    []
  );

  const xcodeSteps = useMemo(() => 
    xcodeGuidelineData.map((step, index) => ({
      number: index + 1,
      title: step.title.replace(/^Step \d+:\s*/, ''),
    })),
    []
  );

  const searchableContent = useMemo(() => {
    const content = [];
    
    androidGuidelineData.forEach((step, index) => {
      content.push({
        type: 'android',
        step: index + 1,
        title: step.title,
        description: step.description,
        platform: 'Android Studio'
      });
    });
    
    xcodeGuidelineData.forEach((step, index) => {
      content.push({
        type: 'xcode',
        step: index + 1,
        title: step.title,
        description: step.description,
        platform: 'XCode'
      });
    });
    
    userGuidelineData.forEach((step, index) => {
      content.push({
        type: 'user',
        step: index,
        title: step.title,
        description: step.description,
        platform: 'User Guide'
      });
    });
    
    return content;
  }, []);
  useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchWrapper = document.querySelector('.search-box-wrapper');
      if (searchWrapper && !searchWrapper.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDevMenu = () => {
    setOpenDevMenu((prev) => {
      const newState = !prev;
     if (!newState) {
  setOpenAndroidSteps(false);
  setOpenXcodeSteps(false);
  setActiveStep(null);
  setVideoOpen(false);
  
}
      return newState;
    });
    setOpenUserMenu(false);
  };

 const toggleAndroidSteps = () => {
  setActivePlatform('android');
  setOpenAndroidSteps((prev) => {
    const newState = !prev;
    if (!newState) {
      setActiveStep(null);
      setVideoOpen(false);
      setActivePlatform(null);
    } else {
      setActiveStep(null);   
      setVideoOpen(true);    
    }
    return newState;
  });
  setOpenXcodeSteps(false);
  setOpenUserMenu(false);
};

 const toggleXcodeSteps = () => {
  setActivePlatform('xcode');
  setOpenXcodeSteps((prev) => {
    const newState = !prev;
    if (!newState) {
      setActiveStep(null);
      setVideoOpen(false);
    } else {
      setActiveStep(null);   
      setVideoOpen(true);    
    }
    return newState;
  });
  setOpenAndroidSteps(false);
  setOpenUserMenu(false);
};

  const handleStepClick = (step) => {
    setActiveStep(step);
    setVideoOpen(false);
    // setVideoReady(false);
    setDefaultGettingStarted(false);
  };

  const toggleVideo = () => {
    setVideoOpen(true);
    setActiveStep(null);
    // setVideoReady(false);
  };


  useEffect(() => {
  localStorage.removeItem('activeStep');
  setVideoOpen(true);
  // setVideoReady(false);
  setActiveStep(null);
  setActivePlatform(null);  
  setDefaultGettingStarted(true);
}, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    const stripHtml = (html) => {
      if (!html) return '';
      return html
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<pre[^>]*>.*?<\/pre>/gi, '')
        .replace(/<code[^>]*>.*?<\/code>/gi, '')
        .replace(/<[^>]+>/g, ' ')

        .replace(/\\/g, '')

        .replace(/\s+/g, ' ')
 
        .trim();
    };
    
    const results = searchableContent
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const cleanDescription = stripHtml(item.description);
        const descMatch = cleanDescription.toLowerCase().includes(lowerQuery);
        return titleMatch || descMatch;
      })
      .map(item => {

        const cleanDescription = stripHtml(item.description);
        const searchText = cleanDescription || item.title;
        const lowerText = searchText.toLowerCase();
        const matchIndex = lowerText.indexOf(lowerQuery);
        
        let snippet = '';
        if (matchIndex !== -1) {
          const start = Math.max(0, matchIndex - 30);
          const end = Math.min(searchText.length, matchIndex + lowerQuery.length + 30);
          snippet = (start > 0 ? '...' : '') + 
                    searchText.slice(start, end) + 
                    (end < searchText.length ? '...' : '');
        }
        
        return { ...item, snippet };
      });
    
    setSearchResults(results);
    setShowSearchDropdown(results.length > 0);
  };

  const handleSearchResultClick = (result) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    
    if (result.type === 'android') {
      setOpenDevMenu(true);
      setOpenAndroidSteps(true);
      setOpenXcodeSteps(false);
      setOpenUserMenu(false);
      setActivePlatform('android');
      handleStepClick(result.step);
    } else if (result.type === 'xcode') {
      setOpenDevMenu(true);
      setOpenXcodeSteps(true);
      setOpenAndroidSteps(false);
      setOpenUserMenu(false);
      setActivePlatform('xcode');
      handleStepClick(result.step);
    } else if (result.type === 'user') {
      setOpenUserMenu(true);
      setOpenDevMenu(false);
      setOpenAndroidSteps(false);
      setOpenXcodeSteps(false);
      setActivePlatform('user');
      setActiveStep(result.step);
      setDefaultGettingStarted(false);
    }
  };


  return (
    <div className="documentation">
      <div className="documentation__layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            {/* Search box */}
            <div className="search-box-wrapper">
              <div className="search-box">
                <Image
                  src="/images/icons/searchicon.svg"
                  alt="search icon"
                  width={20}
                  height={20}
                  className="search-icon"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchDropdown(true)}
                />
              </div>
              
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="search-dropdown-item"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <div className="search-result-platform">{result.platform}</div>
                      <div className="search-result-title">{result.title}</div>
                      {result.snippet && (
                        <div className="search-result-snippet">{result.snippet}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="sidebar-title">Documentation Categories</p>
            <div className="main-content">
              <div className="getting-started-box">
                <button
                  className={`sidebar-subtitle ${defaultGettingStarted ? 'active' : ''}`}
                  onClick={() => {
                    if (isMobile) {
                      setMobileGettingStartedOpen(!mobileGettingStartedOpen);
                    } else {
                      const isActive = defaultGettingStarted;
                      setDefaultGettingStarted(!isActive);
                      setVideoOpen(true);
                      // setVideoReady(false);
                      setActiveStep(null);
                      setActivePlatform(null);
                    }
                  }}
                >
                  <span>Getting started</span>
                  <Image
                    src="/images/icons/chevronuparrow.svg"
                    alt="arrow"
                    width={20}
                    height={20}
                    className={`getting-started-arrow ${
                      isMobile
                        ? mobileGettingStartedOpen
                          ? 'rotate'
                          : ''
                        : defaultGettingStarted
                        ? 'rotate'
                        : ''
                    }`}
                  />
                </button>
              </div>

              {( !isMobile || mobileGettingStartedOpen ) && (
                <div className={`sidebar-guides ${openDevMenu || openUserMenu ? 'scroll-active' : ''}`}>
                  {/* Developer Guide */}
                  <div className="sidebar-dropdown">
                    <button
                      className={`sidebar-dropdown-btn ${openDevMenu ? 'active' : ''}`}
                      onClick={toggleDevMenu}
                    >
                      Developer Guide
                      <Image
                        src="/images/icons/chevrondown.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                        className={`arrow ${openDevMenu ? 'rotate' : ''}`}
                      />
                    </button>
                    {openDevMenu && (
                      <>
                        {/* Android Studio */}
                                <div className="sidebar-submenu">
                                  <button
                                    className={`sidebar-sublink ${openAndroidSteps ? 'active' : ''}`}
                                    onClick={toggleAndroidSteps}
                                  >
                                    Android Studio
                                    <Image
                                      src={
                                        window.innerWidth <= 768 
                                          ? openAndroidSteps
                                            ? '/images/icons/minus.svg'
                                            : '/images/icons/plus.svg'
                                          : '/images/icons/chevrondown.svg'
                                      }
                                      alt={openAndroidSteps ? 'Collapse' : 'Expand'}
                                      width={20}
                                      height={20}
                                      className={`arrow ${openAndroidSteps && window.innerWidth > 768 ? 'rotate' : ''}`}
                                    />
                                  </button>

                                  {openAndroidSteps && (
                                    <div className="sidebar-steps">
                                      <button
                                        className={`getting-started-text ${videoOpen ? 'active' : ''}`}
                                        onClick={toggleVideo}
                                      >
                                        Android Getting started
                                      </button>

                                      {androidSteps.map((step) => (
                                        <button
                                          key={step.number}
                                          className={`sidebar-sublink step ${activeStep === step.number ? 'active' : ''}`}
                                          onClick={() => handleStepClick(step.number)}
                                        >
                                          {`Step ${step.number}: ${step.title}`}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* XCode */}
                                <div className="sidebar-submenu">
                                  <button
                                    className={`sidebar-sublink ${openXcodeSteps ? 'active' : ''}`}
                                    onClick={toggleXcodeSteps}
                                  >
                                    XCode
                                    <Image
                                      src={
                                        window.innerWidth <= 768
                                          ? openXcodeSteps
                                            ? '/images/icons/minus.svg'
                                            : '/images/icons/plus.svg'
                                          : '/images/icons/chevrondown.svg'
                                      }
                                      alt={openXcodeSteps ? 'Collapse' : 'Expand'}
                                      width={20}
                                      height={20}
                                      className={`arrow ${openXcodeSteps && window.innerWidth > 768 ? 'rotate' : ''}`}
                                    />
                                  </button>

                                  {openXcodeSteps && (
                                    <div className="sidebar-steps">
                                      <button
                                        className={`getting-started-text ${videoOpen ? 'active' : ''}`}
                                        onClick={toggleVideo}
                                      >
                                        XCode Getting started
                                      </button>

                                      {xcodeSteps.map((step) => (
                                        <button
                                          key={step.number}
                                          className={`sidebar-sublink step ${activeStep === step.number ? 'active' : ''}`}
                                          onClick={() => handleStepClick(step.number)}
                                        >
                                          {`Step ${step.number}: ${step.title}`}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                        
                      </>
                    )}
                  </div>

                  {/* User Guide */}
                  <div className="sidebar-dropdown">
                    <button
                      className={`sidebar-dropdown-btn ${openUserMenu ? 'active' : ''}`}
                     onClick={() => {
                      setOpenUserMenu(!openUserMenu);
                      setActivePlatform('user');
                      setActiveStep(null);
                      setVideoOpen(false);              
                      setDefaultGettingStarted(false);  
                      setOpenXcodeSteps(false);
                      setOpenAndroidSteps(false);
                    }}
                    >
                      User Guide
                      <Image
                        src="/images/icons/chevrondown.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                        className={`arrow ${openUserMenu ? 'rotate' : ''}`}
                      />
                    </button>

                    {openUserMenu && (
                      <div className="sidebar-userguide-steps">
                        {userGuidelineData.map((step, index) => (
                          <button
                            key={index}
                            className={`user-step ${activeStep === index ? 'active' : ''}`}
                           onClick={() => {
                            setActiveStep(index);
                            setVideoOpen(false);              
                            setActivePlatform('user');        
                            setDefaultGettingStarted(false);
                          }}
                          >
                            {step.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>        
        </aside>

        {/* Content */}
       <div className="content-container">
          {videoOpen ? (
            activePlatform === null ? (
              <>
                <div className="video-container">
                  <h2 className="video-title">
                    Getting started: How to install plugin on <strong>Xcode</strong>
                  </h2>
                  <div className="video-thumbnail" onClick={() => setXcodeVideoReady(true)}>
                    {xcodeVideoReady ? (
                     <iframe
                      src='https://www.youtube.com/embed/9z4EgX2acUQ'
                      title='YouTube video player'
                      frameBorder='0'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      referrerPolicy='strict-origin-when-cross-origin'
                      allowFullScreen
                    ></iframe>
                    ) : (
                    <>
                    <Image
                      src="/images/common/video_thumnail.png"
                      alt="Xcode Video"
                      layout="fill"
                      objectFit="cover"
                    />
                    
                     </>
                    )}
                  </div>

                  <p className="video-captionthumb">
                      Watch this video plugin installation from here.
                  </p>
                </div>
                 <div className="VideoSection__divider"></div>
                    <p className="video-captionthumb"></p>

                <div className="video-container">
                  <h2 className="video-title">
                    Getting started: How to install plugin on <strong>Android Studio</strong>
                  </h2>
                  <div className="video-thumbnail" onClick={() => setAndroidVideoReady(true)}>
                    {androidVideoReady ? (
                     <iframe
                    src="https://www.youtube.com/embed/nfrFJEOHrk8?si=tOiYhsFZ8c4rYYsI"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                    ) : (
                    <>
                    <Image
                      src="/images/common/video_thumnail_2.png"
                      alt="Android Video"
                      layout="fill"
                      objectFit="cover"
                    />
                    
                    </>
                    )}
                  </div>
                  <p className="video-captionthumb">
                      Watch this video plugin installation from here.
                  </p>
                </div>
                <div className="VideoSection__divider"></div>
              </>
            ) : (
             <div className="video-container">
              <h2 className="video-title">
                Getting started: How to install plugin on{' '}
                <strong>{activePlatform === 'android' ? 'Android Studio' : 'Xcode'}</strong>
              </h2>

              <div
                className="video-thumbnail"
                onClick={() => setReadyVideo(activePlatform)} 
              >
                {readyVideo === activePlatform ? (
                  <iframe
                    src={
                      activePlatform === 'android'
                        ? ' https://www.youtube.com/embed/nfrFJEOHrk8?si=tOiYhsFZ8c4rYYsI'
                        : 'https://www.youtube.com/embed/9z4EgX2acUQ'
                      
                    }
                    title={`${activePlatform} video player`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <Image
                    src={
                      activePlatform === 'android'
                        ? '/images/common/video_thumnail_2.png'
                        : '/images/common/video_thumnail.png'
                    }
                    alt={`${activePlatform} Video`}
                    layout="fill"
                    objectFit="contain" 
                  />
                )}
              </div>

              <p className="video-captionthumb">
                Watch this video plugin installation from here.
              </p>
            </div>

            )
        ) : activeStep !== null ? (
          activePlatform === 'android' ? (
            <DeveloperGuidelineAndroid activeStep={activeStep} />
          ) : activePlatform === 'xcode' ? (
            <DeveloperGuidelineXcode activeStep={activeStep} />
          ) : (
            <UserGuidelineClient activeStep={activeStep} onStepClick={setActiveStep} />
          )
        ) : activePlatform === 'user' && openUserMenu ? (
          // User Guide is open but no step selected yet — show first step automatically
          <UserGuidelineClient activeStep={0} onStepClick={(step) => { setActiveStep(step); }} />
        ) : null}
        </div>
        
      </div>
    </div>
  );
};

export default Documentation;
