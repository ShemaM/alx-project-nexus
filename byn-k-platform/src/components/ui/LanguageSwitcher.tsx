/**
 * Language Switcher Component
 * 
 * Allows users to switch between available languages.
 * 
 * @module components/ui/LanguageSwitcher
 */
'use client'

import React, { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage, Language } from '@/contexts/LanguageContext'

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'inline'
  className?: string
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = ''
}) => {
  const { language, setLanguage, availableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = availableLanguages.find(lang => lang.code === language)

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Language selection">
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              language === lang.code
                ? 'bg-[#2D8FDD] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-current={language === lang.code ? 'true' : 'false'}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.nativeName}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#2D8FDD] transition-colors rounded-lg hover:bg-slate-50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Current language: ${currentLanguage?.name}. Click to change language`}
      >
        <Globe size={18} aria-hidden="true" />
        <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            aria-label="Select language"
            className="absolute top-full right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1 z-20"
          >
            {availableLanguages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    language === lang.code
                      ? 'bg-[#2D8FDD]/5 text-[#2D8FDD] font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  role="option"
                  aria-selected={language === lang.code}
                >
                  <span className="block">{lang.nativeName}</span>
                  <span className="text-xs text-slate-400">{lang.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
