import { PermissionsAndroid, Platform } from "react-native";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";

const requestUserNotificationPermission = async () => {
  if (Platform.OS === "ios") {
    // iOS runtime permission
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } else if (Platform.OS === "android" && Platform.Version >= 33) {
    // Android 13+ requires runtime permission
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // Android < 13 doesn’t need explicit permission
  return true;
};

const getToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log("✅ FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
  }
};

export const useNotification = () => {
  useEffect(() => {
    const setup = async () => {
      const hasPermission = await requestUserNotificationPermission();
      if (hasPermission) {
        await getToken();

        // Handle background notification that opened the app
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log("📩 App opened from background:", remoteMessage?.notification);
        });

        // Handle notification when app is opened from a quit state
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log("📩 App opened from quit state:", remoteMessage.notification);
            }
          });
      } else {
        console.log("🚫 Notifications permission denied");
      }
    };

    // Foreground listener
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log("🔔 Foreground notification received:", remoteMessage);
    });

    setup();

    // Clean up foreground listener
    return () => {
      unsubscribeForeground();
    };
  }, []);
};
