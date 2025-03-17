import React from 'react';
import { HookType, useCodeContext } from '../contexts/CodeContext';

const TabNavigation: React.FC = () => {
  const { activeHook, setActiveHook } = useCodeContext();

  const tabs: { id: HookType; label: string; mobileLabel: string }[] = [
    { id: 'useState', label: 'useState', mobileLabel: 'useState' },
    { id: 'useEffect', label: 'useEffect', mobileLabel: 'useEffect' },
    { id: 'useContext', label: 'useContext', mobileLabel: 'useContext' },
    { id: 'useReducer', label: 'useReducer', mobileLabel: 'useReducer' },
    { id: 'useRef', label: 'useRef', mobileLabel: 'useRef' },
    { id: 'useMemoCallback', label: 'useMemo & useCallback', mobileLabel: 'useMemo' },
    { id: 'useTransition', label: 'useTransition & useDeferredValue', mobileLabel: 'useTrans.' },
    { id: 'customHook', label: 'Custom Hook', mobileLabel: 'Custom' },
  ];

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 relative ${
              activeHook === tab.id
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
            }`}
            onClick={() => setActiveHook(tab.id)}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.mobileLabel}</span>
            {activeHook === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation; 