"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

interface SmileContextType {
  isSmiling: boolean;
  setIsSmiling: (smiling: boolean) => void;
}

const SmileContext = createContext<SmileContextType | undefined>(undefined);

export function SmileProvider({ children }: { children: ReactNode }) {
  const [isSmiling, setIsSmiling] = useState(false);

  return (
    <SmileContext.Provider value={{ isSmiling, setIsSmiling }}>
      {children}
    </SmileContext.Provider>
  );
}

export function useSmile() {
  const context = useContext(SmileContext);
  if (context === undefined) {
    throw new Error('useSmile must be used within a SmileProvider');
  }
  return context;
} 