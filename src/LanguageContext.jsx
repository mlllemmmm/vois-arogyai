import { createContext, useState } from "react";
import { languages } from "./i18n";

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const value = {
    lang,
    setLang,
    t: languages[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
