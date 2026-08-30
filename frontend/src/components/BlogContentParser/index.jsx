'use client';
import React from 'react';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import rehypeParse from 'rehype-parse';
import { unified } from 'unified';

import './index.scss';

const QuoteParse = ({ children }) => (
  <blockquote>
    {children}
  </blockquote>
);

const BlogSuggestionParser = ({ html }) => {
  const components = {
    a: (props) => (
      <a {...props} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    ),

    table: (props) => (
      <div className="table-wrapper">
        <table {...props} />
      </div>
    ),
    thead: (props) => <thead {...props} />,
    tbody: (props) => <tbody {...props} />,
    tr:    (props) => <tr {...props} />,
    th:    (props) => <th {...props} />,
    td:    (props) => <td {...props} />,

    blockquote: (props) => <QuoteParse {...props} />,

    p: (props) => {
      const content = props.children;

      const isEmpty =
        !content ||
        content === '\u00A0' ||
        (typeof content === 'string' &&
          content.replace(/\u00A0/g, '').trim() === '');

      if (isEmpty) return null;

      if (React.isValidElement(content)) {
        const className = content.props?.className || '';

        if (className.includes('text-huge')) {
          return <h1>{content.props.children}</h1>;
        }
        if (className.includes('text-big')) {
          return <h2>{content.props.children}</h2>;
        }
        if (className.includes('text-default')) {
          return <h3>{content.props.children}</h3>;
        }
        if (className.includes('text-small')) {
          return <h4>{content.props.children}</h4>;
        }
        if (className.includes('text-tiny')) {
          return <h5>{content.props.children}</h5>;
        }
      }

      return <p>{content}</p>;
    },
  };

  const tree = unified()
    .use(rehypeParse, { fragment: true })
    .parse(html);

  const jsxContent = toJsxRuntime(tree, { Fragment, jsx, jsxs, components });

  return (
    <div className="blog-suggestion-parser w-full m-0">
      {jsxContent}
    </div>
  );
};

export default BlogSuggestionParser;