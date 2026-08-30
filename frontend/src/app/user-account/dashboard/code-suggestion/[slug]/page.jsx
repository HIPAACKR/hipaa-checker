'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CodeSuggestionParser from '@/components/code-suggestion-parser/codeSuggestionParser';
import Text from '@/components/text';
import { get } from '@/utils/api-service';

const CodeSuggestion = ({ params }) => {
  const { slug } = params;
  const segment = slug.split('--');
  const rule = segment[0];
  const platform = segment[1];
  const applicationid = segment[2];
  const encodedRuleName = segment[3];
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subrules, setSubrules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get(
          `suggestions?platform=${platform}&rule=${rule}`,
          false,
          1,
        );
        setData(response?.data);
      } catch (err) {
        setError(err.message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug, API_BASE_URL, platform, rule]);

  useEffect(() => {
    setSubrules(Array.isArray(data?.subrules) ? data.subrules : []);
  }, [data?.subrules]);

  

  const transformLinks = (html) => {
    if (!html) return '';
    return html.replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" class="text-[#0077FF] font-semibold underline hover:text-blue-800" '
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !Array.isArray(data.subrules) || data.subrules.length === 0) {
    return <p>No subrules available for this rule.</p>;
  }

  return (
    <div className='p-0'>
      <div className="flex items-center gap-4 mb-5">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.back()}
        >
          <Image
            src="/images/icons/circle-left-arrow.svg"
            width={20}
            height={20}
            alt="Back arrow"
          />
          <Text color="neutral-800" size="fs-14" weight="semi-bold">
            Back
          </Text>
        </div>
        <div className="flex items-center gap-1">

          <div
            className="cursor-pointer"
            onClick={() => router.push('/user-account/dashboard')}
          >
            <Text color="neutral-400" size="fs-14" weight="medium">
              Dashboard
            </Text>
          </div>
          <Text color="neutral-400" size="fs-14" weight="medium">
          /
          </Text>

          <div
            className="cursor-pointer"
            onClick={() =>
              router.push(`/user-account/dashboard/report-list/analysis-report/${applicationid}`)
            }
          >
            <Text color="neutral-400" size="fs-14" weight="medium">
              Analysis Report
            </Text>
          </div>
          <Text color="neutral-400" size="fs-14" weight="medium">
          /
          </Text>
          <div className="cursor-pointer">
            <Text color="neutral-600" size="fs-14" weight="medium">
              HIPAA Rules: Code Suggestion
            </Text>
          </div>
        </div>
      </div>

      <h1>
        <span className="text-2xl font-semibold text-[#1C2939] mb-4 block">
          HIPAA Rules: Code Suggestion
        </span>
      </h1>

      <section>
        {subrules
          .filter((sub) => sub.subrule === 'All')
          .map((sub, idx) => (
            <div key={idx} className="bg-white p-5 my-4 border rounded-lg shadow-sm">
              {sub.suggestion?.map((sugg, i) => (
                <div key={i} className="mb-6">
                  <h4 className="text-xl font-semibold text-[#1C2939] mb-2">
                    {encodedRuleName ? `${decodeURIComponent(encodedRuleName)}` : ''}
                  </h4>

                  <h3
                    className="my-2 mb-5 border-b"
                    style={{ borderColor: 'rgba(0, 0, 0, 0.18)' }}
                    dangerouslySetInnerHTML={{ __html: transformLinks(data.expectation) }}
                  ></h3>

                  <span className="text-l font-semibold text-[#1C2939]">
                    Recommended Code Suggestion:
                  </span>

                  <div className="suggested-fix__block border border-[#F1F4F7] p-5 mt-4 rounded-lg bg-[#F9FAFB]">
                    <CodeSuggestionParser
                     html={sugg.snippet} 
                     platform={platform} 
                     />
                  </div>
                </div>
              ))}
            </div>
          ))}
      </section>
    </div>
  );
};

export default CodeSuggestion;
