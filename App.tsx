import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import OnBoarding from './src/screens/Splash/OnBoarding';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
// game wala section start..
import GamesHome from './src/screens/Games/GamesHome';
import GamesSplash from './src/screens/Games/GamesSplash';
import BudgetGame from './src/screens/Games/BudgetGame';
import ScamGame from './src/screens/Games/ScamGame';
import BillSplitterGame from './src/screens/Games/BillSplitterGame';
import InvestmentFraudGame from './src/screens/Games/InvestmentFraudGame';
import MoreGames from './src/screens/Games/MoreGames'; // Optional
//game wala section end..




const stack = createNativeStackNavigator();

export default function App() {
  return<> 
  <NavigationContainer>
    <stack.Navigator screenOptions={{ headerShown: false }}>  
      <stack.Screen name="OnBoarding" component={OnBoarding} />
      <stack.Screen name="AOnBoarding" component={AOnBoarding} />
      <stack.Screen name="BOnBoarding" component={BOnBoarding} />
      <stack.Screen name="Welcome" component={Welcome} />
      <stack.Screen name="CreateAccount" component={CreateAccount} />      
      <stack.Screen name="Home" component={Home} />      
      <stack.Screen name="Budgeting" component={Budgeting} />      
      <stack.Screen name="AddExpenses" component={AddExpenses} />
      <stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
      <stack.Screen name="GamesSplash" component={GamesSplash} options={{ headerShown: false }} />
      <stack.Screen name="GamesHome" component={GamesHome} />
      <stack.Screen name="BudgetGame" component={BudgetGame} />
      <stack.Screen name="ScamGame" component={ScamGame} />
      <stack.Screen name="BillSplitterGame" component={BillSplitterGame} />
      <stack.Screen name="InvestmentFraudGame" component={InvestmentFraudGame} />
      <stack.Screen name="MoreGames" component={MoreGames} />      

      <stack.Screen name="MainApp" component={MainContainer} /> 
      <stack.Screen name="EmergencyHelp" component={EmergencyHelp} />
      <stack.Screen name="InvestmentBasics" component={InvestmentBasics} />
      <stack.Screen name="FinancialCalculator" component={FinancialCalculator} />
      <stack.Screen name="FraudSimulation" component={FraudSimulation} />
      <stack.Screen name="Gifts" component={Gifts} />
      <stack.Screen name="GoalTracker" component={GoalTracker} />
      <stack.Screen name="Games" component={Games} />

      <stack.Screen name="ReportScam" component={ReportScam} />
      <stack.Screen name="Panic" component={Panic} />
      <stack.Screen name="BranchLocator" component={BranchLocator} />
      <stack.Screen name="Helpline" component={Helpline} />

      <stack.Screen name="EditProfile" component={EditProfile} />
      <stack.Screen name="Security" component={Security} />
      <stack.Screen name="Settings" component={Settings} />
      <stack.Screen name="HelpAndSupport" component={HelpAndSupport} />

     
      

    </stack.Navigator>
    </NavigationContainer></>
}