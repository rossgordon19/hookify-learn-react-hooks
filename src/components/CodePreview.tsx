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
  const [showUseReducerEli5, setShowUseReducerEli5] = useState(false);
  const [showUseRefEli5, setShowUseRefEli5] = useState(false);

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
    setShowUseReducerEli5(false);
    setShowUseRefEli5(false);
  }, [activeHook]);

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
              onClick={() => setShowUseContextEli5(!showUseContextEli5)}
              id='useContext-eli5-button'
            >
              <span>{showUseContextEli5 ? "Show Technical Explanation" : "Explain Like I'm 5"}</span>
            </button>
          )}
          {activeHook === "useReducer" && (
            <button
              className='bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded border border-gray-600 transition-all flex items-center gap-1'
              onClick={() => setShowUseReducerEli5(!showUseReducerEli5)}
              id='useReducer-eli5-button'
            >
              <span>{showUseReducerEli5 ? "Show Technical Explanation" : "Explain Like I'm 5"}</span>
            </button>
          )}
          {activeHook === "useRef" && (
            <button
              className='bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded border border-gray-600 transition-all flex items-center gap-1'
              onClick={() => setShowUseRefEli5(!showUseRefEli5)}
              id='useRef-eli5-button'
            >
              <span>{showUseRefEli5 ? "Show Technical Explanation" : "Explain Like I'm 5"}</span>
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
                <p>
                  The useEffect hook lets you perform side effects in function
                  components. It's similar to componentDidMount,
                  componentDidUpdate, and componentWillUnmount combined.
                </p>
                <div className='bg-gray-800 p-3 rounded border border-gray-700 my-3'>
                  <code className='text-green-300 text-xs'>
                    useEffect(() =&gt; {"{"}
                    // Your effect code
                    return () =&gt; {"{"}
                    // Optional cleanup
                    {"}"};
                    {"}"}, [dependencies]);
                  </code>
                </div>
                <p>
                  The effect will only run when a dependency changes, which
                  helps prevent unnecessary renders.
                </p>
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
                    • You can tell the robot when to do chores again by putting
                    things in the dependency array[...]
                  </p>
                  <p className='text-gray-300'>
                    • If you don't put anything in the array [], the robot only
                    does chores once when you first start playing
                  </p>
                </div>
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
                  style={{ display: showUseContextEli5 ? 'block' : 'none' }}
                  className="bg-gray-800/80 p-4 rounded-md border border-gray-600 my-3 transition-all"
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
                    <code className='text-green-300 text-xs'>
                      // The family rule book
                      const RuleBook = createContext('bedtime: 8pm');

                      // Any family member can check the rules
                      const rule = useContext(RuleBook);
                    </code>
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
                  The useReducer hook is an alternative to useState for complex state logic. It accepts a reducer function and an initial
                  state, then returns the current state paired with a dispatch method.
                </p>
                
                <div className='bg-gray-800 p-3 rounded border border-gray-700 my-3'>
                  <code className='text-green-300 text-xs'>
                    const [state, dispatch] = useReducer(reducer, initialState);
                  </code>
                </div>
                
                <div
                  id='useReducer-eli5'
                  style={{ display: showUseReducerEli5 ? 'block' : 'none' }}
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
                    useReducer for 5-year-olds
                  </h4>
                  <p className='text-gray-300 mb-2'>
                    Imagine you have a toy vending machine with a big handle.
                  </p>
                  <div className='bg-gray-700/50 p-2 rounded border border-gray-600 my-2'>
                    <code className='text-green-300 text-xs'>
                      const [toys, pullHandle] = useReducer(vendingMachine, initialToys);
                    </code>
                  </div>
                  <p className='text-gray-300 mb-2'>
                    • The vending machine is the <span className="text-blue-300">reducer</span> - it decides what toys come out
                  </p>
                  <p className='text-gray-300 mb-2'>
                    • When you pull the handle (<span className="text-blue-300">dispatch</span>), you can ask for a specific toy
                  </p>
                  <p className='text-gray-300 mb-2'>
                    • The machine knows all the rules for how to give you different toys based on what you ask for
                  </p>
                  <p className='text-gray-300'>
                    • You don't have to remember all the rules - the machine does that for you!
                  </p>
                </div>
                
                <p className="mb-2">
                  A reducer is a function that determines how state should change in response to actions.
                </p>
                
                <CodeBlock
                  code={`// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}`}
                />
                
                <p className="mt-2 mb-2">
                  You dispatch actions to update state, which the reducer then processes:
                </p>
                
                <CodeBlock
                  code={`// Dispatching actions
dispatch({ type: 'increment' });
dispatch({ type: 'decrement' });`}
                />
                
                <h4 className="text-blue-400 font-medium mt-4 mb-2">When to use useReducer vs useState:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Use <span className="text-blue-300">useReducer</span> when state logic is complex and involves multiple sub-values</li>
                  <li>Use <span className="text-blue-300">useReducer</span> when the next state depends on the previous state</li>
                  <li>Use <span className="text-blue-300">useReducer</span> when you need to optimize performance for components that trigger deep updates</li>
                </ul>
                
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-md p-3 mt-4">
                  <p className="text-sm">
                    <span className="text-blue-400 font-medium">💡 Tip:</span> useReducer is often preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.
                  </p>
                </div>
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

                <div 
                  id="useRef-eli5" 
                  style={{ display: showUseRefEli5 ? 'block' : 'none' }}
                  className="bg-gray-800/80 p-4 rounded-md border border-gray-600 my-3 transition-all"
                >
                  <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    useRef for 5-year-olds
                  </h4>
                  <p className="text-gray-300 mb-2">
                    Imagine you have a special sticker you can put on any toy. This sticker helps you find and control your toy later.
                  </p>
                  <div className="bg-gray-700/50 p-2 rounded border border-gray-600 my-2">
                    <code className='text-green-300 text-xs'>
                      {`const toySticker = useRef(null);
                      
// Later: put the sticker on a toy
<input ref={toySticker} />
                      
// Now you can find and control your toy!
toySticker.current.focus();`}
                    </code>
                  </div>
                  <p className="text-gray-300 mt-2">
                    With useRef:
                  </p>
                  <p className="text-gray-300">
                    • The sticker (ref) lets you find your toy (HTML element) anytime
                  </p>
                  <p className="text-gray-300">
                    • You can make the toy do things (like focus, play, change color)
                  </p>
                  <p className="text-gray-300">
                    • Changing what's on the sticker doesn't cause the page to reload (no re-renders)
                  </p>
                  <p className="text-gray-300">
                    • The sticker stays with your toy even when other things change
                  </p>
                </div>

                <p className="mt-3">
                  <a 
                    href="https://react.dev/reference/react/useRef" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Read more about useRef in the React documentation →
                  </a>
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
