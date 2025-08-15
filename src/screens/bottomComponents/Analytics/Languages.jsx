import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';

const Languages = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  const handleLanguageSelect = (languageId) => {
    changeLanguage(languageId);
  };

  const handleContinue = () => {
    const selectedLang = languages.find(lang => lang.id === currentLanguage);
    Alert.alert(
      'Language Selected',
      `You have selected ${selectedLang?.englishName}`,
      [{ text: 'OK' }]
    );
    // Language is already saved via the context
    // Example: navigation.navigate('HomeScreen');
  };

  const localizedText = {
    hindi: {
      title: 'भाषा चुनें',
      subtitle: 'अपनी पसंदीदा भाषा का चयन करें',
      continue: 'जारी रखें',
    },
    punjabi: {
      title: 'ਭਾਸ਼ਾ ਚੁਣੋ',
      subtitle: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
    },
    english: {
      title: 'Select Language',
      subtitle: 'Choose your preferred language',
      continue: 'Continue',
    }
  }[currentLanguage] || localizedText.english;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{localizedText.title}</Text>
        <Text style={styles.subtitle}>{localizedText.subtitle}</Text>
      </View>

      {/* Language Options */}
      <View style={styles.languageContainer}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.id}
            style={[
              styles.languageOption,
              currentLanguage === language.id && styles.selectedOption,
            ]}
            onPress={() => handleLanguageSelect(language.id)}
            activeOpacity={0.7}
          >
            <View style={styles.languageContent}>
              <Text style={styles.flag}>{language.flag}</Text>
              <View style={styles.textContainer}>
                <Text style={[
                  styles.languageName,
                  currentLanguage === language.id && styles.selectedText
                ]}>
                  {language.name}
                </Text>
                <Text style={[
                  styles.englishName,
                  currentLanguage === language.id && styles.selectedSubText
                ]}>
                  {language.englishName}
                </Text>
              </View>
            </View>
            <View style={[
              styles.radioButton,
              currentLanguage === language.id && styles.radioButtonSelected,
            ]}>
              {currentLanguage === language.id && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {localizedText.continue}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  languageContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  selectedText: {
    color: '#1976d2',
  },
  englishName: {
    fontSize: 14,
    color: '#666666',
  },
  selectedSubText: {
    color: '#1976d2',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2196f3',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196f3',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#2196f3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Languages;