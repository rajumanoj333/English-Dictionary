"use client"

import * as React from "react"

export type Translations = {
  [key: string]: {
    dir: "ltr" | "rtl"
    values: {
      [key: string]: string
    }
  }
}

export function useTranslation(translations: Translations, initialLang: string = "en") {
  const [lang, setLang] = React.useState(initialLang)

  const t = React.useMemo(() => {
    return translations[lang]?.values || translations["en"]?.values || {}
  }, [translations, lang])

  const dir = React.useMemo(() => {
    return translations[lang]?.dir || "ltr"
  }, [translations, lang])

  return {
    lang,
    setLang,
    t,
    dir,
  }
}

export function LanguageSelector({ 
  currentLang, 
  onLangChange, 
  availableLangs 
}: { 
  currentLang: string, 
  onLangChange: (lang: string) => void,
  availableLangs: string[]
}) {
  return (
    <div className="flex gap-2" suppressHydrationWarning>
      {availableLangs.map((lang) => (
        <button
          key={lang}
          onClick={() => onLangChange(lang)}
          suppressHydrationWarning
          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border transition-all duration-300 ${
            currentLang === lang 
              ? 'bg-zinc-900 text-zinc-50 border-zinc-900' 
              : 'bg-white text-zinc-400 border-zinc-100 hover:text-zinc-900 hover:border-zinc-900'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}
