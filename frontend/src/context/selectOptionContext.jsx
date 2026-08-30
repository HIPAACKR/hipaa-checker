'use client';

import { createContext, useContext, useReducer } from 'react';

import SelectOptionReducer from '../reducer/selectOptionReducer';

const initialState = {
  selectedOption: 'SUMMARIZE',
  filterStatus: 'All',
  vulnerabilityStatusForFile: 'All',
  vulnerabilityStatusForRule: 'High',
  ruleWise: {
    subTitle: [],
    ruleTitle: '',
  },
  fileWise: {
    subTitle: [],
    ruleTitle: '',
  },
  lineNumber: [],
  currentPage: 1,
  startPage: 1,
};

const SelectedOptionContext = createContext(null);

export default function SelectOptionProvider({ children }) {
  const [state, dispatch] = useReducer(SelectOptionReducer, initialState);
  return (
    <SelectedOptionContext.Provider value={{ state, dispatch }}>
      {children}
    </SelectedOptionContext.Provider>
  );
}

export const useSelectedOption = () => useContext(SelectedOptionContext);
