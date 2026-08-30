'use client';
import React from 'react';

import { isInt } from '@/utils/helper';

import Text from '../text';

import './index.scss';

const SegmentedBarChart = ({ segments, showRawCount = false, showPercentages = true }) => {
  // Calculate total percentage of visible segments (segments with percent > 0)
  const visibleSegments = segments?.filter(segment => segment.percent > 0) || [];
  const totalPercent = visibleSegments.reduce((sum, segment) => sum + segment.percent, 0);

  return (
    <div className='segmentedBarChart'>
      {segments?.length > 0 && segments.some((segment) => segment.percent > 0) ? (
        segments.map((segment, index) => {
          const { percent, color, rawCount, countTotal } = segment;

          const normalizedWidth = totalPercent > 0 ? (percent / totalPercent) * 100 : 0;
          const minWidth = 10;
          const adjustedWidth = Math.max(normalizedWidth, minWidth);

          return (
            <React.Fragment key={index}>
              {percent > 0 ? (
                <div
                  className={`segmentedBarChart__segment segmentedBarChart--${color}`}
                  style={{ width: `${adjustedWidth}%` }}
                >
                  <div
                    className={`segmentedBarChart__percentage ${showRawCount ? 'segmentedBarChart__percentage--fraction' : ''}`}
                  >
                    {showRawCount
                      ? `${rawCount} / ${countTotal}` // Show count in "high / total" format
                      : showPercentages && (isInt(percent) ? percent : percent.toFixed(1)) + '%'}
                  </div>
                </div>
              ) : null}
            </React.Fragment>
          );
        })
      ) : (
        <div
          className='segmentedBarChart__segment segmentedBarChart__no-data'
          style={{ width: '200px', display: 'block', margin: '0 auto' }}
        >
          <Text
            color='white'
            size='fs-14'
            align='center'
            weight='medium'
          >
            No Vulnerabilities Found
          </Text>
        </div>
      )}
    </div>
  );
};

export default SegmentedBarChart;
