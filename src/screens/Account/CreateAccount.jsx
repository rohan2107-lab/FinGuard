import * as React from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Baseshape from "../../assets/base-shape.svg";
import Vector from "../../assets/Eye-Pass.svg";
import { Color, Fonts, FontSize, Border } from "../../constants/GlobleStyle";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
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
  const navigation = useNavigation();
  // api setup start...(Rohan)
const [loading, setLoading] = useState(false);

const handleSignUp = async () => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  setLoading(true);
  try {
    const response = await appAxios.post('api/auth/signup', {
      fullName,
      email,
      mobile,
      dob,
      password,
    });
    if (response.status === 201 || response.status === 200) {
      alert('Account created successfully!');
      navigation.navigate('MainApp');
    } else {
      alert('Signup failed: ' + response.data.message);
    }
  } catch (error) {
    console.log(error.response?.data || error.message);
    alert('Error signing up: ' + (error.response?.data?.message || error.message));
  }
  setLoading(false);
};

// api setup end....(Rohan)

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Removed topBg to eliminate green space above the form */}
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor={Color.colorDarkslategray100 + '80'}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor={Color.colorDarkslategray100 + '80'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={[styles.label, { marginTop: 12 }]}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+ 123 456 789"
            placeholderTextColor={Color.colorDarkslategray100 + '80'}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
          <Text style={[styles.label, { marginTop: 12 }]}>Date Of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="DD / MM / YYY"
            placeholderTextColor={Color.colorDarkslategray100 + '80'}
            value={dob}
            onChangeText={setDob}
          />
          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              placeholderTextColor={Color.colorDarkslategray100 + '80'}
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
              placeholderTextColor={Color.colorDarkslategray100 + '80'}
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
          <Pressable style={styles.signUpBtn} onPress={handleSignUp} disabled={loading}>
  <Text style={styles.signUpBtnText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
</Pressable>

          <Text style={styles.bottomText}>
            Already have an account?{' '}
            <Text style={styles.bottomLogin} onPress={() => navigation.navigate('Welcome')}>Log In</Text>
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
    position: 'absolute',
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
    marginTop: 0,
    backgroundColor: Color.colorHoneydew,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 8,
    alignItems: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: Fonts.poppinsSemiBold,
    color: Color.colorDarkslategray200,
    marginBottom: 12,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontFamily: Fonts.poppinsMedium,
    color: Color.colorDarkslategray200,
    marginBottom: 4,
    marginLeft: 4,
    marginTop: 4,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#E6F5F0',
    borderRadius: 18,
    paddingHorizontal: 12,
    fontSize: 15,
    fontFamily: Fonts.poppinsRegular,
    color: Color.colorDarkslategray200,
    marginBottom: 4,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#E6F5F0',
    borderRadius: 18,
    marginBottom: 4,
  },
  eyeIcon: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  termsText: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: Fonts.leagueSpartanLight,
    color: Color.colorDimgray,
    textAlign: 'center',
    marginBottom: 6,
  },
  termsHighlight: {
    color: Color.colorDarkslategray200,
    fontFamily: Fonts.leagueSpartanSemiBold,
    fontWeight: '600',
  },
  signUpBtn: {
    width: '100%',
    height: 40,
    backgroundColor: Color.colorMediumseagreen,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  signUpBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.poppinsSemiBold,
  },
  bottomText: {
    fontSize: 12,
    fontFamily: Fonts.leagueSpartanLight,
    color: Color.colorDarkslategray200,
    textAlign: 'center',
    marginTop: 4,
  },
  bottomLogin: {
    color: Color.colorDodgerblue,
    fontFamily: Fonts.leagueSpartanLight,
  },
});

export default CreateAccount;