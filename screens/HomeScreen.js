import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function HomeScreen({ navigation, route }) {
  const { userId } = route.params;

  const [votedUsers, setVotedUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://bio-mobile-server.vercel.app";

  useEffect(() => {
    AsyncStorage.getItem("votedUsers").then((data) => {
      if (data) setVotedUsers(JSON.parse(data));
    });

    fetchCandidates();
  }, []);

  console.log("checking hte cnaididate", candidates);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_URL}/candidate/list`);
      setCandidates(res.data.candidates);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (candidate) => {
    if (votedUsers.includes(userId)) {
      Alert.alert("Error", "You have already cast your vote!");
      return;
    }

    navigation.navigate("FaceVerification", { candidate, userId });
  };

  return (
    <View style={{ flex: 1, padding: 20, paddingVertical: 40, backgroundColor: "#f7f7f7" }}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        UDUS E-Voting System
      </Text>

      <Text
        style={{
          fontSize: 16,
          marginBottom: 20,
          textAlign: "center",
          color: "#555",
        }}
      >
        Select a candidate to cast your vote
      </Text>

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#0055ff" />}

      {/* No Candidates */}
      {!loading && candidates.length === 0 && (
        <Text style={{ textAlign: "center", color: "#555", marginTop: 20 }}>
          No candidates available
        </Text>
      )}

      {/* Candidate List */}
      <FlatList
        data={candidates}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 18,
              backgroundColor: "white",
              marginBottom: 12,
              borderRadius: 12,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "600" }}>{item.name}</Text>

            <Text style={{ fontSize: 16, color: "#333", marginTop: 5 }}>
              📘 Department: <Text style={{ fontWeight: "600" }}>{item.department}</Text>
            </Text>

            <Text style={{ fontSize: 16, color: "#333", marginTop: 3 }}>
              🎯 Position: <Text style={{ fontWeight: "600" }}>{item.position}</Text>
            </Text>

            <TouchableOpacity
              onPress={() => handleVote(item)}
              style={{
                marginTop: 15,
                backgroundColor: "#007bff",
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                Vote
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
