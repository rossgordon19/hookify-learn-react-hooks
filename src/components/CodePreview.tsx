import React, { useEffect, useState } from 'react';
import { useCodeContext } from '../contexts/CodeContext';
import * as ReactModule from 'react';
import * as Babel from '@babel/standalone';

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
        <div className="p-4 text-red-500 bg-red-100 rounded">
          <h3 className="font-bold">Error:</h3>
          <pre className="mt-2 text-sm overflow-auto">{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const CodePreview: React.FC = () => {
  const { code, activeHook } = useCodeContext();
  const [renderedOutput, setRenderedOutput] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setError(null);
      
      // Remove import statements and extract the component code
      const codeWithoutImports = code[activeHook].js.replace(/import.*?;(\r?\n|\r)/g, '');
      
      // Remove export default statement but keep the component name
      const codeWithoutExports = codeWithoutImports.replace(/export\s+default\s+(\w+)/, 'const $1_export = $1');
      
      const transformedCode = Babel.transform(codeWithoutExports, { presets: ['react'] }).code || '';
      
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
        `${transformedCode}
        return typeof Example === 'function' ? React.createElement(Example) : null;`
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
        ReactModule.useDeferredValue
      );
      
      setRenderedOutput(result);
    } catch (err) {
      console.error('Error rendering component:', err);
      setError(err instanceof Error ? err.message : String(err));
      setRenderedOutput(null);
    }
  }, [code, activeHook]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Preview Section */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg p-4 flex-1">
        <h2 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
          Preview
        </h2>
        <div className="bg-gray-900 rounded-md p-4 h-[calc(100%-2rem)] flex items-center justify-center">
          {error ? (
            <div className="text-red-400 bg-red-900/20 p-4 rounded-md border border-red-800 w-full">
              <h3 className="font-medium mb-2">Error</h3>
              <pre className="text-sm overflow-auto">{error}</pre>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <style>{code[activeHook].css}</style>
              <ErrorBoundary>
                {renderedOutput || (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                        <path d="M12 5v14M5 12h14"></path>
                      </svg>
                    </div>
                    <p className="text-gray-400">
                      Your component preview will appear here
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
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
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg p-4">
        <h2 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
          Documentation
        </h2>
        <div className="bg-gray-900 rounded-md p-4 max-h-[300px] overflow-y-auto">
          <h3 className="text-md font-semibold text-white mb-2">
            {activeHook === 'useState' && 'useState Hook'}
            {activeHook === 'useEffect' && 'useEffect Hook'}
            {activeHook === 'useContext' && 'useContext Hook'}
            {activeHook === 'useReducer' && 'useReducer Hook'}
            {activeHook === 'useRef' && 'useRef Hook'}
            {activeHook === 'useMemoCallback' && 'useMemo & useCallback Hooks'}
            {activeHook === 'useTransition' && 'useTransition & useDeferredValue Hooks'}
            {activeHook === 'customHook' && 'Custom Hooks'}
          </h3>
          
          <div className="text-gray-300 text-sm space-y-3">
            {activeHook === 'useState' && (
              <>
                <p>
                  The useState hook lets you add state to functional components. It returns a stateful value and a function to update it.
                </p>
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <code className="text-green-300 text-xs">
                    const [state, setState] = useState(initialState);
                  </code>
                </div>
                <p>
                  During re-renders, the first value returned will always be the most updated state value.
                </p>
              </>
            )}
            
            {activeHook === 'useEffect' && (
              <>
                <p>
                  The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in class components.
                </p>
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <code className="text-green-300 text-xs">
                    useEffect(() =&gt; {'{'}
                      // Effect code
                      return () =&gt; {'{'}
                        // Cleanup code
                      {'}'};
                    {'}'}, [dependencies]);
                  </code>
                </div>
                <p>
                  The function passed to useEffect will run after the render is committed to the screen.
                </p>
              </>
            )}
            
            {activeHook === 'useContext' && (
              <>
                <p>
                  The useContext hook accepts a context object and returns the current context value for that context.
                </p>
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <code className="text-green-300 text-xs">
                    const value = useContext(MyContext);
                  </code>
                </div>
                <p>
                  When the provider updates, this hook will trigger a rerender with the latest context value.
                </p>
              </>
            )}
            
            {activeHook === 'useReducer' && (
              <>
                <p>
                  The useReducer hook is an alternative to useState for complex state logic. It accepts a reducer function and an initial state.
                </p>
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <code className="text-green-300 text-xs">
                    const [state, dispatch] = useReducer(reducer, initialArg, init);
                  </code>
                </div>
                <p>
                  It returns the current state paired with a dispatch method to update it.
                </p>
              </>
            )}
            
            {activeHook === 'useRef' && (
              <>
                <p>
                  The useRef hook returns a mutable ref object whose .current property is initialized to the passed argument.
                </p>
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <code className="text-green-300 text-xs">
                    const refContainer = useRef(initialValue);
                  </code>
                </div>
                <p>
                  The returned object will persist for the full lifetime of the component and doesn't cause re-renders when its value changes.
                </p>
              </>
            )}
            
            {activeHook === 'useMemoCallback' && (
              <>
                <p>
                  useMemo returns a memoized value, while useCallback returns a memoized callback function.
                </p>
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <code className="text-green-300 text-xs">
                    const memoizedValue = useMemo(() =&gt; computeExpensiveValue(a, b), [a, b]);
                    <br />
                    const memoizedCallback = useCallback(() =&gt; {'{'}doSomething(a, b);{'}'}, [a, b]);
                  </code>
                </div>
                <p>
                  Both help optimize performance by avoiding unnecessary calculations or renders.
                </p>
              </>
            )}
            
            {activeHook === 'useTransition' && (
              <>
                <p>
                  useTransition and useDeferredValue help manage expensive state updates by marking them as non-urgent.
                </p>
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <code className="text-green-300 text-xs">
                    const [isPending, startTransition] = useTransition();
                    <br />
                    const deferredValue = useDeferredValue(value);
                  </code>
                </div>
                <p>
                  These hooks help keep your UI responsive during heavy updates.
                </p>
              </>
            )}
            
            {activeHook === 'customHook' && (
              <>
                <p>
                  Custom Hooks let you extract component logic into reusable functions.
                </p>
                <div className="bg-gray-800 p-3 rounded border border-gray-700 my-3">
                  <code className="text-green-300 text-xs">
                    function useCustomHook() {'{'}
                      // Hook logic here
                      return someValue;
                    {'}'}
                  </code>
                </div>
                <p>
                  A custom Hook is a JavaScript function whose name starts with "use" and that may call other Hooks.
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