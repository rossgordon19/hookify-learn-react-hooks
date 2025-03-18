import React, { useEffect, useState } from "react";
import { useCodeContext } from "../contexts/CodeContext";
import * as ReactModule from "react";
import * as Babel from "@babel/standalone";
import CodeBlock from "./CodeBlock";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='p-4 text-red-500 bg-red-100 rounded'>
          <h3 className='font-bold'>Error:</h3>
          <pre className='mt-2 text-sm overflow-auto'>
            {this.state.error?.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const CodePreview: React.FC = () => {
  const { code, activeHook } = useCodeContext();
  const [renderedOutput, setRenderedOutput] = useState<React.ReactNode | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [showUseStateEli5, setShowUseStateEli5] = useState(false);
  const [showUseEffectEli5, setShowUseEffectEli5] = useState(false);
  const [showUseContextEli5, setShowUseContextEli5] = useState(false);

  useEffect(() => {
    try {
      setError(null);

      // Remove import statements and extract the component code
      const codeWithoutImports = code[activeHook].jsx.replace(
        /import.*?;(\r?\n|\r)/g,
        ""
      );

      // Remove export default statement but keep the component name
      const codeWithoutExports = codeWithoutImports.replace(
        /export\s+default\s+(\w+)/,
        "const $1_export = $1"
      );

      const transformedCode =
        Babel.transform(codeWithoutExports, { presets: ["react"] }).code || "";

      // Create a function from the transformed code
      const executeCode = new Function(
        'React', 
        'useState', 
        'useEffect', 
        'useContext', 
        'createContext',
        'useReducer', 
        'useRef', 
        'useMemo', 
        'useCallback', 
        'useTransition', 
        'useDeferredValue',
        'activeHook',
        `${transformedCode}
        return activeHook === 'useContext' ? 
          (typeof App === 'function' ? React.createElement(App) : null) :
          (typeof Example === 'function' ? React.createElement(Example) : null);`
      );
      
      // Execute the code with React and hooks provided
      const result = executeCode(
        ReactModule, 
        ReactModule.useState, 
        ReactModule.useEffect, 
        ReactModule.useContext,
        ReactModule.createContext,
        ReactModule.useReducer, 
        ReactModule.useRef, 
        ReactModule.useMemo, 
        ReactModule.useCallback, 
        ReactModule.useTransition, 
        ReactModule.useDeferredValue,
        activeHook
      );

      setRenderedOutput(result);
    } catch (err) {
      console.error("Error rendering component:", err);
      setError(err instanceof Error ? err.message : String(err));
      setRenderedOutput(null);
    }
  }, [code, activeHook]);

  useEffect(() => {
    // Reset ELI5 states when switching hooks
    setShowUseStateEli5(false);
    setShowUseEffectEli5(false);
    setShowUseContextEli5(false);
  }, [activeHook]);

  useEffect(() => {
    console.log("showUseContextEli5 changed:", showUseContextEli5);
  }, [showUseContextEli5]);

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      {/* Preview Section */}
      <div className='bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg p-4 flex-1'>
        <h2 className='text-lg font-medium text-white mb-3 flex items-center'>
          <span className='inline-block w-2 h-2 rounded-full bg-green-400 mr-2'></span>
          Preview
        </h2>
        <div className='bg-gray-900 rounded-md p-4 h-[calc(100%-2rem)] flex items-center justify-center'>
          {error ? (
            <div className='text-red-400 bg-red-900/20 p-4 rounded-md border border-red-800 w-full'>
              <h3 className='font-medium mb-2'>Error</h3>
              <pre className='text-sm overflow-auto'>{error}</pre>
            </div>
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <style>{code[activeHook].css}</style>
              <ErrorBoundary>
                {renderedOutput || (
                  <div className='text-center'>
                    <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-blue-400'
                      >
                        <path d='M12 5v14M5 12h14'></path>
                      </svg>
                    </div>
                    <p className='text-gray-400'>
                      Your component preview will appear here
                    </p>
                    <p className='text-gray-500 text-sm mt-2'>
                      Edit the code on the left to see changes
                    </p>
                  </div>
                )}
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>

      {/* Documentation Section */}
      <div className='bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg p-4'>
        <h2 className='text-lg font-medium text-white mb-3 flex items-center justify-between'>
          <div className="flex items-center">
            <span className='inline-block w-2 h-2 rounded-full bg-blue-400 mr-2'></span>
            Documentation
          </div>
          {activeHook === "useState" && (
            <button
              className='bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded border border-gray-600 transition-all flex items-center gap-1'
              onClick={() => setShowUseStateEli5(!showUseStateEli5)}
              id='useState-eli5-button'
            >
              <span>{showUseStateEli5 ? "Show Technical Explanation" : "Explain Like I'm 5"}</span>
            </button>
          )}
          {activeHook === "useEffect" && (
            <button
              className='bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded border border-gray-600 transition-all flex items-center gap-1'
              onClick={() => setShowUseEffectEli5(!showUseEffectEli5)}
              id='useEffect-eli5-button'
            >
              <span>{showUseEffectEli5 ? "Show Technical Explanation" : "Explain Like I'm 5"}</span>
            </button>
          )}
          {activeHook === "useContext" && (
            <button
              className='bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded border border-gray-600 transition-all flex items-center gap-1'
              onClick={() => {
                try {
                  console.log("useContext button clicked");
                  console.log("Current showUseContextEli5:", showUseContextEli5);
                  setShowUseContextEli5(!showUseContextEli5);
                  console.log("New showUseContextEli5:", !showUseContextEli5);
                  
                  // Force a DOM update after a short delay
                  setTimeout(() => {
                    const eli5Element = document.getElementById("useContext-eli5");
                    console.log("useContext-eli5 element:", eli5Element);
                    console.log("useContext-eli5 display style:", eli5Element?.style.display);
                  }, 100);
                } catch (error) {
                  console.error("Error in useContext button click handler:", error);
                }
              }}
              id='useContext-eli5-button'
            >
              <span>{showUseContextEli5 ? "Show Technical Explanation" : "Explain Like I'm 5"}</span>
            </button>
          )}
        </h2>
        <div className='bg-gray-900 rounded-md p-4 max-h-[300px] overflow-y-auto'>
          <h3 className='text-md font-semibold text-white mb-2'>
            {activeHook === "useState" && "useState Hook"}
            {activeHook === "useEffect" && "useEffect Hook"}
            {activeHook === "useContext" && "useContext Hook"}
            {activeHook === "useReducer" && "useReducer Hook"}
            {activeHook === "useRef" && "useRef Hook"}
            {activeHook === "useMemoCallback" && "useMemo & useCallback Hooks"}
            {activeHook === "useTransition" &&
              "useTransition & useDeferredValue Hooks"}
            {activeHook === "customHook" && "Custom Hooks"}
          </h3>

          <div className='text-gray-300 text-sm space-y-3'>
            {activeHook === "useState" && (
              <>
                <div className='flex justify-between items-center mb-3'>
                  <p className='text-gray-300 text-sm'>
                    The useState hook lets you add state to functional
                    components. It returns a stateful value and a function to
                    update it.
                  </p>
                </div>

                <div
                  id='useState-eli5'
                  style={{ display: showUseStateEli5 ? 'block' : 'none' }}
                  className='bg-gray-800/80 p-4 rounded-md border border-gray-600 my-3 transition-all'
                >
                  <h4 className='text-blue-400 font-medium mb-2 flex items-center gap-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
                    </svg>
                    useState for 5-year-olds
                  </h4>
                  <p className='text-gray-300 mb-2'>
                    Imagine you have a toy box. The toy box can only hold one
                    toy at a time.
                  </p>
                  <div className='bg-gray-700/50 p-2 rounded border border-gray-600 my-2'>
                    <code className='text-green-300 text-xs'>
                      const [toy, setToy] = useState("teddy bear");
                    </code>
                  </div>
                  <p className='text-gray-300 mb-2'>
                    •{" "}
                    <code className='bg-gray-700 px-1 rounded text-green-300'>
                      toy
                    </code>{" "}
                    is what's in your toy box right now (a teddy bear)
                  </p>
                  <p className='text-gray-300 mb-2'>
                    •{" "}
                    <code className='bg-gray-700 px-1 rounded text-green-300'>
                      setToy
                    </code>{" "}
                    is your magic wand that can change what's in the toy box
                  </p>
                  <p className='text-gray-300'>
                    When you want a different toy, you use your magic wand:{" "}
                    <code className='bg-gray-700 px-1 rounded text-green-300'>
                      setToy("dinosaur")
                    </code>{" "}
                    and poof! Now there's a dinosaur in your toy box instead of
                    the teddy bear.
                  </p>
                </div>

                <div className='bg-gray-800 p-3 rounded border border-gray-700 my-3'>
                  <code className='text-green-300 text-xs'>
                    const [state, setState] = useState(initialState);
                  </code>
                </div>
                <p>
                  During re-renders, the first value returned will always be the
                  most updated state value.
                </p>

                <CodeBlock
                  code={`function Counter() {
  const [count, setCount] = useState(0);
  
  function increment() {
    setCount(count + 1);
  }
  
  function incrementTwice() {
    // ❌ This won't work as expected
    setCount(count + 1);
    setCount(count + 1); // Still only increments by 1
    
    // ✅ Use function form instead:
    setCount(c => c + 1);
    setCount(c => c + 1); // Correctly increments by 2
  }
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}`}
                  language='jsx'
                />

                <p className='mt-3 text-sm text-gray-400'>
                  Note: When you call{" "}
                  <code className='bg-gray-700 px-1 rounded text-green-300'>
                    setCount(count + 1)
                  </code>{" "}
                  twice in a row, React batches the updates and only increments
                  once because both updates reference the same original{" "}
                  <code className='bg-gray-700 px-1 rounded text-green-300'>
                    count
                  </code>{" "}
                  value.
                </p>

                <p className='mt-3'>
                  <a
                    href='https://react.dev/reference/react/useState'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-400 hover:text-blue-300 underline'
                  >
                    Read more about useState in the React documentation →
                  </a>
                </p>
              </>
            )}

            {activeHook === "useEffect" && (
              <>
                <div className='flex justify-between items-center mb-3'>
                  <p className='text-gray-300 text-sm'>
                    The useEffect hook lets you perform side effects in function
                    components.
                  </p>
                </div>

                <div
                  id='useEffect-eli5'
                  style={{ display: showUseEffectEli5 ? 'block' : 'none' }}
                  className='bg-gray-800/80 p-4 rounded-md border border-gray-600 my-3 transition-all'
                >
                  <h4 className='text-blue-400 font-medium mb-2 flex items-center gap-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
                    </svg>
                    useEffect for 5-year-olds
                  </h4>
                  <p className='text-gray-300 mb-2'>
                    Imagine you have a robot friend who does chores for you.
                  </p>
                  <div className='bg-gray-700/50 p-2 rounded border border-gray-600 my-2'>
                    <code className='text-green-300 text-xs'>
                      useEffect(() =&gt; {"{"}
                      // Robot does chores here
                      {"}"}, [whenToDoChores]);
                    </code>
                  </div>
                  <p className='text-gray-300 mb-2'>
                    • The robot only does chores after you finish playing with
                    your toys
                  </p>
                  <p className='text-gray-300 mb-2'>
                    • You can tell the robot when to do chores by giving it a
                    list{" "}
                    <code className='bg-gray-700 px-1 rounded text-green-300'>
                      [whenToDoChores]
                    </code>
                  </p>
                  <p className='text-gray-300 mb-2'>
                    • If the list is empty{" "}
                    <code className='bg-gray-700 px-1 rounded text-green-300'>
                      []
                    </code>
                    , the robot only does chores once when you first get it
                  </p>
                  <p className='text-gray-300'>
                    • If you don't give a list at all, the robot does chores
                    every single time you play with any toy
                  </p>
                </div>

                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <CodeBlock code={`useEffect(() => {
  // Effect code
  return () => {
    // Cleanup code
  };
}, [dependencies]);`} language="jsx" />
                </div>
                <p>
                  The function passed to useEffect will run after the render is
                  committed to the screen. The optional dependency array
                  controls when the effect runs.
                </p>

                <CodeBlock
                  code={`function ColorChanger() {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState('#007bff');
  
  // Effect runs when count changes
  useEffect(() => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33A6'];
    setBgColor(colors[count % colors.length]);
    
    // Optional cleanup function
    return () => {
      console.log('Cleaning up before next effect run');
    };
  }, [count]); // Only re-run if count changes
  
  return (
    <button 
      style={{ backgroundColor: bgColor }}
      onClick={() => setCount(count + 1)}
    >
      Change color ({count})
    </button>
  );
}`}
                  language='jsx'
                />

                <p className='mt-3 text-sm text-gray-400'>
                  Dependency array behavior:
                </p>
                <ul className='list-disc pl-5 text-sm text-gray-400 space-y-1'>
                  <li>
                    <code className='bg-gray-700 px-1 rounded text-green-300'>
                      [a, b]
                    </code>{" "}
                    - Effect runs when <code>a</code> or <code>b</code> change
                  </li>
                  <li>
                    <code className='bg-gray-700 px-1 rounded text-green-300'>
                      []
                    </code>{" "}
                    - Effect runs only once after initial render (like
                    componentDidMount)
                  </li>
                  <li>
                    <code className='bg-gray-700 px-1 rounded text-green-300'>
                      no array
                    </code>{" "}
                    - Effect runs after every render
                  </li>
                </ul>

                <p className='mt-3'>
                  <a
                    href='https://react.dev/reference/react/useEffect'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-400 hover:text-blue-300 underline'
                  >
                    Read more about useEffect in the React documentation →
                  </a>
                </p>
              </>
            )}

            {activeHook === "useContext" && (
              <>
                <p>
                  The useContext hook accepts a context object and returns the
                  current context value for that context.
                </p>

                <div 
                  id="useContext-eli5" 
                  style={{
                    display: showUseContextEli5 ? 'block' : 'none',
                    border: showUseContextEli5 ? '2px solid red' : '1px solid rgba(75, 85, 99, 0.6)'
                  }}
                  className="bg-gray-800/80 p-4 rounded-md my-3 transition-all"
                >
                  <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    useContext for 5-year-olds
                  </h4>
                  <p className="text-gray-300 mb-2">
                    Imagine your family has a rule book that everyone follows.
                  </p>
                  <div className="bg-gray-700/50 p-2 rounded border border-gray-600 my-2">
                    <CodeBlock code={`// The family rule book
const RuleBook = createContext('bedtime: 8pm');

// Any family member can check the rules
const rule = useContext(RuleBook);`} language="jsx" />
                  </div>
                  <p className="text-gray-300 mb-2">
                    • The rule book (context) can be created by parents and shared with everyone
                  </p>
                  <p className="text-gray-300 mb-2">
                    • Any family member (component) can check the rules without having to ask their parents or siblings
                  </p>
                  <p className="text-gray-300">
                    • If parents change the rules, everyone immediately knows without having to be told individually
                  </p>
                </div>
                
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <CodeBlock code={`const value = useContext(MyContext);`} language="jsx" />
                </div>
                <p>
                  When the provider updates, this hook will trigger a rerender with the latest context value.
                </p>
                
                <CodeBlock code={`// 1. Create a context with a default value
const ThemeContext = createContext('light');

// 2. Create a component that uses the context
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}

// 3. Wrap your component tree with a Provider to specify the value
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton /> {/* Will receive "dark" as the theme */}
    </ThemeContext.Provider>
  );
}`} language="jsx" />

                <p className="mt-3 text-sm text-gray-400">
                  Context is primarily used when some data needs to be accessible by many components at different nesting levels, without passing props down manually at each level.
                </p>
                
                <p className="mt-3">
                  <a 
                    href="https://react.dev/reference/react/useContext" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Read more about useContext in the React documentation →
                  </a>
                </p>
              </>
            )}

            {activeHook === "useReducer" && (
              <>
                <p>
                  The useReducer hook is an alternative to useState for complex
                  state logic. It accepts a reducer function and an initial
                  state.
                </p>
                <div className='bg-gray-800 p-3 rounded border border-gray-700 my-3'>
                  <code className='text-green-300 text-xs'>
                    const [state, dispatch] = useReducer(reducer, initialArg,
                    init);
                  </code>
                </div>
                <p>
                  It returns the current state paired with a dispatch method to
                  update it.
                </p>
              </>
            )}

            {activeHook === "useRef" && (
              <>
                <p>
                  The useRef hook returns a mutable ref object whose .current
                  property is initialized to the passed argument.
                </p>
                <div className='bg-gray-800 p-3 rounded border border-gray-700 my-3'>
                  <code className='text-green-300 text-xs'>
                    const refContainer = useRef(initialValue);
                  </code>
                </div>
                <p>
                  The returned object will persist for the full lifetime of the
                  component and doesn't cause re-renders when its value changes.
                </p>
              </>
            )}

            {activeHook === "useMemoCallback" && (
              <>
                <p>
                  useMemo returns a memoized value, while useCallback returns a
                  memoized callback function.
                </p>
                <div className='bg-gray-800 p-3 rounded border border-gray-700 my-3'>
                  <CodeBlock code={`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);`} language="jsx" />
                </div>
                <p>
                  Both help optimize performance by avoiding unnecessary
                  calculations or renders.
                </p>
              </>
            )}

            {activeHook === "useTransition" && (
              <>
                <p>
                  useTransition and useDeferredValue help manage expensive state
                  updates by marking them as non-urgent.
                </p>
                <div className='bg-gray-800 p-3 rounded border border-gray-700 my-3'>
                  <CodeBlock code={`const [isPending, startTransition] = useTransition();

const deferredValue = useDeferredValue(value);`} language="jsx" />
                </div>
                <p>
                  These hooks help keep your UI responsive during heavy updates.
                </p>
              </>
            )}

            {activeHook === "customHook" && (
              <>
                <p>
                  Custom Hooks let you extract component logic into reusable
                  functions.
                </p>
                <div className='bg-gray-800 p-3 rounded border border-gray-700 my-3'>
                  <CodeBlock code={`function useCustomHook() {
  // Hook logic here
  return someValue;
}`} language="jsx" />
                </div>
                <p>
                  A custom Hook is a JavaScript function whose name starts with
                  "use" and that may call other Hooks.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
