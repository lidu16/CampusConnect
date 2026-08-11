import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { auth } from './firebase';
import { firestore } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const VAPID_KEY = 'BGiWHkJdlpqKzgZ9zKhAcoV6dQa1zEq-AhOQASD-fucKMe8TEMAhcFC6zRVkG_MpQ_aSdE-qlHKqjkEhVlDn2hQ';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
export const registerForPushNotifications = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    console.log('📱 Must use a physical device for push notifications');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Failed to get push token - permission denied');
      return null;
    }

    // For web, we need the VAPID key
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId || 'campusconnect-946d2',
    });

    console.log('📱 Push token:', token.data);

    // Save token to Firestore
    const user = auth.currentUser;
    if (user) {
      const tokenRef = doc(firestore, 'users', user.uid);
      await setDoc(tokenRef, { 
        pushToken: token.data,
        updatedAt: new Date()
      }, { merge: true });
      console.log('✅ Push token saved to Firestore');
    }

    return token.data;
  } catch (error) {
    console.error('❌ Error registering for push notifications:', error);
    return null;
  }
};

// Send a test notification
export const sendTestNotification = async (token: string) => {
  console.log('🔔 Test notification sent to:', token);
  
  // For testing on web, we'll just log it
  // In production, you'd send this via a server
  
  // Store notification in Firestore for the user
  const user = auth.currentUser;
  if (user) {
    const notifRef = doc(firestore, 'users', user.uid, 'notifications', Date.now().toString());
    await setDoc(notifRef, {
      title: '🎉 Welcome!',
      body: 'Push notifications are working!',
      timestamp: new Date(),
      read: false,
    });
    console.log('📨 Test notification saved to Firestore');
  }
};