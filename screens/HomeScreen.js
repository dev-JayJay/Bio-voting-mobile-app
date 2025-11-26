import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function HomeScreen({ navigation, route  }) {
      const { userId } = route.params;
  const [votedUsers, setVotedUsers] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("votedUsers").then((data) => {
      if (data) setVotedUsers(JSON.parse(data));
    });
  }, []);

  const handleVote = async (candidate) => {

    if (votedUsers.includes(userId)) {
      Alert.alert("Error", "You have already cast your vote!");
      return;
    }

    navigation.navigate("FaceVerification", { candidate, userId });
  };

  const clearVotedUsers = async () => {
    try {
      // Remove both voted users and admission numbers
      await AsyncStorage.removeItem("votedUsers");
      await AsyncStorage.removeItem("votedAdmissionNumbers");

      Alert.alert("Success", "All vote records have been cleared.");
    } catch (error) {
      console.error("Failed to clear votes:", error);
      Alert.alert("Error", "Failed to clear vote records.");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        paddingVertical: 40,
        backgroundColor: "#f7f7f7",
      }}
    >
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

      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id}
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
              📘 Department:{" "}
              <Text style={{ fontWeight: "600" }}>{item.department}</Text>
            </Text>

            <Text style={{ fontSize: 16, color: "#333", marginTop: 3 }}>
              🎯 Position:{" "}
              <Text style={{ fontWeight: "600" }}>{item.position}</Text>
            </Text>

            {/* Vote Button */}
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
      {/* <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: "red",
          borderRadius: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
        onPress={clearVotedUsers}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Reset Votes</Text>
      </TouchableOpacity> */}
    </View>
  );
}
