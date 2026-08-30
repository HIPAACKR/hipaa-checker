import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * MarkdownRenderer Component
 * Renders markdown content with custom component styling
 * Uses react-markdown for parsing and remark-gfm for GitHub Flavored Markdown support
 */
const MarkdownRenderer = ({ content }) => {
  const components = {
    // Custom anchor tags - open in new tab
    a: ({ node, children, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0077FF] font-semibold underline hover:text-blue-800"
      >
        {children}
      </a>
    ),

    // Custom code blocks with better styling
    pre: ({ node, children, ...props }) => (
      <pre
        {...props}
        className="bg-[#F9FAFB] border border-[#F1F4F7] rounded-lg p-3 overflow-x-auto my-2"
      >
        {children}
      </pre>
    ),

    // Inline code styling
    code: ({ node, inline, children, ...props }) => {
      return inline ? (
        <code
          {...props}
          className="bg-[#F9FAFB] border border-[#F1F4F7] rounded px-1.5 py-0.5 text-sm font-mono text-[#0A0A0A]"
        >
          {children}
        </code>
      ) : (
        <code
          {...props}
          className="block text-sm font-normal text-[#0A0A0A] whitespace-pre-wrap"
        >
          {children}
        </code>
      );
    },

    // Lists
    ul: ({ node, children, ...props }) => (
      <ul {...props} className="list-disc list-inside my-2 space-y-1 ml-4">
        {children}
      </ul>
    ),

    ol: ({ node, children, ...props }) => (
      <ol {...props} className="list-decimal list-inside my-2 space-y-1 ml-4">
        {children}
      </ol>
    ),

    li: ({ node, children, ...props }) => (
      <li {...props} className="text-[#0A0A0A] leading-relaxed">
        {children}
      </li>
    ),

    // Headings
    h1: ({ node, children, ...props }) => (
      <h1 {...props} className="text-xl font-bold my-3 text-[#1C2939]">
        {children}
      </h1>
    ),

    h2: ({ node, children, ...props }) => (
      <h2 {...props} className="text-lg font-bold my-2 text-[#1C2939]">
        {children}
      </h2>
    ),

    h3: ({ node, children, ...props }) => (
      <h3 {...props} className="text-base font-semibold my-2 text-[#1C2939]">
        {children}
      </h3>
    ),

    // Paragraphs
    p: ({ node, children, ...props }) => (
      <p {...props} className="my-2 text-[#0A0A0A] leading-relaxed">
        {children}
      </p>
    ),

    // Blockquotes
    blockquote: ({ node, children, ...props }) => (
      <blockquote
        {...props}
        className="border-l-4 border-[#0077FF] pl-4 my-2 italic text-gray-700"
      >
        {children}
      </blockquote>
    ),

    // Strong/Bold
    strong: ({ node, children, ...props }) => (
      <strong {...props} className="font-semibold text-[#1C2939]">
        {children}
      </strong>
    ),

    // Emphasis/Italic
    em: ({ node, children, ...props }) => (
      <em {...props} className="italic">
        {children}
      </em>
    ),

    // Horizontal rule
    hr: ({ node, ...props }) => (
      <hr {...props} className="my-4 border-t border-[#F1F4F7]" />
    ),

    // Tables (GitHub Flavored Markdown)
    table: ({ node, children, ...props }) => (
      <div className="overflow-x-auto my-2">
        <table
          {...props}
          className="min-w-full border border-[#F1F4F7] rounded-lg"
        >
          {children}
        </table>
      </div>
    ),

    thead: ({ node, children, ...props }) => (
      <thead {...props} className="bg-[#F9FAFB]">
        {children}
      </thead>
    ),

    th: ({ node, children, ...props }) => (
      <th
        {...props}
        className="px-4 py-2 text-left font-semibold text-[#1C2939] border-b border-[#F1F4F7]"
      >
        {children}
      </th>
    ),

    td: ({ node, children, ...props }) => (
      <td
        {...props}
        className="px-4 py-2 text-[#0A0A0A] border-b border-[#F1F4F7]"
      >
        {children}
      </td>
    ),
  };

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

