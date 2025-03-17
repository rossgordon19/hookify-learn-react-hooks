import React, { useState, useEffect } from "react";
import Split from "react-split";
import TabNavigation from "./TabNavigation";
import CodeEditor from "./CodeEditor";
import CodePreview from "./CodePreview";
import reactLogo from "../assets/react.svg";

const Dashboard: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [splitSizes, setSplitSizes] = useState(isMobile ? [100, 0] : [50, 50]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && splitSizes[0] !== 100) {
        setSplitSizes([100, 0]);
      } else if (!mobile && splitSizes[0] === 100) {
        setSplitSizes([50, 50]);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [splitSizes]);

  const handleDragEnd = (sizes: number[]) => {
    setSplitSizes(sizes);
  };

  return (
    <div className='flex flex-col h-screen bg-gray-950'>
      <header className='border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <h1 className='text-lg sm:text-xl font-semibold text-white flex items-center'>
              Hookify • Learn React Hooks
              <img
                src={reactLogo}
                alt='React Logo'
                className='ml-2 w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow'
              />
            </h1>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400'>
              v1.0.0
            </span>
          </div>
        </div>
      </header>

      <main className='flex-1 overflow-hidden'>
        <div className='h-full flex flex-col'>
          <TabNavigation />

          <div className='flex-1 overflow-hidden'>
            {isMobile ? (
              <div className='h-full flex flex-col'>
                <div className='p-2 flex justify-center'>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => setSplitSizes([100, 0])}
                      className={`px-3 py-1 text-xs rounded-md ${
                        splitSizes[0] === 100
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      Editor
                    </button>
                    <button
                      onClick={() => setSplitSizes([0, 100])}
                      className={`px-3 py-1 text-xs rounded-md ${
                        splitSizes[0] === 0
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>
                <div className='flex-1 overflow-hidden'>
                  {splitSizes[0] === 100 ? (
                    <div className='h-full overflow-auto p-2 sm:p-4 bg-gray-950'>
                      <div className='rounded-lg overflow-hidden border border-gray-800 shadow-lg'>
                        <CodeEditor height='calc(100vh - 160px)' />
                      </div>
                    </div>
                  ) : (
                    <div className='h-full overflow-auto p-2 sm:p-4 bg-gray-950'>
                      <CodePreview />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Split
                className='split h-full'
                sizes={splitSizes}
                minSize={0}
                gutterSize={8}
                gutterAlign='center'
                snapOffset={30}
                dragInterval={1}
                direction='horizontal'
                cursor='col-resize'
                onDragEnd={handleDragEnd}
              >
                <div className='h-full overflow-auto p-2 sm:p-4 bg-gray-950'>
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-blue-500'></span>
                      <span className='text-sm font-medium text-gray-300'>
                        Code Editor
                      </span>
                    </div>
                  </div>
                  <div className='rounded-lg overflow-hidden border border-gray-800 shadow-lg'>
                    <CodeEditor height='calc(100vh - 160px)' />
                  </div>
                </div>
                <div className='h-full overflow-auto p-2 sm:p-4 bg-gray-950'>
                  <CodePreview />
                </div>
              </Split>
            )}
          </div>
        </div>
      </main>

      <footer className='border-t border-gray-800 py-2 sm:py-3 px-4 sm:px-6 text-center text-gray-500 text-xs'>
        <p>
          React Hooks Learning Dashboard • Built with React, TypeScript, and
          Monaco Editor
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
