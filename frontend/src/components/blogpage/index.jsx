'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { get } from '@/utils/api-service';

import './index.scss';

const Blog_Page = () => {
  const [activeCategory, setActiveCategory] = useState('View All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]); // Store all blogs for filtering
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const BLOGS_PER_PAGE = 5; // Adjust based on your API's page size

  // Fetch ALL categories from API (not paginated)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get(
          'blogs/categories',
          true,   
          false,
          1
        );

        const categoriesArray = data?.data?.category || [];
        const validCategories = categoriesArray.filter(
          (cat) => cat && cat.trim() !== ''
        );

        setCategories(validCategories);
      } catch (error) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch ALL blogs from all pages
  useEffect(() => {
    const fetchAllBlogs = async () => {
      setIsLoading(true);
      try {
        // First, get the first page to know total pages
        const firstPageData = await get('blogs?page=1', true, false, 1);
        const totalPagesCount = firstPageData?.data?.total_pages || 1;
        
        // Fetch all pages concurrently
        const pagePromises = [];
        for (let page = 1; page <= totalPagesCount; page++) {
          pagePromises.push(get(`blogs?page=${page}`, true, false, 1));
        }
        
        const allPagesData = await Promise.all(pagePromises);
        
        // Combine all blogs from all pages
        const allBlogsArray = allPagesData.flatMap(data => data?.data?.blogs || []);
        
        // Sort by most recent
        const sortedBlogs = allBlogsArray.sort((a, b) => {
          const dateA = new Date(a.modified_at || a.created_at);
          const dateB = new Date(b.modified_at || b.created_at);
          return dateB - dateA;
        });
        
        setAllBlogs(sortedBlogs);
        setIsLoading(false);
      } catch (error) {
        setError(
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load blogs'
        );
        setIsLoading(false);
      }
    };

    fetchAllBlogs();
  }, []);

  // Filter and paginate blogs based on active category
  useEffect(() => {
    if (allBlogs.length === 0) return;

    // Filter by category
    const filtered = activeCategory === 'View All'
      ? allBlogs
      : allBlogs.filter((blog) => blog.category === activeCategory);

    // Calculate total pages for filtered results
    const total = Math.ceil(filtered.length / BLOGS_PER_PAGE);
    setTotalPages(total);

    // Get blogs for current page
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;
    const paginatedBlogs = filtered.slice(startIndex, endIndex);

    setBlogs(paginatedBlogs);
  }, [allBlogs, activeCategory, currentPage]);

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


  const featuredBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); 
    setIsCategoryOpen(true);
  };

  const handleViewAllClick = () => {
    setIsCategoryOpen(!isCategoryOpen);
    setActiveCategory('View All');
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Search functionality 
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
    
    // Search across ALL blogs, not just current page
    const results = allBlogs
      .filter(blog => {
        const titleMatch = (blog.title || '').toLowerCase().includes(lowerQuery);
        const cleanDescription = stripHtml(blog.description || '');
        const descMatch = cleanDescription.toLowerCase().includes(lowerQuery);
        const categoryMatch = (blog.category || '').toLowerCase().includes(lowerQuery);
        const authorMatch = (blog.author || '').toLowerCase().includes(lowerQuery);
        
        return titleMatch || descMatch || categoryMatch || authorMatch;
      })
      .map(blog => {
        const cleanDescription = stripHtml(blog.description || '');
        const searchText = cleanDescription || blog.title || '';
        const lowerText = searchText.toLowerCase();
        const matchIndex = lowerText.indexOf(lowerQuery);
        
        let snippet = '';
        if (matchIndex !== -1) {
          const start = Math.max(0, matchIndex - 30);
          const end = Math.min(searchText.length, matchIndex + lowerQuery.length + 30);
          snippet = (start > 0 ? '...' : '') + 
                    searchText.slice(start, end) + 
                    (end < searchText.length ? '...' : '');
        } else {
          snippet = cleanDescription.slice(0, 80) + (cleanDescription.length > 80 ? '...' : '');
        }
        
        return { ...blog, snippet };
      });
    
    setSearchResults(results);
    setShowSearchDropdown(results.length > 0);
  };

  const handleSearchResultClick = () => {
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="blogPage">
        <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blogPage">
        <div className="error-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <p>Error loading blogs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blogPage">
      <div className="blogPage__layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
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
                  {searchResults.map((result) => (
                    <Link
                      href={`/blog/${result.id}`}
                      key={result.id}
                      className="search-dropdown-item"
                      onClick={handleSearchResultClick}
                    >
                      <div className="search-result-platform">{result.category || 'Blog'}</div>
                      <div className="search-result-title">{result.title}</div>
                      {result.snippet && (
                        <div className="search-result-snippet">{result.snippet}</div>
                      )}
                      <div className="search-result-author">By {result.author}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <p className="sidebar-title">Blog categories</p>

            <div className="category-list">
              <div
                className={`category-item ${activeCategory === 'View All' ? 'active' : ''}`}
                onClick={handleViewAllClick}
              >
                <span>View all</span>
                <Image
                  src="/images/icons/chevron-down.svg"
                  alt="dropdown icon"
                  width={20}
                  height={20}
                  className={`dropdown-icon ${isCategoryOpen ? 'open' : ''}`}
                />
              </div>

              <div className={`subcategory-list ${isCategoryOpen ? 'open' : ''}`}>
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className={`subcategory-item ${
                      activeCategory === cat ? 'active' : ''
                    }`}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="content-container">
          {/* Featured Blog */}
          {featuredBlog && (
            <Link href={`/blog/${featuredBlog.id}`} className="featured-blog">
              <div className="featured-blog__image">
               <Image
                src={featuredBlog.main_photo}
                alt={featuredBlog.title || 'Featured blog'}
                width={880}
                height={300}
                priority
                unoptimized
              />
              </div>
              <div className="featured-blog__content">
                <div className="featured-blog__topMeta">
                  <span className="featured-blog__category">
                    {featuredBlog.category || 'Uncategorized'}
                  </span>
                  <span className="featured-blog__time">
                    {featuredBlog.read_time ? `${featuredBlog.read_time} min read` : ''}
                  </span>
                </div>
                <h2 className="featured-blog__title">{featuredBlog.title}</h2>
                {featuredBlog.description && (
                  <p className="featured-blog__desc">
                    {featuredBlog.description}
                  </p>
                )}
                <div className="featured-blog__author">
                  <Image
                    src="/images/icons/profile.svg"
                    alt={featuredBlog.name || 'Author'}
                    width={36}
                    height={36}
                    className="featured-blog__author-img"
                  />
                  <div className="featured-blog__author-details">
                    <p className="featured-blog__author-name">
                      {featuredBlog.author}
                    </p>
                    <p className="featured-blog__author-date">
                      {formatDate(featuredBlog.modified_at || featuredBlog.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

         {/* Blog Grid */}
        <div className="blog-grid">
          {otherBlogs.length > 0 ? (
            otherBlogs.map((blog) => (
              <Link href={`/blog/${blog.id}`} key={blog.id} className="blog-card">
                <div className="blog-card__image">
                <Image
                  src={blog.main_photo}
                  alt={blog.title || 'Blog post'}
                  width={400}
                  height={220}
                  unoptimized
                />
                </div>
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    <span className="meta-category">
                      {blog.category || 'Uncategorized'}
                    </span>
                    <span className="meta-time">
                      {blog.read_time ? `${blog.read_time} min read` : ''}
                    </span>
                  </div>
                  <h3 className="blog-card__title">{blog.title}</h3>
                  <p className="blog-card__desc">{blog.description}</p>

                  <div className="blog-card__author">
                    <div className="author-info">
                      <Image
                        src="/images/icons/profile.svg"
                        alt={blog.name || 'Author'}
                        width={40}
                        height={40}
                        className="author-img"
                      />
                      <div className="author-details">
                        <p className="author-name">{blog.author}</p>
                        <p className="author-date">
                          {formatDate(blog.modified_at || blog.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            !featuredBlog && <p>No blogs found in this category.</p>
          )}
        </div>          
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination__nav"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <Image
                  src="/images/icons/chevron-left.svg"
                  alt="previous"
                  width={20}
                  height={20}
                />
                Previous
              </button>

              <div className="pagination__numbers">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className={`pagination__number ${page === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                className="pagination__nav"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
                <Image
                  src="/images/icons/chevron-right.svg"
                  alt="next"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog_Page;