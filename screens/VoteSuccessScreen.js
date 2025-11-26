// screens/VoteSuccessScreen.js
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function VoteSuccessScreen({ route, navigation }) {
  const { candidate, userId } = route.params;

  useEffect(() => {
    const recordVote = async () => {
      // Store voted user IDs
      const votedUsers =
        JSON.parse((await AsyncStorage.getItem("votedUsers")) || "[]") || [];

      if (!votedUsers.includes(userId)) {
        votedUsers.push(userId);
      }

      await AsyncStorage.setItem("votedUsers", JSON.stringify(votedUsers));

      // Store admission numbers
      const admissionNumbers =
        JSON.parse(
          (await AsyncStorage.getItem("votedAdmissionNumbers")) || "[]"
        ) || [];

      if (!admissionNumbers.includes(userId)) {
        admissionNumbers.push(userId);
      }

      await AsyncStorage.setItem(
        "votedAdmissionNumbers",
        JSON.stringify(admissionNumbers)
      );
    };

    recordVote();
  }, [userId]);

  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle" size={110} color="#2ecc71" />

      <Text style={styles.title}>Vote Successful!</Text>

      <Text style={styles.message}>
        You have successfully cast your vote for:
      </Text>

      <View style={styles.candidateCard}>
        <Text style={styles.candidateName}>{candidate.name}</Text>
        <Text style={styles.details}>
          {candidate.department} • {candidate.position}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.resultsButton}
        onPress={() =>
          navigation.navigate("Tab", {
            screen: "ResultTab",
            params: { userId },
          })
        }
      >
        <Text style={styles.resultsText}>View Results</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Admission")}
      >
        <Text style={styles.homeText}>Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2ecc71",
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
  },
  candidateCard: {
    backgroundColor: "white",
    marginTop: 25,
    padding: 20,
    borderRadius: 12,
    width: "100%",
    elevation: 3,
    alignItems: "center",
  },
  candidateName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  details: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  resultsButton: {
    marginTop: 30,
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  resultsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  homeButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  homeText: {
    color: "#1E88E5",
    fontSize: 16,
    fontWeight: "600",
  },
});
