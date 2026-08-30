'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import BlogSuggestionParser from '@/components/BlogContentParser';
import Footer from '@/components/footer';
import StartFree from '@/components/start-free';
import { get } from '@/utils/api-service';

import './index.scss';

export default function BlogDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const fetchBlogDetails = async () => {
    setIsLoading(true);

    try {
      const data = await get(
        `blogs/${id}`, // endpoint
        true,          // auth required (match blogs list)
        false,
        1
      );

      // API may wrap data differently
      const blog = data?.data || data;

      if (!blog) {
        throw new Error('Blog not found');
      }

      setBlogData(blog);
    } catch (error) {
      const apiError =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to load blog details';

      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  if (id) {
    fetchBlogDetails();
  }
}, [id]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p>Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="notFound" style={{ textAlign: 'center', padding: '100px 20px' }}>
        Blog not found
      </div>
    );
  }

  return (
    <>
      <section className="eyeCatch__hero-section">
        <div className="hero-container">
          <button className="back-btn" onClick={() => router.back()}>
            <Image 
              src="/images/icons/rightwhitearrow.svg" 
              alt="Back"
              width={20} 
              height={20} 
              className="back-icon"
            />
            <span>Back</span>
          </button>
          <div className="hero__icon">
            <span>{blogData.category || 'Blog'}</span>
          </div>
          <h1 className="title">{blogData.title}</h1>
          <p className="hero-subtitle">
            {blogData.description|| blogData.desc || ''}
          </p>
          <div className="author">
            <Image 
              src="/images/icons/profile.svg" 
              alt={blogData.name || 'Author'} 
              width={40} 
              height={40} 
              className="author__img" 
            />
            <div className="author__info">
              <p className="author__name">{blogData.author}</p>
              <p className="author__date">{blogData.date || new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="heroImage">
      <Image
        src={blogData.main_photo}
        alt={blogData.title || 'Featured blog'}
        width={900}
        height={600}
        priority
        unoptimized                 
        className="heroImage__img" 
      />
      </div>
      <div className="blogDetails__container">
        {/* LEFT SIDEBAR */}
        <aside className="blogDetails__sidebar">
          {/* <h3 className="sidebar__title">Table of Contents</h3> */}
          {/* <ul className="sidebar__list">
            {blogData.tableOfContents?.map((item, idx) => (
              <li key={idx}>{item}</li>
            )) || (
              <>
                <li>Introduction</li>
                <li>Main Content</li>
                <li>Conclusion</li>
                <li>FAQ</li>
              </>
            )}
          </ul> */}
        
          <div className="sidebar__share">
            <p>Share</p>
            <div className="share__icons">
              <CopyToClipboard text={window.location.href}>
                <button 
                  onClick={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 5000);
                  }}
                  className={`copy-link-btn ${copied ? 'copied' : ''}`}
                >
                  <Image
                    src="/images/icons/boxs.svg"
                    alt="Copy"
                    width={18}
                    height={18}
                    className="copy-link-icon"
                  />
                  <span>{copied ? 'Copied!' : 'Copy link'}</span>
                </button>
              </CopyToClipboard>
              <button className="share-btn">
                <Link
                  target='_blank'
                  href='https://youtube.com/@hipaachecker-y9e?si=I-_8jOFYkAWN2O5K'
                >
                  <Image
                    src="/images/icons/xicon.svg"
                    alt="Twitter"
                    width={18}
                    height={18}
                  />
                </Link>
              </button>
              <Link
                target="_blank"
                href="https://www.facebook.com/HipaaChecker"
                className="share-btn"
              >
                <Image
                  src="/images/icons/fb.svg"
                  alt="Facebook"
                  width={18}
                  height={18}
                />
              </Link>
              <Link
                target="_blank"
                href="https://www.linkedin.com/company/106729801"
                className="share-btn"
              >
                <Image
                  src="/images/icons/linkedinicon.svg"
                  alt="LinkedIn"
                  width={18}
                  height={18}
                />
              </Link>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="blogDetails__content">
          {/* If the API returns HTML content */}
          {blogData.body && (
            <BlogSuggestionParser html={blogData.body} platform="apk" />
          )}

          {/* If the API returns structured content like subrules */}
          {blogData.subrules?.map((sub, idx) =>
            sub.suggestion?.map((sugg, i) => (
              <div key={`${idx}-${i}`} className="content-block">
                {sugg.expectation && (
                  <h3 dangerouslySetInnerHTML={{ __html: sugg.expectation }} />
                )}
                {sugg.snippet && (
                  <div className="suggested-fix__block">
                    <BlogSuggestionParser html={sugg.snippet} platform="apk" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Fallback if no structured content */}
          {!blogData.body && !blogData.subrules && (
            <div>
              <p>{blogData.desc || 'No content available.'}</p>
            </div>
          )}
        </main>
      </div>

      <StartFree />
      <Footer />
    </>
  );
}