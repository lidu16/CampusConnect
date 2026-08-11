import React, { useEffect, useRef } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import './src/services/firebase';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from './src/services/notifications';

export default function App() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Register for push notifications when app starts
    registerForPushNotifications();

    // Listen for notifications received while app is in the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📨 Notification received:', notification);
    });

    // Listen for notification taps (user clicks on notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      
      // Handle navigation based on notification data
      const data = response.notification.request.content.data;
      if (data?.screen) {
        console.log('🔀 Navigate to:', data.screen);
        // You can add navigation logic here
        // Example: navigation.navigate(data.screen)
      }
    });

    // Cleanup listeners when component unmounts
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}