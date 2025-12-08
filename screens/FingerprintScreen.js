import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FingerprintScreen({ route, navigation }) {
  const { selectedCandidates, userId } = route.params;
  const API_URL = "https://bio-mobile-server.vercel.app";

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
    if (!result.success) {
      Alert.alert("Authentication Failed", "Fingerprint not recognized.");
      return;
    }

    submitVotes();
  };

  const submitVotes = async () => {
    try {
      const votesArray = Object.keys(selectedCandidates).map((position) => ({
        position,
        candidateId: selectedCandidates[position]._id,
      }));

      const res = await axios.post(`${API_URL}/vote/cast-multiple`, {
        userId,
        votes: votesArray,
      });

      if (res.data.success) {
        const existing =
          JSON.parse(await AsyncStorage.getItem("votedUsers")) || [];
        existing.push(userId);
        await AsyncStorage.setItem("votedUsers", JSON.stringify(existing));

        navigation.navigate("VoteSuccess", { selectedCandidates, userId });
      } else {
        Alert.alert("Error", res.data.message || "Could not submit vote.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while submitting your vote.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UDUS E-Voting</Text>
        <Text style={styles.headerSubtitle}>Fingerprint Verification</Text>
      </View>

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Candidate Summary */}
        <View style={styles.card}>
          <Text style={styles.summaryTitle}>Your Selections</Text>
          {Object.keys(selectedCandidates).map((pos) => {
            const cand = selectedCandidates[pos];
            return (
              <View key={cand._id} style={styles.selectionItem}>
                <Text style={styles.positionLabel}>{pos}</Text>
                <Text style={styles.candidateName}>{cand.name}</Text>
                <Text style={styles.candidateDetail}>
                  Department: <Text style={styles.bold}>{cand.department}</Text>
                </Text>
              </View>
            );
          })}

          <Text style={[styles.label, { marginTop: 20 }]}>Voter ID:</Text>
          <Text style={styles.value}>{userId}</Text>
        </View>

        {/* Fingerprint Icon */}
        <View style={styles.fingerprintArea}>
          <MaterialCommunityIcons
            name="fingerprint"
            size={130}
            color="#1E88E5"
          />
          <Text style={styles.scanText}>
            Place your finger on your device sensor
          </Text>
        </View>

        {/* Fingerprint Button */}
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={verifyFingerprint}
        >
          <Text style={styles.verifyText}>Verify Fingerprint</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: { fontSize: 22, fontWeight: "700", color: "white" },
  headerSubtitle: { fontSize: 14, color: "#e0e0e0" },

  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  selectionItem: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  positionLabel: { fontSize: 16, fontWeight: "700", color: "#1E88E5" },
  candidateName: { fontSize: 16, fontWeight: "600", marginVertical: 2 },
  candidateDetail: { fontSize: 14, color: "#333" },
  bold: { fontWeight: "700" },

  label: { color: "#777", fontSize: 14, marginTop: 5 },
  value: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 5 },

  fingerprintArea: { marginTop: 40, alignItems: "center" },
  scanText: { marginTop: 15, fontSize: 16, color: "#333" },

  verifyButton: {
    marginTop: 40,
    alignSelf: "center",
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  verifyText: { color: "white", fontWeight: "700", fontSize: 18 },
});
