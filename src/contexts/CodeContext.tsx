import React, { createContext, useState, useContext } from "react";

export type HookType =
  | "useState"
  | "useEffect"
  | "useContext"
  | "useReducer"
  | "useRef"
  | "useMemoCallback"
  | "useTransition"
  | "customHook";
export type FileType = "jsx" | "css";

interface CodeState {
  [key: string]: {
    jsx: string;
    css: string;
  };
}

interface CodeContextType {
  code: CodeState;
  activeHook: HookType;
  activeFile: FileType;
  setActiveHook: (hook: HookType) => void;
  setActiveFile: (file: FileType) => void;
  updateCode: (hook: HookType, file: FileType, newCode: string) => void;
  resetToBoilerplate: () => void;
}

const boilerplateTemplates: CodeState = {
  useState: {
    jsx: `import { useState } from 'react';
import './useState.css';

const Example = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <button 
      className="useStateButton"
      onClick={handleClick}
    >
      Clicked {count} times
    </button>
  );
};

export default Example;`,
    css: `.useStateButton {
  background-color: #007bff;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}`,
  },
  useEffect: {
    jsx: `import { useState, useEffect } from 'react';
import './useEffect.css';

const Example = () => {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState('white');

  const handleClick = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A6'];
    setBgColor(colors[count % colors.length]);
  }, [count]);

  return (
    <button
      className="useEffectButton"
      style={{ backgroundColor: bgColor }}
      onClick={handleClick}
    >
      Clicked {count} times
    </button>
  );

}

export default Example;`,
    css: `.useEffectButton {
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.useEffectButton:hover {
  transform: scale(1.05);
}`,
  },
  useContext: {
    jsx: `import { useContext } from 'react';
import './useContext.css';

// Create your context here

const Example = () => {
  // Use your context here
  
  return (
    <div className="useContextContainer">
      {/* Add your code here */}
    </div>
  );
}

export default Example;`,
    css: `.useContextContainer {
  padding: 20px;
  border-radius: 8px;
  background-color: #e9ecef;
  color: #333;
}`,
  },
  useReducer: {
    jsx: `import { useReducer } from 'react';
import './useReducer.css';

// Define your reducer and initial state here

const Example = () => {
  // Use your reducer here
  
  return (
    <div className="useReducerContainer">
      {/* Add your code here */}
    </div>
  );
}

export default Example;`,
    css: `.useReducerContainer {
  padding: 20px;
  border-radius: 8px;
  background-color: #dee2e6;
  color: #333;
}`,
  },
  useRef: {
    jsx: `import { useRef } from 'react';
import './useRef.css';

const Example = () => {
  // Add your ref here
  
  return (
    <div className="useRefContainer">
      {/* Add your code here */}
    </div>
  );
}

export default Example;`,
    css: `.useRefContainer {
  padding: 20px;
  border-radius: 8px;
  background-color: #ced4da;
  color: #333;
}`,
  },
  useMemoCallback: {
    jsx: `import { useState, useMemo, useCallback } from 'react';
import './useMemoCallback.css';

const Example = () => {
  // Add your state here
  
  // Add your memoized value or callback here
  
  return (
    <div className="useMemoContainer">
      {/* Add your code here */}
    </div>
  );
}

export default Example;`,
    css: `.useMemoContainer {
  padding: 20px;
  border-radius: 8px;
  background-color: #adb5bd;
  color: #333;
}`,
  },
  useTransition: {
    jsx: `import { useState, useTransition, useDeferredValue } from 'react';
import './useTransition.css';

const Example = () => {
  // Add your state here
  
  // Add your transition or deferred value here
  
  return (
    <div className="useTransitionContainer">
      {/* Add your code here */}
    </div>
  );
}

export default Example;`,
    css: `.useTransitionContainer {
  padding: 20px;
  border-radius: 8px;
  background-color: #6c757d;
  color: white;
}`,
  },
  customHook: {
    jsx: `import { useState } from 'react';
import './customHook.css';

// Create your custom hook here
function useCustomHook() {
  // Add your hook logic here
}

const Example = () => {
  // Use your custom hook here
  
  return (
    <div className="customHookContainer">
      {/* Add your code here */}
    </div>
  );
}

export default Example;`,
    css: `.customHookContainer {
  padding: 20px;
  border-radius: 8px;
  background-color: #495057;
  color: white;
}`,
  },
};

const defaultCode: CodeState = {
  useState: {
    jsx: `import { useState } from 'react';
import './useState.css';

const Example = () => {
  const [count, setCount] = useState(0);

  return (
    <button 
      className="useStateButton"
      onClick={() => setCount(count + 1)}
    >
      Clicked {count} times
    </button>)
}

export default Example;`,
    css: `.useStateButton {
  background-color: #007bff;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.useStateButton:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.useStateButton:active {
  background-color: #003f80;
  transform: scale(0.98);
}`,
  },
  useEffect: {
    jsx: `import { useState, useEffect } from 'react';
import './useEffect.css';

const Example = () => {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState('white');

  const handleClick = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A6'];
    setBgColor(colors[count % colors.length]);
  }, [count]);

  return (
    <button
      className="useEffectButton"
      style={{ backgroundColor: bgColor }}
      onClick={handleClick}
    >
      Clicked {count} times
    </button>
  );

}

export default Example;`,
    css: `.useEffectButton {
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.useEffectButton:hover {
  transform: scale(1.05);
}`,
  },
  useContext: {
    jsx: `/* Add your code here */`,
    css: ``,
  },
  useReducer: {
    jsx: `/* Add your code here */`,
    css: ``,
  },
  useRef: {
    jsx: `/* Add your code here */`,
    css: ``,
  },
  useMemoCallback: {
    jsx: `/* Add your code here */`,
    css: ``,
  },
  useTransition: {
    jsx: `/* Add your code here */`,
    css: ``,
  },
  customHook: {
    jsx: `/* Add your code here */`,
    css: ``,
  },
};

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [code, setCode] = useState<CodeState>(defaultCode);
  const [activeHook, setActiveHook] = useState<HookType>("useState");
  const [activeFile, setActiveFile] = useState<FileType>("jsx");

  const updateCode = (hook: HookType, file: FileType, newCode: string) => {
    setCode((prevCode) => ({
      ...prevCode,
      [hook]: {
        ...prevCode[hook],
        [file]: newCode,
      },
    }));
  };

  const resetToBoilerplate = () => {
    setCode((prevCode) => ({
      ...prevCode,
      [activeHook]: {
        ...boilerplateTemplates[activeHook],
      },
    }));
  };

  return (
    <CodeContext.Provider
      value={{
        code,
        activeHook,
        activeFile,
        setActiveHook,
        setActiveFile,
        updateCode,
        resetToBoilerplate,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCodeContext = () => {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
};
