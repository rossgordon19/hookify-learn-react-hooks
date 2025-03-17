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
export type FileType = "js" | "css";

interface CodeState {
  [key: string]: {
    js: string;
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
}

const defaultCode: CodeState = {
  useState: {
    js: `/* Add your code here */`,
    css: ``,
  },
  useEffect: {
    js: `/* Add your code here */`,
    css: ``,
  },
  useContext: {
    js: `/* Add your code here */`,
    css: ``,
  },
  useReducer: {
    js: `/* Add your code here */`,
    css: ``,
  },
  useRef: {
    js: `/* Add your code here */`,
    css: ``,
  },
  useMemoCallback: {
    js: `/* Add your code here */`,
    css: ``,
  },
  useTransition: {
    js: `/* Add your code here */`,
    css: ``,
  },
  customHook: {
    js: `/* Add your code here */`,
    css: ``,
  },
};

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [code, setCode] = useState<CodeState>(defaultCode);
  const [activeHook, setActiveHook] = useState<HookType>("useState");
  const [activeFile, setActiveFile] = useState<FileType>("js");

  const updateCode = (hook: HookType, file: FileType, newCode: string) => {
    setCode((prevCode) => ({
      ...prevCode,
      [hook]: {
        ...prevCode[hook],
        [file]: newCode,
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
