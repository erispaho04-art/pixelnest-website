import React, { createContext, useContext, useState } from 'react';

export type CursorType = 'default' | 'button' | 'link' | 'card';

interface CursorContextValue {
  cursorType: CursorType;
  cursorText: string;
  setCursorType: (type: CursorType) => void;
  setCursorText: (text: string) => void;
}

const CursorContext = createContext<CursorContextValue>({
  cursorType: 'default',
  cursorText: '',
  setCursorType: () => {},
  setCursorText: () => {},
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [cursorText, setCursorText] = useState('');

  return (
    <CursorContext.Provider value={{ cursorType, cursorText, setCursorType, setCursorText }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}
