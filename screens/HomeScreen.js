import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function HomeScreen({ navigation, route }) {
  const { userId } = route.params;

  const [votedUsers, setVotedUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState({});

  const API_URL = "https://bio-mobile-server.vercel.app";

  useEffect(() => {
    AsyncStorage.getItem("votedUsers").then((data) => {
      if (data) setVotedUsers(JSON.parse(data));
    });
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_URL}/candidate/list`);
      const list = res.data.candidates;
      setCandidates(list);

      // Group by position name
      const groups = {};
      list.forEach((c) => {
        const posName = c.position.name;
        if (!groups[posName]) groups[posName] = [];
        groups[posName].push(c);
      });
      setGrouped(groups);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const selectCandidate = (candidate) => {
    const posName = candidate.position.name;
    setSelectedCandidates((prev) => ({
      ...prev,
      [posName]: candidate,
    }));
  };

  const submitVotes = () => {
    if (votedUsers.includes(userId)) {
      Alert.alert("Error", "You have already cast your vote!");
      return;
    }

    const selectedCount = Object.keys(selectedCandidates).length;
    if (selectedCount === 0) {
      Alert.alert("Error", "Please select at least one candidate to vote for.");
      return;
    }

    // Navigate to face verification with all selected candidates
    navigation.navigate("FaceVerification", {
      selectedCandidates,
      userId,
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, padding: 20, paddingVertical: 40, backgroundColor: "#f7f7f7" }}
    >
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 10, textAlign: "center" }}>
        UDUS E-Voting System
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 20, textAlign: "center", color: "#555" }}>
        Select one candidate per position
      </Text>

      {loading && <ActivityIndicator size="large" color="#0055ff" />}

      {!loading && candidates.length === 0 && (
        <Text style={{ textAlign: "center", color: "#555", marginTop: 20 }}>
          No candidates available
        </Text>
      )}

      {/* Grouped Candidates */}
      {Object.keys(grouped).map((position) => (
        <View key={position} style={{ marginBottom: 25 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
            {position}
          </Text>

          {grouped[position].map((item) => {
            const isSelected = selectedCandidates[position]?._id === item._id;
            return (
              <TouchableOpacity
                key={item._id}
                onPress={() => selectCandidate(item)}
                style={{
                  padding: 18,
                  backgroundColor: isSelected ? "#1E88E5" : "white",
                  marginBottom: 12,
                  borderRadius: 12,
                  elevation: 3,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "600", color: isSelected ? "white" : "black" }}>
                  {item.name}
                </Text>

                <Text style={{ fontSize: 16, color: isSelected ? "white" : "#333", marginTop: 5 }}>
                  📘 Department: <Text style={{ fontWeight: "600" }}>{item.department}</Text>
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={submitVotes}
        style={{
          backgroundColor: "#1E88E5",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 20,
          marginBottom: 60,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Submit Your Vote
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
