import { PermissionsAndroid, Platform } from "react-native";
import { useEffect } from "react";
import { getApp } from '@react-native-firebase/app';
import { getMessaging, requestPermission, getToken, onMessage, onNotificationOpenedApp, getInitialNotification, AuthorizationStatus } from '@react-native-firebase/messaging';

const requestUserNotificationPermission = async () => {
  if (Platform.OS === "ios") {
    // iOS runtime permission
    const authStatus = await requestPermission();
    return (
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL
    );
  } else if (Platform.OS === "android" && Platform.Version >= 33) {
    // Android 13+ requires runtime permission
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // Android < 13 doesn't need explicit permission
  return true;
};

const getFCMToken = async () => {
  try {
    const app = getApp();
    const messaging = getMessaging(app);
    const token = await getToken(messaging);
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
        await getFCMToken();

        const app = getApp();
        const messaging = getMessaging(app);

        // Handle background notification that opened the app
        onNotificationOpenedApp(messaging, remoteMessage => {
          console.log("📩 App opened from background:", remoteMessage?.notification);
        });

        // Handle notification when app is opened from a quit state
        getInitialNotification(messaging)
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
    const app = getApp();
    const messaging = getMessaging(app);
    const unsubscribeForeground = onMessage(messaging, async remoteMessage => {
      console.log("🔔 Foreground notification received:", remoteMessage);
    });

    setup();

    // Clean up foreground listener
    return () => {
      unsubscribeForeground();
    };
  }, []);
};
