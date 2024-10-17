import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter } from 'expo-router';
import { Button, Pressable } from 'react-native';

import Colors, { COLORS } from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

// TabBarIcon Component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />;
}

// TabLayout Component
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = useTheme().colors;

  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].text,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].text,
        tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabIconSelected,
        tabBarInactiveBackgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        // Disable the static render of the header on web
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          borderTopColor: Colors[colorScheme ?? 'light'].background,
        },

        headerShown: useClientOnlyValue(false, true),
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          height: 70,
        },

      }}>

      <Tabs.Screen
        name="index"
        options={{
          href: null,
          //title: 'Home', go to _layout of entries
        }} 
      />

      <Tabs.Screen
        name="entries"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false, 
          //headerTitle: '',

        }}
      />

      <Tabs.Screen
        name="addEntry"
        options={{
          title: 'New Entry',
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="edit-3" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
