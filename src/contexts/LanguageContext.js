import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the language context
const LanguageContext = createContext();

// Define available languages
const languages = [
  {
    id: 'hindi',
    name: 'हिंदी',
    englishName: 'Hindi',
    flag: '🇮🇳',
  },
  {
    id: 'english',
    name: 'English',
    englishName: 'English',
    flag: '🇺🇸',
  },
  {
    id: 'punjabi',
    name: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    flag: '🇮🇳',
  },
];

// Language provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference on app start
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguagePreference();
  }, []);

  // Change language and save preference
  const changeLanguage = async (languageId) => {
    try {
      setCurrentLanguage(languageId);
      await AsyncStorage.setItem('userLanguage', languageId);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  // Get localized text based on current language
  const getLocalizedText = (textMap) => {
    return textMap[currentLanguage] || textMap.english; // Fallback to English
  };

  // Get language details by ID
  const getLanguageById = (languageId) => {
    return languages.find(lang => lang.id === languageId) || languages[1]; // Default to English
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        getLocalizedText,
        languages,
        getLanguageById,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};