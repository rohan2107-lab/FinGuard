import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Baseshape from "../../assets/base-shape.svg";
import Facebook from "../../assets/Facebook.svg";
import Google from "../../assets/Google.svg";
import Vector from "../../assets/Eye-Pass.svg";
import { Color, Fonts } from "../../constants/GlobleStyle";
import { useNavigation, CommonActions } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Welcome = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Added from main branch: check stored token on mount
  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log("+++++", token);
    };
    fetchToken();
  }, []);

  // Login API setup
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://10.246.66.93:8000/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        alert("Login successful!");
        const token = response.data.data.token;
        console.log("data", response.data);
        console.log("token", token);
        await AsyncStorage.setItem("authToken", token);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainApp" }],
          })
        );
      } else {
        alert("Login failed: " + response.data.message);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(
        "Login error: " +
          (error.response?.data?.message || error.message)
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBg} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Username Or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor={Color.colorDarkslategray100 + "80"}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              placeholderTextColor={Color.colorDarkslategray100 + "80"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible((v) => !v)}
            >
              <Vector width={22} height={22} />
            </Pressable>
          </View>
          <Pressable
            style={[styles.loginBtn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? "Logging In..." : "Log In"}
            </Text>
          </Pressable>
          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
          <Pressable style={styles.signUpBtn}>
            <Text
              style={styles.signUpBtnText}
              onPress={() => {
                navigation.navigate("CreateAccount");
              }}
            >
              Sign Up
            </Text>
          </Pressable>
          <Text style={styles.fingerprintText}>
            Use <Text style={styles.fingerprintHighlight}>Fingerprint</Text> To
            Access
          </Text>
          <Text style={styles.orText}>or sign up with</Text>
          <View style={styles.socialRow}>
            <Pressable style={styles.socialBtn}>
              <Google width={33} height={33} />
            </Pressable>
          </View>
          <Text style={styles.bottomText}>
            Don’t have an account?{" "}
            <Text style={styles.bottomSignUp}>Sign Up</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.colorMediumseagreen,
  },
  topBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: Color.colorMediumseagreen,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 1,
  },
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: Color.colorHoneydew,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: Fonts.poppinsSemiBold,
    color: Color.colorDarkslategray200,
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 15,
    fontFamily: Fonts.poppinsMedium,
    color: Color.colorDarkslategray200,
    marginBottom: 6,
    marginLeft: 8,
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#E6F5F0",
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.poppinsRegular,
    color: Color.colorDarkslategray200,
    marginBottom: 8,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#E6F5F0",
    borderRadius: 18,
    marginBottom: 8,
  },
  eyeIcon: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  loginBtn: {
    width: "100%",
    height: 44,
    backgroundColor: Color.colorMediumseagreen,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.poppinsSemiBold,
  },
  forgotPassword: {
    marginTop: 10,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: Color.colorDarkslategray200,
    fontSize: 14,
    fontFamily: Fonts.leagueSpartanSemiBold,
    textAlign: "center",
  },
  signUpBtn: {
    width: "100%",
    height: 44,
    backgroundColor: "#E6F5F0",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  signUpBtnText: {
    color: Color.colorMediumseagreen,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.poppinsSemiBold,
  },
  fingerprintText: {
    marginTop: 18,
    fontSize: 14,
    fontFamily: Fonts.poppinsSemiBold,
    color: Color.colorDarkslategray100,
    textAlign: "center",
  },
  fingerprintHighlight: {
    color: Color.colorRoyalblue,
    fontFamily: Fonts.poppinsSemiBold,
  },
  orText: {
    marginTop: 18,
    fontSize: 13,
    fontFamily: Fonts.leagueSpartanLight,
    color: Color.colorDarkslategray200,
    textAlign: "center",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  socialBtn: {
    marginHorizontal: 12,
  },
  bottomText: {
    fontSize: 13,
    fontFamily: Fonts.leagueSpartanLight,
    color: Color.colorDarkslategray200,
    textAlign: "center",
    marginTop: 8,
  },
  bottomSignUp: {
    color: Color.colorDodgerblue,
    fontFamily: Fonts.leagueSpartanLight,
  },
});

export default Welcome;
