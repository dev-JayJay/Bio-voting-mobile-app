import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";

export default function AdminResultScreen() {
  const [groupedResults, setGroupedResults] = useState({});
  const [loading, setLoading] = useState(true);

  const API_URL = "https://bio-mobile-server.vercel.app";

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_URL}/candidate/list`);

      if (res.data.success && res.data.candidates) {
        const candidates = res.data.candidates;

        // GROUP BY POSITION NAME
        const groups = {};
        candidates.forEach((c) => {
          const posName = c.position?.name || "Unknown Position"; // fallback if missing

          if (!groups[posName]) groups[posName] = [];
          groups[posName].push(c);
        });

        setGroupedResults(groups);
      } else {
        Alert.alert("Error", "Failed to load election results");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch results from server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UDUS E-Voting</Text>
        <Text style={styles.headerSubtitle}>Election Results</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1E88E5"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView style={{ marginTop: 20 }}>
          {Object.keys(groupedResults).map((positionName) => {
            const candidates = groupedResults[positionName];

            const totalVotes = candidates.reduce(
              (sum, c) => sum + (c.votes || 0),
              0
            );

            return (
              <View key={positionName} style={styles.positionSection}>
                <Text style={styles.positionTitle}>{positionName}</Text>

                <Text style={styles.positionSummary}>
                  Total Votes: {totalVotes}
                </Text>

                {candidates.map((c) => {
                  const votes = c.votes || 0;
                  const percentage =
                    totalVotes > 0
                      ? ((votes / totalVotes) * 100).toFixed(1)
                      : 0;

                  return (
                    <View key={c._id} style={styles.card}>
                      <Text style={styles.candidateName}>{c.name}</Text>
                      <Text style={styles.details}>{c.department}</Text>

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
            );
          })}
        </ScrollView>
      )}
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

  positionSection: {
    marginBottom: 30,
    marginHorizontal: 20,
  },

  positionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E88E5",
    marginBottom: 5,
  },

  positionSummary: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
  },
  candidateName: { fontSize: 18, fontWeight: "700", marginBottom: 3 },
  details: { fontSize: 14, color: "#666", marginBottom: 10 },

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

  voteText: { fontSize: 14, color: "#555" },
});
