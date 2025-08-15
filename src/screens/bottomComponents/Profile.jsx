import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Color, Fonts, FontSize } from "../../constants/GlobleStyle";

const Profile = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all stored user data
              await AsyncStorage.multiRemove([
                'userToken',
                'userData',
                'refreshToken',
                'isLoggedIn'
              ]);
              
              // Alternative: Clear all AsyncStorage data
              // await AsyncStorage.clear();
              
              // Navigate to login screen and reset navigation stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }], // Replace 'Login' with your actual login screen name
              });
              
              // Alternative navigation methods:
              // navigation.navigate('Login');
              // navigation.replace('Login');
              
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSecurity = () => {
    navigation.navigate('Security'); 
  };

  const handleSettings = () => {
    navigation.navigate('Settings'); 
  };

  const handleHelp = () => {
    navigation.navigate('Help'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Green Header Background */}
        <View style={styles.headerBackground}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backIcon}>←</Text>
            </Pressable>
            <Text style={styles.profile}>Profile</Text>
            <Pressable style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </Pressable>
          </View>
        </View>

        {/* Avatar overlaps the green and white section */}
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            resizeMode="cover"
            source={require("../../assets/Ellipse192.png")}
          />
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>User Name</Text>
          <Text style={styles.userId}>
            <Text style={styles.idLabel}>ID: </Text>
            <Text style={styles.idNumber}>25030024</Text>
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Pressable style={styles.menuItem} onPress={handleEditProfile}>
            <View style={[styles.menuIcon, styles.editProfileIcon]}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleSecurity}>
            <View style={[styles.menuIcon, styles.securityIcon]}>
              <Text style={styles.iconText}>🛡️</Text>
            </View>
            <Text style={styles.menuText}>Security</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleSettings}>
            <View style={[styles.menuIcon, styles.settingIcon]}>
              <Text style={styles.iconText}>⚙️</Text>
            </View>
            <Text style={styles.menuText}>Setting</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleHelp}>
            <View style={[styles.menuIcon, styles.helpIcon]}>
              <Text style={styles.iconText}>❓</Text>
            </View>
            <Text style={styles.menuText}>Help</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIcon, styles.logoutIcon]}>
              <Text style={styles.iconText}>🚪</Text>
            </View>
            <Text style={styles.menuText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3CB371",
  },
  scrollContent: {
    backgroundColor: "#F0FFF0",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingBottom: 40,
  },
  headerBackground: {
    backgroundColor: "#3CB371",
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  profile: {
    fontSize: FontSize?.size_20 || 20,
    fontFamily: Fonts?.poppinsSemiBold || "System",
    fontWeight: "600",
    color: "#fff",
  },
  notificationButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F0FFF0",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    fontSize: 14,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userInfoContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  userName: {
    fontSize: FontSize?.size_20 || 20,
    fontFamily: Fonts?.poppinsBold || "System",
    fontWeight: "700",
    color: "#2F4F4F",
  },
  userId: {
    fontSize: 13,
    color: "#2F4F4F",
  },
  idLabel: {
    fontWeight: "600",
  },
  idNumber: {
    fontWeight: "300",
  },
  menuContainer: {
    paddingHorizontal: 30,
    gap: 25,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  editProfileIcon: {
    backgroundColor: "#00BFFF",
  },
  securityIcon: {
    backgroundColor: "#1E90FF",
  },
  settingIcon: {
    backgroundColor: "#4169E1",
  },
  helpIcon: {
    backgroundColor: "#87CEEB",
  },
  logoutIcon: {
    backgroundColor: "#1E90FF",
  },
  iconText: {
    fontSize: 20,
    color: "white",
  },
  menuText: {
    fontSize: FontSize?.size_15 || 15,
    fontFamily: Fonts?.poppinsMedium || "System",
    fontWeight: "500",
    color: "#2F4F4F",
  },
});

export default Profile;