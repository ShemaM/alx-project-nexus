/**
 * Language Context
 * 
 * Provides multilingual support for the application.
 * Supports English, Swahili, and French.
 * 
 * @module contexts/LanguageContext
 */
'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'sw' | 'fr'

interface Translations {
  [key: string]: {
    en: string
    sw: string
    fr: string
  }
}

// Core translations for the application
const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    sw: 'Nyumbani',
    fr: 'Accueil'
  },
  'nav.opportunities': {
    en: 'Opportunities',
    sw: 'Fursa',
    fr: 'Opportunités'
  },
  'nav.partners': {
    en: 'Partners',
    sw: 'Washirika',
    fr: 'Partenaires'
  },
  'nav.about': {
    en: 'About',
    sw: 'Kuhusu',
    fr: 'À propos'
  },
  'nav.signIn': {
    en: 'Sign In',
    sw: 'Ingia',
    fr: 'Connexion'
  },
  'nav.signUp': {
    en: 'Sign Up',
    sw: 'Jisajili',
    fr: 'S\'inscrire'
  },
  'nav.signOut': {
    en: 'Sign Out',
    sw: 'Toka',
    fr: 'Déconnexion'
  },

  // Hero Section
  'hero.tagline': {
    en: 'Trusted by 1000+ refugee youth',
    sw: 'Kuaminiwa na vijana 1000+ wa wakimbizi',
    fr: 'Approuvé par plus de 1000 jeunes réfugiés'
  },
  'hero.title': {
    en: 'Empowering Banyamulenge Youth',
    sw: 'Kuwawezesha Vijana wa Banyamulenge',
    fr: 'Autonomiser les Jeunes Banyamulenge'
  },
  'hero.subtitle': {
    en: 'Your gateway to verified opportunities, career growth, and educational success. Designed specifically for refugee youth in Kenya.',
    sw: 'Lango lako la fursa zilizothibitishwa, ukuaji wa kazi, na mafanikio ya elimu. Imeundwa mahususi kwa vijana wakimbizi nchini Kenya.',
    fr: 'Votre passerelle vers des opportunités vérifiées, une croissance professionnelle et une réussite éducative. Conçu spécifiquement pour les jeunes réfugiés au Kenya.'
  },
  'hero.exploreBtn': {
    en: 'Explore Opportunities',
    sw: 'Tazama Fursa',
    fr: 'Explorer les Opportunités'
  },
  'hero.learnMore': {
    en: 'Learn More',
    sw: 'Jifunze Zaidi',
    fr: 'En savoir plus'
  },

  // Categories
  'categories.title': {
    en: 'Browse by Category',
    sw: 'Tafuta kwa Kategoria',
    fr: 'Parcourir par Catégorie'
  },
  'categories.subtitle': {
    en: 'Explore opportunities that match your goals and documentation status',
    sw: 'Tafuta fursa zinazolingana na malengo yako na hali ya nyaraka',
    fr: 'Explorez les opportunités qui correspondent à vos objectifs et à votre statut documentaire'
  },
  'categories.jobs': {
    en: 'Jobs',
    sw: 'Kazi',
    fr: 'Emplois'
  },
  'categories.scholarships': {
    en: 'Scholarships',
    sw: 'Udhamini',
    fr: 'Bourses'
  },
  'categories.internships': {
    en: 'Internships',
    sw: 'Mafunzo',
    fr: 'Stages'
  },
  'categories.fellowships': {
    en: 'Fellowships',
    sw: 'Ushirikiano',
    fr: 'Fellowships'
  },
  'categories.listings': {
    en: 'listings',
    sw: 'orodha',
    fr: 'annonces'
  },

  // Footer
  'footer.stayUpdated': {
    en: 'Stay Updated',
    sw: 'Endelea Kupata Habari',
    fr: 'Restez Informé'
  },
  'footer.newsletterDesc': {
    en: 'Get the latest opportunities delivered to your inbox',
    sw: 'Pata fursa za hivi karibuni kwenye barua pepe yako',
    fr: 'Recevez les dernières opportunités dans votre boîte de réception'
  },
  'footer.subscribe': {
    en: 'Subscribe',
    sw: 'Jisajili',
    fr: 'S\'abonner'
  },
  'footer.quickLinks': {
    en: 'Quick Links',
    sw: 'Viungo vya Haraka',
    fr: 'Liens Rapides'
  },
  'footer.resources': {
    en: 'Resources',
    sw: 'Rasilimali',
    fr: 'Ressources'
  },
  'footer.contactUs': {
    en: 'Contact Us',
    sw: 'Wasiliana Nasi',
    fr: 'Contactez-nous'
  },
  'footer.privacy': {
    en: 'Privacy Policy',
    sw: 'Sera ya Faragha',
    fr: 'Politique de Confidentialité'
  },
  'footer.terms': {
    en: 'Terms of Service',
    sw: 'Masharti ya Huduma',
    fr: 'Conditions d\'Utilisation'
  },

  // Auth
  'auth.welcomeBack': {
    en: 'Welcome Back',
    sw: 'Karibu Tena',
    fr: 'Bon Retour'
  },
  'auth.createAccount': {
    en: 'Create an Account',
    sw: 'Fungua Akaunti',
    fr: 'Créer un Compte'
  },
  'auth.email': {
    en: 'Email Address',
    sw: 'Anwani ya Barua Pepe',
    fr: 'Adresse e-mail'
  },
  'auth.password': {
    en: 'Password',
    sw: 'Neno la Siri',
    fr: 'Mot de passe'
  },
  'auth.forgotPassword': {
    en: 'Forgot your password?',
    sw: 'Umesahau neno la siri?',
    fr: 'Mot de passe oublié?'
  },
  'auth.noAccount': {
    en: 'Don\'t have an account?',
    sw: 'Huna akaunti?',
    fr: 'Vous n\'avez pas de compte?'
  },
  'auth.hasAccount': {
    en: 'Already have an account?',
    sw: 'Tayari una akaunti?',
    fr: 'Vous avez déjà un compte?'
  },

  // Common
  'common.viewDetails': {
    en: 'View Details',
    sw: 'Tazama Maelezo',
    fr: 'Voir les Détails'
  },
  'common.apply': {
    en: 'Apply Now',
    sw: 'Omba Sasa',
    fr: 'Postuler Maintenant'
  },
  'common.deadline': {
    en: 'Deadline',
    sw: 'Tarehe ya Mwisho',
    fr: 'Date Limite'
  },
  'common.loading': {
    en: 'Loading...',
    sw: 'Inapakia...',
    fr: 'Chargement...'
  },
  'common.error': {
    en: 'An error occurred',
    sw: 'Hitilafu imetokea',
    fr: 'Une erreur s\'est produite'
  },
  'common.success': {
    en: 'Success!',
    sw: 'Imefaulu!',
    fr: 'Succès!'
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  availableLanguages: { code: Language; name: string; nativeName: string }[]
}

const availableLanguages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'fr', name: 'French', nativeName: 'Français' }
]

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en')

  // Load saved language preference from localStorage
  useEffect(() => {
    // Check if window is defined to prevent SSR errors
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language | null
      if (savedLanguage && ['en', 'sw', 'fr'].includes(savedLanguage)) {
        setLanguageState(savedLanguage)
      }
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    // Check if window is defined to prevent SSR errors
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      // Set HTML lang attribute for accessibility
      document.documentElement.lang = lang
    }
  }, [])

  const t = useCallback((key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language] || translation.en || key
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Export for use in components that need the raw translation object
export { translations }
