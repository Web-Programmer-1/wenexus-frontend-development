import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en.json';
import bn from '../locales/bn.json';

export type Language = 'en' | 'bn';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const translations: Record<Language, any> = { en, bn };

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (key: string, variables?: Record<string, string>): string => {
    const keys = key.split('.');
    let result = translations[language];
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key;
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    if (variables) {
      let templated = result;
      Object.entries(variables).forEach(([name, val]) => {
        templated = templated.replace(new RegExp(`{${name}}`, 'g'), val);
      });
      return templated;
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
