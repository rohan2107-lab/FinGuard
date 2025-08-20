import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Import your SVG components
import Baseshape from "../../assets/base-shape.svg";
import Vector from "../../assets/Eye-Pass.svg";

// Import your constants
import { Color, Fonts, FontSize, Border } from "../../constants/GlobleStyle";
import { appAxios } from "../../api/apiconfig";

const CreateAccount = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Form validation
  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!mobile.trim()) {
      Alert.alert("Error", "Please enter your mobile number");
      return false;
    }
    if (!dob.trim()) {
      Alert.alert("Error", "Please enter your date of birth");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  // Sign up API handler
  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await appAxios.post("api/auth/signup", {
        fullName,
        email,
        mobile,
        dob,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          "Success", 
          "Account created successfully!",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Welcome")
            }
          ]
        );
      } else {
        Alert.alert("Error", "Signup failed: " + response.data.message);
      }
    } catch (error) {
      console.log("Signup error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        "Error signing up: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Welcome");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBg} />
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={Color.colorDarkslategray100 + "80"}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor={Color.colorDarkslategray100 + "80"}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+ 123 456 789"
            placeholderTextColor={Color.colorDarkslategray100 + "80"}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Date Of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="DD / MM / YYYY"
            placeholderTextColor={Color.colorDarkslategray100 + "80"}
            value={dob}
            onChangeText={setDob}
          />

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
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

          <Text style={[styles.label, { marginTop: 12 }]}>Confirm Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Confirm Password"
              placeholderTextColor={Color.colorDarkslategray100 + "80"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
              autoCapitalize="none"
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setConfirmPasswordVisible((v) => !v)}
            >
              <Vector width={22} height={22} />
            </Pressable>
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to
            <Text style={styles.termsHighlight}> Terms of Use </Text>
            and
            <Text style={styles.termsHighlight}> Privacy Policy.</Text>
          </Text>

          <Pressable 
            style={[styles.signUpBtn, loading && { opacity: 0.6 }]} 
            onPress={handleSignUp} 
            disabled={loading}
          >
            <Text style={styles.signUpBtnText}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Text>
          </Pressable>

          <View style={styles.bottomTextContainer}>
            <Text style={styles.bottomText}>Already have an account? </Text>
            <Pressable onPress={handleLogin}>
              <Text style={styles.bottomLogin}>Log In</Text>
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
    height: 120,
    backgroundColor: Color.colorMediumseagreen,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 1,
  },
  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: Color.colorHoneydew,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: "center",
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: Fonts.poppinsSemiBold,
    color: Color.colorDarkslategray200,
    marginBottom: 20,
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
  termsText: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: Fonts.leagueSpartanLight,
    color: Color.colorDimgray,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 18,
  },
  termsHighlight: {
    color: Color.colorDarkslategray200,
    fontFamily: Fonts.leagueSpartanSemiBold,
    fontWeight: "600",
  },
  signUpBtn: {
    width: "100%",
    height: 44,
    backgroundColor: Color.colorMediumseagreen,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  signUpBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.poppinsSemiBold,
  },
  bottomTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomText: {
    fontSize: 14,
    fontFamily: Fonts.leagueSpartanLight,
    color: Color.colorDarkslategray200,
  },
  bottomLogin: {
    fontSize: 14,
    color: Color.colorDodgerblue,
    fontFamily: Fonts.leagueSpartanLight,
    fontWeight: "600",
  },
});

export default CreateAccount;