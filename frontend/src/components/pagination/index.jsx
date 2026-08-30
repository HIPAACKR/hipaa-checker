'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useSelectedOption } from '@/context/selectOptionContext';

import Text from '../text';

import './index.scss';

const Pagination = ({
  setOne,
  totalEntries,
  totalPages,
  setCurrentPageNumber,
  itemsPerPage = 5,
}) => {
  const { state, dispatch } = useSelectedOption();
  const [pageStart, setPageStart] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const paginationButtons = [];
  for (let i = pageStart; i < pageStart + 5; i++) {
    if (i <= totalPages) {
      paginationButtons.push(
        <Link
          href={''}
          key={i}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(i);
          }}
          className={`pagination__button ${parseInt(currentPage) == i ? 'pagination__button--active' : ''}`}
        >
          {i}
        </Link>,
      );
    }
  }
  useEffect(() => {
    setCurrentPageNumber(currentPage);
  }, [currentPage, setCurrentPageNumber, totalEntries, totalPages]);
  useEffect(() => {
    if (setOne != undefined) {
      setCurrentPage(1);
      setPageStart(1);
    }
  }, [setOne]);

  useEffect(() => {
    setPageStart(parseInt(state.startPage));
    setCurrentPage(state.currentPage);
  }, [state.startPage, state.currentPage]);

  return (
    <div className='pagination'>
      <Text
        size='fs-14'
        color='neutral-700'
        weight='medium'
      >
        {(currentPage - 1) * itemsPerPage + 1} to{' '}
        {Math.min((currentPage - 1) * itemsPerPage + itemsPerPage, totalEntries)} of{' '}
        {totalEntries ? totalEntries : 0} records
      </Text>
      <div className='pagination__buttons'>
        <Link
          className='pagination__previous-button'
          href={''}
          onClick={(e) => {
            e.preventDefault();
            setPageStart(Math.max(1, pageStart - 5));
            setCurrentPage(Math.max(1, pageStart - 1));
          }}
        ></Link>
        {paginationButtons}
        <button
          disabled={currentPage >= totalPages || pageStart + 5 > totalPages}
          className='pagination__next-button'
          href={''}
          onClick={(e) => {
            e.preventDefault();
            setPageStart(pageStart + 5);
            setCurrentPage(pageStart + 5);
          }}
        ></button>
      </div>
    </div>
  );
};

export default Pagination;
