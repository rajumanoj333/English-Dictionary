"use client"

import * as React from "react"
import { LanguageSelector } from "@/components/language-selector"

interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface Phonetic {
  text?: string;
  audio?: string;
}

interface WordData {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls: string[];
}

export default function Home() {
  const [word, setWord] = React.useState("")
  const [data, setData] = React.useState<WordData | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!word) return

    setLoading(true)
    setError("")
    setData(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://english-dictionary-f4vy.onrender.com"
      const response = await fetch(`${API_URL}/definition/${word}`)
      if (!response.ok) {
        throw new Error("Word not found")
      }
      const result = await response.json()
      setData(result[0])
    } catch {
      setError("We couldn't find definitions for the word you're looking for.")
    } finally {
      setLoading(false)
    }
  }

  const playAudio = (url: string) => {
    new Audio(url).play().catch(e => console.error("Error playing audio", e))
  }

  const audioUrl = data?.phonetics?.find(p => p.audio)?.audio
  const phoneticText = data?.phonetic || data?.phonetics?.find(p => p.text)?.text

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-200">
      <main className="max-w-2xl mx-auto py-20 px-6">
        
        {/* Header */}
        <header className="mb-16">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Dictionary
            </h1>
            <LanguageSelector 
              currentLang="en" 
              onLangChange={() => {}} 
              availableLangs={["en"]} 
            />
          </div>
          
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Search for a word..."
              suppressHydrationWarning
              className="w-full text-xl py-4 bg-transparent border-b border-zinc-100 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300"
            />
            <button 
              type="submit" 
              disabled={loading}
              suppressHydrationWarning
              className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors font-bold uppercase tracking-[0.2em] text-[10px]"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </header>

        {error && (
          <div className="py-12 border-t border-zinc-50">
            <p className="text-xl text-zinc-500 italic leading-relaxed">{error}</p>
          </div>
        )}

        {/* Content Section */}
        {data && (
          <div className="space-y-12 text-lg leading-relaxed text-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Word Header */}
            <section className="flex justify-between items-end border-b border-zinc-100 pb-8">
              <div>
                <h2 className="text-5xl font-bold tracking-tight mb-3">{data.word}</h2>
                {phoneticText && (
                  <p className="text-xl text-zinc-400 font-medium italic">
                    {phoneticText}
                  </p>
                )}
              </div>
              {audioUrl && (
                <button 
                  onClick={() => playAudio(audioUrl)}
                  suppressHydrationWarning
                  className="w-12 h-12 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors group"
                  aria-label="Play pronunciation"
                >
                  <svg width="12" height="14" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-0.5 text-zinc-900">
                    <path d="M0 16V0L14 8L0 16Z" fill="currentColor"/>
                  </svg>
                </button>
              )}
            </section>

            {/* Meanings Loop */}
            {data.meanings.map((meaning, idx) => (
              <section key={idx} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-zinc-900 italic">
                    {meaning.partOfSpeech}
                  </h3>
                  <div className="h-px flex-1 bg-zinc-50"></div>
                </div>

                <div className="space-y-8">
                  <p className="text-zinc-400 uppercase tracking-widest text-[10px] font-bold">Meaning</p>
                  
                  <ul className="list-disc list-inside space-y-6 text-zinc-700">
                    {meaning.definitions.map((def, defIdx) => (
                      <li key={defIdx} className="leading-relaxed">
                        <span className="text-zinc-800">{def.definition}</span>
                        {def.example && (
                          <blockquote className="mt-4 border-l-2 border-zinc-900 pl-6 py-1 italic text-zinc-600 text-base">
                            &quot;{def.example}&quot;
                          </blockquote>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {meaning.synonyms.length > 0 && (
                  <div className="pt-4 flex gap-4 text-base">
                    <span className="text-zinc-400 font-medium">Synonyms</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      {meaning.synonyms.slice(0, 5).map((syn, sIdx) => (
                        <span key={sIdx} className="font-medium underline decoration-zinc-200 underline-offset-4 text-zinc-900 cursor-default hover:decoration-zinc-900 transition-colors">
                          {syn}{sIdx < Math.min(meaning.synonyms.length, 5) - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}

            {/* Source Footer */}
            <footer className="pt-12 mt-12 border-t border-zinc-100">
              <p className="text-zinc-400 uppercase tracking-widest text-[10px] font-bold mb-4">The Source</p>
              <div className="space-y-2">
                {data.sourceUrls.map((url, i) => (
                  <p key={i} className="text-sm font-medium text-zinc-900 truncate underline decoration-zinc-100 underline-offset-4 hover:decoration-zinc-300 transition-colors">
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                  </p>
                ))}
              </div>
            </footer>

          </div>
        )}
      </main>
    </div>
  )
}
