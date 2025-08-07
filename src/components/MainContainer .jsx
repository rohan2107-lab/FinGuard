import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavigation from './BottomNavigation';
import Home from '../screens/Home/Home';
import Budgeting from '../screens/Categories/Budgeting/Budgeting';
import Category from '../screens/bottomComponents/Category/Category';
import FinShort from '../screens/bottomComponents/FinShort/FinShort';
import Analytics from '../screens/bottomComponents/Analytics/Analytics';
import Profile from '../screens/bottomComponents/Profile/Profile';
// import other screens as needed

const MainContainer = () => {
    const [activeTab, setActiveTab] = useState('home');

    const renderScreen = () => {
        switch (activeTab) {
            case 'home':
                return <Home />;
            case 'categories':
                return <Category />;
            case 'finShort':
                return <FinShort />;
            case 'analytics':
                return <Analytics />;
            case 'profile':
                return <Profile />;
            
            default:
                return <Home />;
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {renderScreen()}
            <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
        </View>
    );
};

export default MainContainer;