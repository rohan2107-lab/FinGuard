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

    </stack.Navigator>
    </NavigationContainer></>
}