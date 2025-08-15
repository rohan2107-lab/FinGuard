// Translations utility file

// Common translations used across the app
const translations = {
  // Card Switcher
  cardSwitcher: {
    english: {
      rbiUpdate: {
        title: 'RBI Update',
        description: 'New policy on digital lending released. Know your rights!',
      },
      psbNews: {
        title: 'PSB News',
        description: 'PSB Bank launches 5.5% savings account scheme for youth.',
      },
      rupeeRates: {
        title: 'Rupee Exchange Rates',
        description: 'Show daily USD/INR or EUR/INR exchange rate.',
      },
    },
    hindi: {
      rbiUpdate: {
        title: 'आरबीआई अपडेट',
        description: 'डिजिटल लेंडिंग पर नई नीति जारी की गई। अपने अधिकारों को जानें!',
      },
      psbNews: {
        title: 'पीएसबी समाचार',
        description: 'पीएसबी बैंक ने युवाओं के लिए 5.5% बचत खाता योजना शुरू की।',
      },
      rupeeRates: {
        title: 'रुपया विनिमय दर',
        description: 'दैनिक USD/INR या EUR/INR विनिमय दर दिखाएं।',
      },
    },
    punjabi: {
      rbiUpdate: {
        title: 'ਆਰਬੀਆਈ ਅਪਡੇਟ',
        description: 'ਡਿਜੀਟਲ ਲੈਂਡਿੰਗ ਤੇ ਨਵੀਂ ਨੀਤੀ ਜਾਰੀ ਕੀਤੀ ਗਈ। ਆਪਣੇ ਅਧਿਕਾਰਾਂ ਨੂੰ ਜਾਣੋ!',
      },
      psbNews: {
        title: 'ਪੀਐਸਬੀ ਖ਼ਬਰਾਂ',
        description: 'ਪੀਐਸਬੀ ਬੈਂਕ ਨੇ ਨੌਜਵਾਨਾਂ ਲਈ 5.5% ਬਚਤ ਖਾਤਾ ਯੋਜਨਾ ਸ਼ੁਰੂ ਕੀਤੀ।',
      },
      rupeeRates: {
        title: 'ਰੁਪਏ ਦੀ ਵਟਾਂਦਰਾ ਦਰ',
        description: 'ਰੋਜ਼ਾਨਾ USD/INR ਜਾਂ EUR/INR ਵਟਾਂਦਰਾ ਦਰ ਦਿਖਾਓ।',
      },
    },
  },
  // Home screen
  home: {
    english: {
      welcome: 'Welcome to PSB Bank',
      balance: 'Current Balance',
      recentTransactions: 'Recent Transactions',
      viewAll: 'View All',
      quickActions: 'Quick Actions',
      transfer: 'Transfer',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      pay: 'Pay Bills',
    },
    hindi: {
      welcome: 'पीएसबी बैंक में आपका स्वागत है',
      balance: 'वर्तमान बैलेंस',
      recentTransactions: 'हाल के लेनदेन',
      viewAll: 'सभी देखें',
      quickActions: 'त्वरित कार्रवाई',
      transfer: 'ट्रांसफर',
      deposit: 'जमा करें',
      withdraw: 'निकासी',
      pay: 'बिल भुगतान',
    },
    punjabi: {
      welcome: 'ਪੀਐਸਬੀ ਬੈਂਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ',
      balance: 'ਮੌਜੂਦਾ ਬੈਲੇਂਸ',
      recentTransactions: 'ਹਾਲੀਆ ਲੈਣ-ਦੇਣ',
      viewAll: 'ਸਾਰੇ ਵੇਖੋ',
      quickActions: 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ',
      transfer: 'ਟ੍ਰਾਂਸਫਰ',
      deposit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
      withdraw: 'ਪੈਸੇ ਕਢਵਾਓ',
      pay: 'ਬਿੱਲ ਭੁਗਤਾਨ',
    },
  },

  // Profile screen
  profile: {
    english: {
      profile: 'Profile',
      accountDetails: 'Account Details',
      settings: 'Settings',
      helpSupport: 'Help & Support',
      logout: 'Logout',
    },
    hindi: {
      profile: 'प्रोफाइल',
      accountDetails: 'खाता विवरण',
      settings: 'सेटिंग्स',
      helpSupport: 'सहायता और समर्थन',
      logout: 'लॉग आउट',
    },
    punjabi: {
      profile: 'ਪ੍ਰੋਫਾਈਲ',
      accountDetails: 'ਖਾਤਾ ਵੇਰਵਾ',
      settings: 'ਸੈਟਿੰਗਾਂ',
      helpSupport: 'ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ',
      logout: 'ਲੌਗ ਆਊਟ',
    },
  },

  // Categories screen
  categories: {
    english: {
      categories: 'Categories',
      budgeting: 'Budgeting',
      emergency: 'Emergency',
      investment: 'Investment',
      calculator: 'Calculator',
      fraud: 'Fraud Protection',
      gifts: 'Gifts & Rewards',
      goals: 'Goal Tracker',
      games: 'Financial Games',
    },
    hindi: {
      categories: 'श्रेणियाँ',
      budgeting: 'बजटिंग',
      emergency: 'आपातकालीन',
      investment: 'निवेश',
      calculator: 'कैलकुलेटर',
      fraud: 'धोखाधड़ी सुरक्षा',
      gifts: 'उपहार और पुरस्कार',
      goals: 'लक्ष्य ट्रैकर',
      games: 'वित्तीय खेल',
    },
    punjabi: {
      categories: 'ਸ਼੍ਰੇਣੀਆਂ',
      budgeting: 'ਬਜਟਿੰਗ',
      emergency: 'ਐਮਰਜੈਂਸੀ',
      investment: 'ਨਿਵੇਸ਼',
      calculator: 'ਕੈਲਕੁਲੇਟਰ',
      fraud: 'ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ',
      gifts: 'ਤੋਹਫ਼ੇ ਅਤੇ ਇਨਾਮ',
      goals: 'ਟੀਚਾ ਟਰੈਕਰ',
      games: 'ਵਿੱਤੀ ਖੇਡਾਂ',
    },
  },

  // Common buttons and actions
  common: {
    english: {
      continue: 'Continue',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success!',
    },
    hindi: {
      continue: 'जारी रखें',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      confirm: 'पुष्टि करें',
      back: 'वापस',
      next: 'अगला',
      done: 'हो गया',
      loading: 'लोड हो रहा है...',
      error: 'एक त्रुटि हुई',
      success: 'सफलता!',
    },
    punjabi: {
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      cancel: 'ਰੱਦ ਕਰੋ',
      save: 'ਸੇਵ ਕਰੋ',
      edit: 'ਸੋਧੋ',
      delete: 'ਮਿਟਾਓ',
      confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
      back: 'ਵਾਪਸ',
      next: 'ਅੱਗੇ',
      done: 'ਹੋ ਗਿਆ',
      loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      error: 'ਇੱਕ ਗਲਤੀ ਹੋਈ',
      success: 'ਸਫਲਤਾ!',
    },
  },
};

export default translations;