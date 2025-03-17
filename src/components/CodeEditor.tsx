import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useCodeContext } from '../contexts/CodeContext';
import ResetConfirmationModal from './modals/ResetConfirmationModal';

interface CodeEditorProps {
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ height = '100%' }) => {
  const { code, activeHook, activeFile, updateCode, setActiveFile, resetToBoilerplate } = useCodeContext();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateCode(activeHook, activeFile, value);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-900 border-b border-gray-800 flex justify-between">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium relative ${
              activeFile === 'jsx'
                ? 'text-white bg-gray-800/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
            }`}
            onClick={() => setActiveFile('jsx')}
          >
            {activeHook}.jsx
            {activeFile === 'jsx' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>
            )}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium relative ${
              activeFile === 'css'
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
            }`}
            onClick={() => setActiveFile('css')}
          >
            {activeHook}.css
            {activeFile === 'css' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>
            )}
          </button>
        </div>
        <button
          className="px-3 py-1 mr-2 my-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center transition-colors"
          onClick={() => setIsResetModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M3 2v6h6"></path>
            <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
          </svg>
          Try on your own
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height={height}
          defaultLanguage={activeFile === 'jsx' ? 'javascript' : 'css'}
          language={activeFile === 'jsx' ? 'javascript' : 'css'}
          theme="vs-dark"
          value={code[activeHook][activeFile]}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            formatOnType: false,
            formatOnPaste: false,
            acceptSuggestionOnEnter: 'off',
            tabCompletion: 'off',
            wordBasedSuggestions: 'off',
            parameterHints: { enabled: false },
          }}
        />
      </div>
      
      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetToBoilerplate}
        hookName={activeHook}
      />
    </div>
  );
};

export default CodeEditor; 