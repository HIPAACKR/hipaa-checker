export default function selectedOptionReducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        selectedOption: action.payload.selectedOption,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filterStatus: action.payload.filterStatus,
      };
    case 'SET_LINENUMBER':
      return {
        ...state,
        lineNumber: action.payload.lineNumber,
      };

    case 'SET_PAGINATION':
      return {
        ...state,
        currentPage: action.payload.currentPage,
        startPage: action.payload.startPage,
      };

    case 'SET_VULNERABILITY_STATUS':
      return {
        ...state,
        vulnerabilityStatusForFile:
          action.payload.vulnerabilityStatusForFile ?? state.vulnerabilityStatusForFile,
        vulnerabilityStatusForRule:
          action.payload.vulnerabilityStatusForRule ?? state.vulnerabilityStatusForRule,
        ruleWise: {
          ...state.ruleWise,
          subTitle: action.payload.ruleWise?.subTitle ?? state.ruleWise.subTitle,
          ruleTitle: action.payload.ruleWise?.ruleTitle ?? state.ruleWise.ruleTitle,
        },
        fileWise: {
          ...state.fileWise,
          subTitle: action.payload.fileWise?.subTitle ?? state.fileWise.subTitle,
          ruleTitle: action.payload.fileWise?.ruleTitle ?? state.fileWise.ruleTitle,
        },
      };
    default:
      return state;
  }
}
