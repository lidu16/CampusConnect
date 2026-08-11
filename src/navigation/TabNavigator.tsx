import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../context/AdminContext';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from '../screens/EventsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MaterialsScreen from '../screens/MaterialsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import { theme } from '../theme';

export type TabParamList = {
  Home: undefined;
  Events: undefined;
  Schedule: undefined;
  Materials: undefined;
  Profile: undefined;
  AdminPanel: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const { isAdmin } = useAdmin();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primaryDark },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: 4,
          height: 58,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            Home: ['home', 'home-outline'],
            Events: ['calendar', 'calendar-outline'],
            Schedule: ['time', 'time-outline'],
            Materials: ['document', 'document-outline'],
            AdminPanel: ['shield-checkmark', 'shield-outline'],
            Profile: ['person', 'person-outline'],
          };
          const [active, inactive] = icons[route.name] || ['ellipse', 'ellipse-outline'];
          return (
            <Ionicons
              name={(focused ? active : inactive) as keyof typeof Ionicons.glyphMap}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Announcements' }} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Materials" component={MaterialsScreen} />
      {isAdmin && (
        <Tab.Screen name="AdminPanel" component={AdminPanelScreen} options={{ title: 'Admin' }} />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
