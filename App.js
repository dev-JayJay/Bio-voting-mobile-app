import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdmissionScreen from "./screens/AdmissionScreen";
import FaceVerificationScreen from "./screens/FaceVerificationScreen";
import FingerprintScreen from "./screens/FingerprintScreen";
import VoteSuccessScreen from "./screens/VoteSuccessScreen";

import TabNavigator from "./TabNavigator";
import AdminLoginScreen from "./screens/AdminLoginScreen";
import AdminScreen from "./screens/AdminScreen";
import AdminResultScreen from "./screens/AdminResultScreen";

const Stack = createNativeStackNavigator();

export default function App({ route }) {
  const userId = route?.params?.userId ?? null;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Admission"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Admission" component={AdmissionScreen} />
        <Stack.Screen name="Tab" component={TabNavigator} />
        <Stack.Screen
          name="FaceVerification"
          component={FaceVerificationScreen}
        />
        <Stack.Screen name="Fingerprint" component={FingerprintScreen} />
        <Stack.Screen name="VoteSuccess" component={VoteSuccessScreen} />

        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen
          name="AdminScreen"
          initialParams={{ userId }}
          component={AdminScreen}
        />
        <Stack.Screen
          name="AdminResult"
          initialParams={{ userId }}
          component={AdminResultScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
