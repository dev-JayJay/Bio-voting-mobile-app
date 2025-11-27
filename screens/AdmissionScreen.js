// screens/AdmissionScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";

export default function AdmissionScreen({ navigation }) {
  const [admissionNumber, setAdmissionNumber] = useState("");

  const proceed = () => {
    if (!admissionNumber.trim()) {
      Alert.alert("Error", "Please enter your admission number.");
      return;
    }

    // Navigate to the candidate list (HomeScreen)
    navigation.navigate("Tab", {
      screen: "HomeTab",
      params: { userId: admissionNumber },
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>UDUS E-Voting System</Text>
        <Text style={styles.subtitle}>Student Verification</Text>
      </View>

      {/* Instruction */}
      <Text style={styles.info}>
        Please enter your admission number to proceed to voting.
      </Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="2020310022"
        keyboardType="number-pad"
        placeholderTextColor="#888"
        value={admissionNumber}
        onChangeText={setAdmissionNumber}
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={proceed}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <View style={{ paddingTop: 10 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AdminLogin")}
        >
          <Text style={styles.buttonText}>Login As Admin</Text>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity
        onLongPress={() => navigation.navigate("AdminLogin")}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 30,
          height: 30,
        }}
      >
        <View />
        <Text>checking</Text>
      </TouchableOpacity> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E88E5",
  },

  subtitle: {
    fontSize: 15,
    color: "#555",
    marginTop: 5,
  },

  info: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    elevation: 3,
    marginBottom: 25,
  },

  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
