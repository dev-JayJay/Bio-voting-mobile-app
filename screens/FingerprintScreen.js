// screens/FingerprintScreen.js
import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FingerprintScreen({ route, navigation }) {
  const { candidate, userId } = route.params;

  const verifyFingerprint = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        "Biometrics Not Available",
        "Your device does not support fingerprint authentication."
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirm your identity",
    });

    if (result.success) {
      Alert.alert("Vote Confirmed", `You voted for ${candidate.name}`);
      navigation.navigate("VoteSuccess", { candidate, userId });
    } else {
      Alert.alert("Authentication Failed", "Fingerprint not recognized.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UDUS E-Voting</Text>
        <Text style={styles.headerSubtitle}>Fingerprint Verification</Text>
      </View>

      {/* Candidate Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Voter ID:</Text>
        <Text style={styles.value}>{userId}</Text>

        <Text style={styles.label}>Selected Candidate:</Text>
        <Text style={styles.value}>{candidate.name}</Text>

        <Text style={styles.valueSmall}>
          {candidate.department} • {candidate.position}
        </Text>
      </View>

      {/* Fingerprint Icon */}
      <View style={styles.fingerprintArea}>
        <MaterialCommunityIcons
          name="fingerprint"
          size={130}
          color="#1E88E5"
        />
        <Text style={styles.scanText}>Place your finger on your device sensor</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.verifyButton} onPress={verifyFingerprint}>
        <Text style={styles.verifyText}>Verify Fingerprint</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7fb" },

  header: {
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: "center",
    backgroundColor: "#1E88E5",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e0e0",
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  label: {
    color: "#777",
    fontSize: 14,
    marginTop: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  valueSmall: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
  },

  fingerprintArea: {
    marginTop: 40,
    alignItems: "center",
  },
  scanText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
  },

  verifyButton: {
    marginTop: 40,
    alignSelf: "center",
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  verifyText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
