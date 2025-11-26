import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeScreen";
import ResultScreen from "./screens/ResultScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ route }) {
  
  const userId = route?.params?.userId ?? null;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1E88E5",
        tabBarInactiveTintColor: "#777",
        tabBarStyle: {
          paddingVertical: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: "Vote",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="how-to-vote" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ResultTab"
        component={ResultScreen}
        initialParams={{ userId }}
        options={{
          tabBarLabel: "Results",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="poll" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
