import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, View, Image, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Color, Fonts } from "../../constants/GlobleStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { appAxios } from "../../api/apiconfig";

const OnBoardingScreen = () => {
  const navigation = useNavigation();
  const hasNavigated = useRef(false); // ⬅ Flag to prevent double navigation

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const psbFadeAnim = new Animated.Value(0);
  const psbScaleAnim = new Animated.Value(0.9);
  const rotateAnim = new Animated.Value(0);




  // Navigate after 3 seconds with animations
  useEffect(() => {
    // Start main logo animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Start PSB logo animations with delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(psbFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(psbScaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous rotation animation for PSB logo
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 45000, // Faster rotation: 5 seconds instead of 8
          useNativeDriver: true,
        })
      ).start();
    }, 500);

    const timer = setTimeout(() => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      navigation.replace("AOnBoarding");
    }
  }, 5000);

  return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  
React.useEffect(() => {
  const verifyToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.warn('❌ Token not found in storage');
        return;
      }

      const response = await appAxios.post('api/auth/verify', {
        token: token,
      });

      console.log('✅ Token verified:', response.data.success);

      if (response.data.success === true && !hasNavigated.current) {
        hasNavigated.current = true;
        navigation.replace('MainApp'); // Use replace to prevent going back
      }
    } catch (error) {
      console.error('❌ Verification error:', error?.response?.data || error.message);
    }
  };

  verifyToken();
}, []);

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.container}>
        {/* Top Section - App Logo and Name */}
        <Animated.View 
          style={[
            styles.topSection, 
            { 
              opacity: fadeAnim, 
              transform: [{ scale: scaleAnim }] 
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Image
              style={styles.mainLogo}
              resizeMode="contain"
              source={require("../../assets/university.png")}
            />
            <View style={styles.logoGlow} />
          </View>
          <Text style={styles.appName}>FinGuard</Text>
          <Text style={styles.tagline}>Powered by Punjab & Sind Bank</Text>
        </Animated.View>

        {/* PSB Logo Section */}
        <Animated.View 
          style={[
            styles.bankSection, 
            { 
              opacity: psbFadeAnim,
              transform: [{ scale: psbScaleAnim }]
            }
          ]}
        >
          
          <Animated.View 
            style={[
              styles.bankLogoWrapper,
              { transform: [{ rotate }] }
            ]}
          >
            <Image
              style={styles.bankLogo}
              resizeMode="contain"
              source={require("../../assets/bank1.png")} // Punjab & Sind Bank logo
            />
          </Animated.View>
          <Text style={styles.bankName}>Punjab & Sind Bank</Text>
        </Animated.View>

        {/* Bottom Section - Loading Indicator */}
        <Animated.View 
          style={[
            styles.bottomSection, 
            { opacity: fadeAnim }
          ]}
        >
        
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Color.colorMediumseagreen,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    position: "relative",
    marginBottom: 24,
  },
  mainLogo: {
    width: 120,
    height: 120,
    zIndex: 2,
  },
  logoGlow: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: Color.colorHoneydew100,
    opacity: 0.1,
    borderRadius: 70,
    zIndex: 1,
  },
  appName: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: "700",
    fontFamily: Fonts.poppinsBold || Fonts.poppinsSemiBold,
    color: Color.colorHoneydew100,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: Fonts.poppinsRegular || "System",
    color: Color.colorHoneydew100,
    textAlign: "center",
    opacity: 0.9,
  },
  bankSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  psbText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: Fonts.poppinsRegular || "System",
    color: Color.colorHoneydew100,
    textAlign: "center",
    marginBottom: 15,
    opacity: 0.8,
  },
  bankLogoWrapper: {
    width: 140,
    height: 140,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 16,
  },
  bankLogo: {
    width: 100,
    height: 100,
    opacity: 0.9,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.poppinsSemiBold || "System",
    color: Color.colorHoneydew100,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  bottomSection: {
    flex: 0.5,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Color.colorHoneydew100,
    opacity: 0.6,
  },
  loadingDotDelay1: {
    animationDelay: "0.2s",
  },
  loadingDotDelay2: {
    animationDelay: "0.4s",
  },
});

export default OnBoardingScreen;