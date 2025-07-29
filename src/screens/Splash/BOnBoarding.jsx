import * as React from "react";
import { StyleSheet, Text, Pressable, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Baseshape from "../../assets/base-shape.svg";
import Next from "../../assets/next.svg";
import Ellipse185 from "../../assets/Ellipse185.svg";
import { Color, Fonts, FontSize } from "../../constants/GlobleStyle";
import { useNavigation } from '@react-navigation/native';

const BOnBoarding = () => {

const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Ready To Take{"\n"}Charge Of Your Financial Future?</Text>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.illustrationWrapper}>
          <Image
            style={styles.illustration}
            resizeMode="contain"
            source={require("../../assets/bank-card-mobile-phone-online-payment-removebg-preview1.png")}
          />
        </View>
        <Pressable style={styles.nextButton} onPress={() => {navigation.navigate("Welcome")}}>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
        <View style={styles.dotsContainer}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorMediumseagreen,
  },
  topSection: {
    flex: 1.1,
    backgroundColor: Color.colorMediumseagreen,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    color: Color.colorDarkslategray100,
    fontFamily: Fonts.poppinsSemiBold,
    fontWeight: "600",
    fontSize: 24,
    textAlign: "center",
    lineHeight: 32,
    marginHorizontal: 24,
  },
  bottomSection: {
    flex: 1.4,
    backgroundColor: Color.colorHoneydew100,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  illustrationWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  illustration: {
    width: 180,
    height: 180,
  },
  nextButton: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: Fonts.poppinsSemiBold,
    color: Color.colorDarkslategray100,
    textAlign: "center",
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Color.colorMediumseagreen,
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C4C4C4",
    marginHorizontal: 4,
  },
});

export default BOnBoarding;
