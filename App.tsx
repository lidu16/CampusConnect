import React, { useEffect, useRef } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { AdminProvider } from './src/context/AdminContext';
import RootNavigator from './src/navigation/RootNavigator';
import './src/services/firebase';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from './src/services/notifications';

export default function App() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📨 Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      const data = response.notification.request.content.data;
      if (data?.screen) {
        console.log('🔀 Navigate to:', data.screen);
      }
    });

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
      <AdminProvider>
        <RootNavigator />
      </AdminProvider>
    </AuthProvider>
  );
}