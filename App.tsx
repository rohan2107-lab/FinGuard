import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LanguageProvider } from './src/contexts/LanguageContext';

import { useEffect, useState } from 'react';






// Import all your screens
import OnBoarding from './src/screens/Splash/OnBoarding';
import AOnBoarding from './src/screens/Splash/AOnBoarding';
import BOnBoarding from './src/screens/Splash/BOnBoarding';
import Welcome from './src/screens/Account/Welcome';
import CreateAccount from './src/screens/Account/CreateAccount';
import Home from './src/screens/Home/Home';
import Budgeting from './src/screens/Categories/Budgeting/Budgeting';
import AddExpenses from './src/screens/Categories/Budgeting/AddExpenses';
import ChatScreen from './src/screens/ChatScreen';
import MainContainer from './src/components/MainContainer ';

import EmergencyHelp from './src/screens/Categories/Emergency/EmergencyHelp';
import InvestmentBasics from './src/screens/Categories/InvestmentBasics/InvestmentBasics';
import FinancialCalculator from './src/screens/Categories/FinancialCalculator/FinanceCalculator';
import FraudSimulation from './src/screens/Categories/FraudSimulation/FraudSimulation';
import Gifts from './src/screens/Categories/Gifts/Gifts';
import GoalTracker from './src/screens/Categories/GoalTracker/GoalTracker';
import Games from './src/screens/Categories/Games/Games';

import ReportScam from './src/screens/Categories/Emergency/ReportScam';
import Panic from './src/screens/Categories/Emergency/Panic';
import BranchLocator from './src/screens/Categories/Emergency/BranchLocator';
import Helpline from './src/screens/Categories/Emergency/Helpline';

import EditProfile from './src/screens/bottomComponents/Profile/EditProfile';
import Security from './src/screens/bottomComponents/Profile/Security';
import Settings from './src/screens/bottomComponents/Profile/Settings';
import HelpAndSupport from './src/screens/bottomComponents/Profile/HelpAndSupport';

// Game Section
import GamesHome from './src/screens/Games/GamesHome';
import GamesSplash from './src/screens/Games/GamesSplash';
import BudgetGame from './src/screens/Games/BudgetGame';
import ScamGame from './src/screens/Games/ScamGame';
import BillSplitterGame from './src/screens/Games/BillSplitterGame';
import InvestmentFraudGame from './src/screens/Games/InvestmentFraudGame';
import MoreGames from './src/screens/Games/MoreGames';
import CreditScoreClimber from './src/screens/Games/CreditScoreClimber';
import BudgetPlannerGame from './src/screens/Games/BudgetPlannerGame';
import ScamQuizGame from './src/screens/Games/ScamQuizGame';
import ExpenseGuessGame from './src/screens/Games/ExpenseGuessGame';

// Tutorials Section
import FinanceTutorial from './src/screens/tutorials/FinanceTutorial';
import SIPTutorial from './src/screens/tutorials/SIPTutorial';
import MutualFundsTutorial from './src/screens/tutorials/MutualFundsTutorial';
import FraudTutorial from './src/screens/tutorials/FraudTutorial';
import TaxTutorial from './src/screens/tutorials/TaxTutorial';

const Stack = createNativeStackNavigator();

export default function App() {


   

  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
          <Stack.Screen name="AOnBoarding" component={AOnBoarding} />
          <Stack.Screen name="BOnBoarding" component={BOnBoarding} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Budgeting" component={Budgeting} />
          <Stack.Screen name="AddExpenses" component={AddExpenses} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
          <Stack.Screen name="GamesSplash" component={GamesSplash} />
          <Stack.Screen name="GamesHome" component={GamesHome} />
          <Stack.Screen name="BudgetGame" component={BudgetGame} />
          <Stack.Screen name="ScamGame" component={ScamGame} />
          <Stack.Screen name="BillSplitterGame" component={BillSplitterGame} />
          <Stack.Screen name="InvestmentFraudGame" component={InvestmentFraudGame} />
          <Stack.Screen name="MoreGames" component={MoreGames} />
          <Stack.Screen name="MainApp" component={MainContainer} />
          <Stack.Screen name="EmergencyHelp" component={EmergencyHelp} />
          <Stack.Screen name="InvestmentBasics" component={InvestmentBasics} />
          <Stack.Screen name="FinancialCalculator" component={FinancialCalculator} />
          <Stack.Screen name="FraudSimulation" component={FraudSimulation} />
          <Stack.Screen name="Gifts" component={Gifts} />
          <Stack.Screen name="GoalTracker" component={GoalTracker} />
          <Stack.Screen name="Games" component={Games} />
          <Stack.Screen name="ReportScam" component={ReportScam} />
          <Stack.Screen name="Panic" component={Panic} />
          <Stack.Screen name="BranchLocator" component={BranchLocator} />
          <Stack.Screen name="Helpline" component={Helpline} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Security" component={Security} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
          <Stack.Screen name="CreditScoreClimber" component={CreditScoreClimber} />
          <Stack.Screen name="BudgetPlannerGame" component={BudgetPlannerGame} />
          <Stack.Screen name="ScamQuizGame" component={ScamQuizGame} />
          <Stack.Screen name="ExpenseGuessGame" component={ExpenseGuessGame} />
          <Stack.Screen name="FinanceTutorial" component={FinanceTutorial} />
          <Stack.Screen name="SIPTutorial" component={SIPTutorial} />
          <Stack.Screen name="MutualFundsTutorial" component={MutualFundsTutorial} />
          <Stack.Screen name="FraudTutorial" component={FraudTutorial} />
          <Stack.Screen name="TaxTutorial" component={TaxTutorial} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
