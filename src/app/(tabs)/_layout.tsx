import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';

// TabBarIcon Component
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// TabLayout Component
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].text,
        tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarInactiveBackgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        // Disable the static render of the header on web
        headerShown: useClientOnlyValue(false, true),
        tabBarHideOnKeyboard: true,

      }}>

      <Tabs.Screen name="index" options={{href: null,  title: 'Home', headerShown: false,}} />
      
      <Tabs.Screen
        name="entries"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false, 
        }}
      />

      <Tabs.Screen
        name="addEntry"
        options={{
          title: 'New Entry',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
