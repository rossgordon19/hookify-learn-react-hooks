import React, { createContext, useState, useContext, useEffect } from "react";

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
    jsx: `import { createContext, useContext, useState } from 'react';
import './useContext.css';

// 1️⃣ Create the Context
const ThemeContext = createContext({ 
  theme: 'light', 
  toggleTheme: () => {} 
});

const ThemeButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
    >
      Switch to {theme === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
};

const ThemedContent = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="content">
      <h2>Current Theme: {theme}</h2>
      <p>This content responds to the theme context.</p>
    </div>
  );
};

const Example = () => {
  // 3️⃣ Consume the Context
  const { theme } = useContext(ThemeContext);

  return (
    <div className={"themed-card " + theme}>
      <ThemedContent />
      <ThemeButton />
    </div>
  );
};

// 2️⃣ Provide the Context Value
const App = () => {
  const [theme, setTheme] = useState('dark');
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Example />
    </ThemeContext.Provider>
  );
};

export default App;`,
    css: `.themed-card {
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-align: center;
}

.light {
  background-color: #f8f9fa;
  color: #333;
}

.dark {
  background-color: #333;
  color: white;
}

.content {
  margin-bottom: 20px;
}

.content h2 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.theme-toggle {
  background-color: transparent;
  border: 2px solid currentColor;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.light .theme-toggle {
  color: #007bff;
}

.light .theme-toggle:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.dark .theme-toggle {
  color: #6ea8fe;
}

.dark .theme-toggle:hover {
  background-color: rgba(110, 168, 254, 0.1);
}`,
  },
  useReducer: {
    jsx: `import { useReducer } from 'react';
import './useReducer.css';

// 1️⃣ Define the reducer function
const reducer = (state) => {
  return state === 'ON' ? 'OFF' : 'ON';
};

const Example = () => {
  // 2️⃣ Initialize useReducer
  const [state, dispatch] = useReducer(reducer, 'OFF');

  // 3️⃣ Dispatch an action on button click
  const handleClick = () => {
    dispatch();
  };

  return (
    <button className="useReducerButton" onClick={handleClick}>
      {state}
    </button>
  );
};

export default Example;`,
    css: `.useReducerButton {
  background-color: #28a745;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.useReducerButton:hover {
  transform: scale(1.05);
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

const practiceTemplates: CodeState = {
  useState: {
    jsx: `import { useState } from 'react';
import './useState.css';

const Example = () => {
  // TODO: Create a state variable called "count" with initial value of 0
  // Hint: const [count, setCount] = useState(0);
  
  // TODO: Create a function that increments the count when called
  // Hint: Use the setCount function
  
  return (
    <button 
      className="useStateButton"
      // TODO: Add onClick handler to increment count
    >
      Clicked {/* TODO: Display count here */} times
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
  // TODO: Create a state variable for count
  // TODO: Create a state variable for background color
  
  // TODO: Create a function to increment count
  
  // TODO: Add useEffect hook that changes background color when count changes
  // Hint: useEffect(() => { ... }, [count]);
  
  return (
    <button
      className="useEffectButton"
      // TODO: Set background color style
      // TODO: Add onClick handler
    >
      Clicked {/* TODO: Display count */} times
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
}`,
  },
  useContext: {
    jsx: `import { useContext, createContext, useState } from 'react';
import './useContext.css';

// TODO: Create a context for theme
// Hint: const ThemeContext = createContext(null);

// Child component that will consume the context
const ThemedButton = () => {
  // TODO: Use the useContext hook to get the theme and toggle function
  // Hint: const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button 
      className="contextButton"
      // TODO: Apply dynamic styles based on theme
      // TODO: Add click handler to toggle theme
    >
      Toggle Theme (Current: {/* TODO: Show current theme */})
    </button>
  );
};

// Parent component that provides the context
const Example = () => {
  // TODO: Create state for theme ('light' or 'dark')
  // TODO: Create a toggle function
  
  return (
    // TODO: Wrap the child component with ThemeContext.Provider
    // and pass theme and toggleTheme as value
    <ThemedButton />
  );
};

export default Example;`,
    css: `.contextButton {
      font-size: 18px;
      font-weight: bold;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }`,
  },
  useReducer: {
    jsx: `import { useReducer } from 'react';
import './useReducer.css';

// TODO: Define action types
// Hint: const INCREMENT = 'INCREMENT', DECREMENT = 'DECREMENT', RESET = 'RESET';

// TODO: Create a reducer function
// Hint: function reducer(state, action) { switch(action.type) {...} }

const Example = () => {
  // TODO: Initialize useReducer with the reducer function and initial state
  // Hint: const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <div className="reducerContainer">
      <h2>{/* TODO: Display count from state */}</h2>
      <div className="buttonGroup">
        {/* TODO: Add buttons that dispatch different actions */}
        {/* Hint: <button onClick={() => dispatch({ type: INCREMENT })}>+</button> */}
      </div>
    </div>
  );
};

export default Example;`,
    css: `.reducerContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .buttonGroup {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .buttonGroup button {
      background-color: #007bff;
      color: white;
      font-size: 16px;
      font-weight: bold;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }`,
  },
  useRef: {
    jsx: `import { useRef, useState } from 'react';
import './useRef.css';

const Example = () => {
  // TODO: Create a ref for the input element
  // Hint: const inputRef = useRef(null);
  
  // TODO: Create state for messages
  
  // TODO: Create a function to handle focus and add messages
  
  return (
    <div className="refContainer">
      {/* TODO: Display messages */}
      
      {/* TODO: Create input and attach ref */}
      {/* Hint: <input ref={inputRef} /> */}
      
      {/* TODO: Add buttons to focus input and add messages */}
    </div>
  );
};

export default Example;`,
    css: `.refContainer {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    input {
      padding: 8px;
      border: 1px solid #ced4da;
      border-radius: 4px;
    }

    button {
      background-color: #007bff;
      color: white;
      font-size: 14px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }`,
  },
  useMemoCallback: {
    jsx: `import { useState, useMemo, useCallback } from 'react';
import './useMemoCallback.css';

// Expensive computation (simulate with delay)
const computeExpensiveValue = (num) => {
  console.log("Computing expensive value...");
  // Simulate expensive calculation
  for (let i = 0; i < 1000000; i++) {}
  return num * 2;
};

const ExpensiveChild = ({ onClick }) => {
  console.log("ExpensiveChild rendered");
  return (
    <button onClick={onClick} className="childButton">
      Child Button
    </button>
  );
};

const Example = () => {
  // TODO: Create state for count and another value
  
  // TODO: Use useMemo to memoize the expensive computation
  // Hint: const memoizedValue = useMemo(() => computeExpensiveValue(count), [count]);
  
  // TODO: Use useCallback to memoize the click handler for the child
  // Hint: const memoizedCallback = useCallback(() => { ... }, []);
  
  return (
    <div className="memoContainer">
      <div>
        {/* TODO: Display count and controls to change it */}
      </div>
      <div>
        {/* TODO: Display computed value */}
      </div>
      {/* TODO: Render the ExpensiveChild with memoized callback */}
    </div>
  );
};

export default Example;`,
    css: `.memoContainer {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .childButton {
      background-color: #6c757d;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }`,
  },
  useTransition: {
    jsx: `import { useState, useTransition, useDeferredValue } from 'react';
import './useTransition.css';

// Sample list of items to filter
const generateItems = () => {
  return Array.from({ length: 10000 }, (_, i) => \`Item \${i + 1}\`);
};

const Example = () => {
  const allItems = generateItems();
  
  // TODO: Create state for search query
  
  // TODO: Use useTransition to mark state updates as non-urgent
  // Hint: const [isPending, startTransition] = useTransition();
  
  // TODO: Use useDeferredValue for the search query to defer the filtering
  // Hint: const deferredQuery = useDeferredValue(query);
  
  // TODO: Create filtered items based on the search query
  
  return (
    <div className="transitionContainer">
      <div className="searchBox">
        {/* TODO: Create input for search query */}
        {/* TODO: Show loading indicator when isPending is true */}
      </div>
      
      <div className="resultsList">
        {/* TODO: Show filtered items or a message if none found */}
      </div>
    </div>
  );
};

export default Example;`,
    css: `.transitionContainer {
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-width: 500px;
      margin: 0 auto;
    }

    .searchBox {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .searchBox input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
    }

    .resultsList {
      height: 300px;
      overflow-y: auto;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 8px;
    }

    .resultsList div {
      padding: 4px 8px;
      border-bottom: 1px solid #f0f0f0;
    }`,
  },
  customHook: {
    jsx: `import { useState } from 'react';
import './customHook.css';

// TODO: Create a custom hook called useCounter
// Hint: function useCounter(initialValue = 0, step = 1) { ... }
// It should return count, increment, decrement, and reset

const Example = () => {
  // TODO: Use your custom hook
  // Hint: const { count, increment, decrement, reset } = useCounter(0, 2);
  
  return (
    <div className="customHookContainer">
      <h2>{/* TODO: Display count */}</h2>
      <div className="buttonGroup">
        {/* TODO: Add buttons for increment, decrement, and reset */}
      </div>
    </div>
  );
};

export default Example;`,
    css: `.customHookContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .buttonGroup {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .buttonGroup button {
      background-color: #007bff;
      color: white;
      font-size: 16px;
      font-weight: bold;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }`,
  }
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
    jsx: `import { createContext, useContext, useState } from 'react';
    import './useContext.css';

    // 1️⃣ Create the Context
    const ThemeContext = createContext({ 
      theme: 'light', 
      toggleTheme: () => {} 
    });

    const ThemeButton = () => {
      const { theme, toggleTheme } = useContext(ThemeContext);
      
      return (
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
        >
          Switch to {theme === 'dark' ? 'light' : 'dark'} mode
        </button>
      );
    };

    const ThemedContent = () => {
      const { theme } = useContext(ThemeContext);
      
      return (
        <div className="content">
          <h2>Current Theme: {theme}</h2>
          <p>This content responds to the theme context.</p>
        </div>
      );
    };

    const Example = () => {
      // 3️⃣ Consume the Context
      const { theme } = useContext(ThemeContext);

      return (
        <div className={"themed-card " + theme}>
          <ThemedContent />
          <ThemeButton />
        </div>
      );
    };

    // 2️⃣ Provide the Context Value
    const App = () => {
      const [theme, setTheme] = useState('dark');
      
      const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      };

      return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <Example />
        </ThemeContext.Provider>
      );
    };

    export default App;`,
    css: `.themed-card {
      padding: 20px;
      border-radius: 12px;
      width: 100%;
      max-width: 300px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      text-align: center;
    }

    .light {
      background-color: #f8f9fa;
      color: #333;
    }

    .dark {
      background-color: #333;
      color: white;
    }

    .content {
      margin-bottom: 20px;
    }

    .content h2 {
      margin-bottom: 10px;
      font-size: 1.5rem;
    }

    .theme-toggle {
      background-color: transparent;
      border: 2px solid currentColor;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .light .theme-toggle {
      color: #007bff;
    }

    .light .theme-toggle:hover {
      background-color: rgba(0, 123, 255, 0.1);
    }

    .dark .theme-toggle {
      color: #6ea8fe;
    }

    .dark .theme-toggle:hover {
      background-color: rgba(110, 168, 254, 0.1);
    }`,
  },
  useReducer: {
    jsx: `import { useReducer } from 'react';
    import './useReducer.css';

    // 1️⃣ Define the reducer function
    const reducer = (state) => {
      return state === 'ON' ? 'OFF' : 'ON';
    };

    const Example = () => {
      // 2️⃣ Initialize useReducer
      const [state, dispatch] = useReducer(reducer, 'OFF');

      // 3️⃣ Dispatch an action on button click
      const handleClick = () => {
        dispatch();
      };

      return (
        <button className="useReducerButton" onClick={handleClick}>
          {state}
        </button>
      );
    };

    export default Example;`,
    css: `.useReducerButton {
      background-color: #28a745;
      color: white;
      font-size: 18px;
      font-weight: bold;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.2s ease;
    }

    .useReducerButton:hover {
      transform: scale(1.05);
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

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [code, setCode] = useState<CodeState>(defaultCode);
  const [activeHook, setActiveHook] = useState<HookType>(() => {
    // Get the saved hook from localStorage or default to "useState"
    const savedHook = localStorage.getItem("activeHook") as HookType;
    return savedHook || "useState";
  });
  const [activeFile, setActiveFile] = useState<FileType>("jsx");

  // Save activeHook to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeHook", activeHook);
  }, [activeHook]);

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
    // Reset to practice template with hints for "try on your own" mode
    setCode((prevCode) => ({
      ...prevCode,
      [activeHook]: {
        ...practiceTemplates[activeHook],
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
