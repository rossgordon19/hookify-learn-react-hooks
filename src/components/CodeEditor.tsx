import React from 'react';
import Editor from '@monaco-editor/react';
import { useCodeContext } from '../contexts/CodeContext';

interface CodeEditorProps {
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ height = '100%' }) => {
  const { code, activeHook, activeFile, updateCode, setActiveFile } = useCodeContext();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateCode(activeHook, activeFile, value);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-900 border-b border-gray-800 flex">
        <button
          className={`px-4 py-2 text-sm font-medium relative ${
            activeFile === 'js'
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
          }`}
          onClick={() => setActiveFile('js')}
        >
          {activeHook}.js
          {activeFile === 'js' && (
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
      <div className="flex-1">
        <Editor
          height={height}
          defaultLanguage={activeFile === 'js' ? 'javascript' : 'css'}
          language={activeFile === 'js' ? 'javascript' : 'css'}
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
            semanticHighlighting: { enabled: false },
            semanticValidation: false,
            syntaxValidation: false,
            formatOnType: false,
            formatOnPaste: false,
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: 'off',
            tabCompletion: 'off',
            wordBasedSuggestions: 'off',
            parameterHints: { enabled: false },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor; 