import React, { useEffect } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {Color, Fonts} from "../../constants/GlobleStyle"

const OnBoardingScreen = () => {
  const navigation = useNavigation();

  // Navigate after 2 seconds
  useEffect(() => { 
    const timer = setTimeout(() => {
      navigation.replace("AOnBoarding"); // Use your actual next screen name
    }, 3000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.centeredView}>
        <Text style={styles.finguard}>FinGuard</Text>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require("../../assets/logo.png")}
        />
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Color.colorMediumseagreen,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  finguard: {
    fontSize: 52,
    lineHeight: 57,
    textTransform: "capitalize",
    fontWeight: "600",
    fontFamily: Fonts.poppinsSemiBold,
    color: Color.colorHoneydew100,
    textAlign: "center",
    marginBottom: 32, // space between text and logo
  },
  logo: {
    width: 200,
    height: 120,
  },
});

export default OnBoardingScreen;