import React from 'react';

export type LoadingStates = {
    pageLoad: boolean;
    formSubmit: boolean;
    dataFetch: boolean;
    filterApply: boolean;
    actionProcess: boolean;
    [key: string]: boolean;
};

export type LoadingAction =
    | { type: 'SET_LOADING'; key: keyof LoadingStates; value: boolean }
    | { type: 'SET_MULTIPLE_LOADING'; states: Partial<LoadingStates> }
    | { type: 'RESET_LOADING' };

export const initialLoadingState: LoadingStates = {
    pageLoad: false,
    formSubmit: false,
    dataFetch: false,
    filterApply: false,
    actionProcess: false,
};

export function loadingReducer(state: LoadingStates, action: LoadingAction): LoadingStates {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, [action.key]: action.value };
        case 'SET_MULTIPLE_LOADING':
            return { ...state, ...action.states };
        case 'RESET_LOADING':
            return initialLoadingState;
        default:
            return state;
    }
}

// Custom hook for loading states
export function useLoadingStates(initialState: Partial<LoadingStates> = {}) {
    const [loadingStates, dispatch] = React.useReducer(
        loadingReducer,
        { ...initialLoadingState, ...initialState }
    );

    const setLoading = React.useCallback((key: keyof LoadingStates, value: boolean) => {
        dispatch({ type: 'SET_LOADING', key, value });
    }, []);

    const setMultipleLoading = React.useCallback((states: Partial<LoadingStates>) => {
        dispatch({ type: 'SET_MULTIPLE_LOADING', states });
    }, []);

    const resetLoading = React.useCallback(() => {
        dispatch({ type: 'RESET_LOADING' });
    }, []);

    return {
        loadingStates,
        setLoading,
        setMultipleLoading,
        resetLoading,
        isAnyLoading: Object.values(loadingStates).some(Boolean),
    };
}
