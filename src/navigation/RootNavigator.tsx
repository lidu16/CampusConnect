import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TabNavigator from './TabNavigator';
import CreateAnnouncementScreen from '../screens/CreateAnnouncementScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import UploadMaterialScreen from '../screens/UploadMaterialScreen';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  CreateAnnouncement: undefined;
  CreateEvent: undefined;
  UploadMaterial: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            {/* Admin screens — shown when navigating from Admin Panel */}
            <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncementScreen} options={{ headerShown: true, title: 'New Announcement' }} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} options={{ headerShown: true, title: 'New Event' }} />
            <Stack.Screen name="UploadMaterial" component={UploadMaterialScreen} options={{ headerShown: true, title: 'Upload Material' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;