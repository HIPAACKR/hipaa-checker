import React, { useState } from 'react';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import rehypeParse from 'rehype-parse';
import rehypeRaw from 'rehype-raw';
import { unified } from 'unified';

import { platformsMap } from '@/data/platform_mappings';

const extractText = (children) => {
    if(typeof children === 'string') return children;
    if(Array.isArray(children)) return children.map(extractText).join('');
    if(React.isValidElement(children)) return extractText(children.props.children);

    return '';
}

const CopyableCodeBlock = ({ children, platform }) => {
  let codeText = extractText(children);
  const [copied, setCopied] = useState(false);

  return (
    <div className='relative max-w-full mx-auto mt-2'>
      <div className='bg-[#F9FAFB]  border border-[#F1F4F7] rounded-lg'>
        <div className='bg-white p-5 rounded-lg shadow-sm'>
          <div className='flex justify-between items-center mb-5'>
            <span className='text-base font-medium text-[#1C2939]'>
              {platform}
            </span>
          <CopyToClipboard text={codeText}>
              <button
                onClick={() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className='bg-[#F9FAFB]  hover:bg-gray-700 text-base text-[#1C2939] hover:text-white px-2 py-2 rounded-md'
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </CopyToClipboard>
          </div>          
          <div className='overflow-x-auto rounded-lg'>
            <pre 
            id='code'
            className="text-sm font-normal text-[#0A0A0A] border border-[#F1F4F7] bg-[#F9FAFB] rounded-lg m-0 p-5"
            >
              <code className="block p-0 leading-relaxed whitespace-pre-wrap">{codeText}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const CodeSuggestionParser = ({ html, platform }) => {
  const components = {
    pre: (props) => (
      <CopyableCodeBlock
        {...props}
        platform={platformsMap[platform]}
      />
    ),

    a: (props) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0077FF] font-semibold underline hover:text-blue-800"
      >
        {props.children}
      </a>
    ),
  };

  const tree = unified().use(rehypeParse, { fragment: true }).use(rehypeRaw).parse(html);

  const jsxContent = toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components,
  });

  return <div className='prose prose-slate max-w-none'>{jsxContent}</div>;
};

export default CodeSuggestionParser;
