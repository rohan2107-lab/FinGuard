import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  Alert, // It's better to use Alert than the global window.alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";

// SVG imports - assuming these paths are correct
import Vector from "../../assets/Eye-Pass.svg";
import Google from "../../assets/Google.svg";
import Facebook from "../../assets/Facebook.svg";

// Import custom constants
import { Color, Fonts, FontSize, Border } from "../../constants/GlobleStyle";

// If `appAxios` is a separate configured instance, you should use that one.
// I've kept the `axios` import for the example, but you'll need to decide which to use.
// const { appAxios } = require("../../api/apiconfig");

const Welcome = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Check for an existing token on app start
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          console.log("Found existing token:", token);
          // Optional: Navigate directly to the main app if a token exists
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [{ name: 'MainApp' }],
          //   })
          // );
        }
      } catch (error) {
        console.error("Failed to fetch token from storage:", error);
      }
    };
    fetchToken();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      // Choose one of the following API calls, not both.
      // Option 1: Using plain axios
      const response = await axios.post('http://10.77.224.93:8000/api/auth/login', {
        email,
        password,
      });

      // Option 2: Using a pre-configured axios instance (appAxios)
      // const response = await appAxios.post("api/auth/login", {
      //   email,
      //   password,
      // });

      if (response.status === 200) {
        Alert.alert("Success", "Login successful!");
        const token = response.data.data.token;
        console.log('Login successful, token:', token);
        await AsyncStorage.setItem('authToken', token);
        
        // Navigate to the main app screen after successful login
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          })
        );
      } else {
        Alert.alert("Error", "Login failed: " + response.data.message);
      }
    } catch (error) {
      console.log("Login error details:", error.response?.data || error.message);
      Alert.alert("Error", "Login error: " + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log("Forgot password pressed");
    // navigation.navigate("ForgotPassword");
  };

  const handleSignUp = () => {
    navigation.navigate("CreateAccount");
  };

  const handleSocialLogin = (provider) => {
    // Handle social login logic here
    console.log(`${provider} login pressed`);
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
            keyboardType="email-address"
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

          <Pressable style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
          
          <Pressable style={styles.signUpBtn} onPress={handleSignUp}>
            <Text style={styles.signUpBtnText}>Sign Up</Text>
          </Pressable>

          {/* This section appears to be for a different login method, possibly biometric */}
          <Text style={styles.fingerprintText}>
            Use <Text style={styles.fingerprintHighlight}>Fingerprint</Text> To Access
          </Text>
          
          <Text style={styles.orText}>or sign up with</Text>
          
          <View style={styles.socialRow}>
            {/* You had a duplicate Google button, this combines them */}
            <Pressable 
              style={styles.socialBtn} 
              onPress={() => handleSocialLogin('Google')}
            >
              <Google width={33} height={33} />
            </Pressable>
            {/* Added a Facebook button, since it was imported but not used */}
            <Pressable 
              style={styles.socialBtn} 
              onPress={() => handleSocialLogin('Facebook')}
            >
              <Facebook width={33} height={33} />
            </Pressable>
          </View>
          
          {/* This bottom text was duplicated, I've used the more structured version */}
          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>Don't have an account? </Text>
            <Pressable onPress={handleSignUp}>
              <Text style={styles.bottomSignUp}>Sign Up</Text>
            </Pressable>
          </View>
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
  bottomTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  bottomText: {
    fontSize: 13,
    fontFamily: Fonts.leagueSpartanLight,
    color: Color.colorDarkslategray200,
  },
  bottomSignUp: {
    fontSize: 13,
    color: Color.colorDodgerblue,
    fontFamily: Fonts.leagueSpartanLight,
  },
});

export default Welcome;