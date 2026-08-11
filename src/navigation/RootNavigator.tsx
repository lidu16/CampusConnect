import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import AdminGuard from '../components/AdminGuard';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TabNavigator from './TabNavigator';
import CreateAnnouncementScreen from '../screens/CreateAnnouncementScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import UploadMaterialScreen from '../screens/UploadMaterialScreen';
import CreateScheduleScreen from '../screens/CreateScheduleScreen';
import { theme } from '../theme';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  CreateAnnouncement: undefined;
  CreateEvent: undefined;
  UploadMaterial: undefined;
  CreateSchedule: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const GuardedCreateAnnouncement = () => (
  <AdminGuard><CreateAnnouncementScreen /></AdminGuard>
);
const GuardedCreateEvent = () => (
  <AdminGuard><CreateEventScreen /></AdminGuard>
);
const GuardedUploadMaterial = () => (
  <AdminGuard><UploadMaterialScreen /></AdminGuard>
);
const GuardedCreateSchedule = () => (
  <AdminGuard><CreateScheduleScreen /></AdminGuard>
);

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: theme.colors.primaryDark },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
              name="CreateAnnouncement"
              component={GuardedCreateAnnouncement}
              options={{ headerShown: true, title: 'New Announcement' }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={GuardedCreateEvent}
              options={{ headerShown: true, title: 'New Event' }}
            />
            <Stack.Screen
              name="UploadMaterial"
              component={GuardedUploadMaterial}
              options={{ headerShown: true, title: 'Upload Material' }}
            />
            <Stack.Screen
              name="CreateSchedule"
              component={GuardedCreateSchedule}
              options={{ headerShown: true, title: 'Add Class' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
