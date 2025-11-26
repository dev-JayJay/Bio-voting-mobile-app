// screens/ResultScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ResultScreen({ route, navigation }) {
  const userId = route?.params?.userId ?? null;

   console.log("User ID:", userId);

  const candidates = [
    {
      id: "1",
      name: "Abiola Adeyemi",
      department: "Computer Science",
      position: "SUG President",
    },
    {
      id: "2",
      name: "Chukwuemeka Okafor",
      department: "Mechanical Engineering",
      position: "Vice President",
    },
    {
      id: "3",
      name: "Fatimah Bello",
      department: "Mass Communication",
      position: "General Secretary",
    },
  ];

  // Demo votes — later you will fetch from backend
  const [results] = useState([
    { id: "1", votes: 10 },
    { id: "2", votes: 7 },
    { id: "3", votes: 4 },
  ]);

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

  const getVotes = (candidateId) => {
    const record = results.find((r) => r.id === candidateId);
    return record ? record.votes : 0;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UDUS E-Voting</Text>
        <Text style={styles.headerSubtitle}>Election Results</Text>
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Total Votes Cast: <Text style={styles.bold}>{totalVotes}</Text>
        </Text>
      </View>

      {/* Result Cards */}
      <View style={{ marginTop: 20 }}>
        {candidates.map((candidate) => {
          const votes = getVotes(candidate.id);
          const percentage =
            totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;

          return (
            <View key={candidate.id} style={styles.card}>
              <Text style={styles.candidateName}>{candidate.name}</Text>
              <Text style={styles.details}>
                {candidate.department} • {candidate.position}
              </Text>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${percentage}%` },
                  ]}
                />
              </View>

              <Text style={styles.voteText}>
                {votes} votes • {percentage}%
              </Text>
            </View>
          );
        })}
      </View>
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
    fontSize: 24,
    fontWeight: "800",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e0e0",
  },

  summaryBox: {
    backgroundColor: "white",
    marginTop: 20,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
    color: "#1E88E5",
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },

  progressBarContainer: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#1E88E5",
    borderRadius: 10,
  },

  voteText: {
    fontSize: 14,
    color: "#555",
  },
});
