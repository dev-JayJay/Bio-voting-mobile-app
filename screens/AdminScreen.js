import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";

export default function AdminScreen() {
  const [sessionName, setSessionName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [sessionActive, setSessionActive] = useState(false);

  const API_URL = "https://bio-mobile-server.vercel.app";

  // Fetch current candidates
  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_URL}/candidate/list`);
      setCandidates(res.data.candidates);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch candidates");
    }
  };

  // Check active session on load
  const fetchSession = async () => {
    try {
      const res = await axios.get(`${API_URL}/session/active`);
      setSessionActive(res.data.session !== null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchSession();
  }, []);

  // Start a new voting session
  const createSession = async () => {
    if (!sessionName.trim()) {
      Alert.alert("Error", "Please enter a session name");
      return;
    }
    try {
      await axios.post(`${API_URL}/session/start`, {
        name: sessionName,
      });

      setSessionActive(true);
      Alert.alert("Success", `Session "${sessionName}" started`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to start session");
    }
  };

  // End voting session
  const endSession = async () => {
    try {
      await axios.post(`${API_URL}/session/end`);
      setSessionActive(false);
      Alert.alert("Success", "Voting session ended");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to end session");
    }
  };

  // Add candidate
  const addCandidate = async () => {
    if (!candidateName.trim() || !department.trim() || !position.trim()) {
      Alert.alert("Error", "Please fill all candidate details");
      return;
    }

    try {
      await axios.post(`${API_URL}/candidate/add`, {
        name: candidateName,
        department,
        position,
      });

      setCandidateName("");
      setDepartment("");
      setPosition("");
      fetchCandidates();

      Alert.alert("Success", "Candidate added");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add candidate");
    }
  };

  // Clear candidates and results
  const clearCandidates = async () => {
    try {
      await axios.delete(`${API_URL}/candidate/clear`);
      setCandidates([]);

      Alert.alert("Success", "Candidates cleared");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to clear candidates");
    }
  };

  // Export results (PDF)
  const exportResults = async () => {
    try {
      const res = await axios.get(`${API_URL}/vote/results`);

      Alert.alert("Success", "Results fetched (PDF export coming next)");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch results");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      {/* Session Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voting Session</Text>

        <TextInput
          style={styles.input}
          placeholder="Session Name"
          value={sessionName}
          onChangeText={setSessionName}
        />

        {!sessionActive ? (
          <TouchableOpacity style={styles.button} onPress={createSession}>
            <Text style={styles.buttonText}>Start Session</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={endSession}
          >
            <Text style={styles.buttonText}>End Session</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Add Candidate */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Candidate</Text>

        <TextInput
          style={styles.input}
          placeholder="Candidate Name"
          value={candidateName}
          onChangeText={setCandidateName}
        />
        <TextInput
          style={styles.input}
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
        />
        <TextInput
          style={styles.input}
          placeholder="Position"
          value={position}
          onChangeText={setPosition}
        />

        <TouchableOpacity style={styles.button} onPress={addCandidate}>
          <Text style={styles.buttonText}>Add Candidate</Text>
        </TouchableOpacity>
      </View>

      {/* Candidate List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Candidates</Text>

        {candidates.length === 0 ? (
          <Text style={{ color: "#555" }}>No candidates added</Text>
        ) : (
          <ScrollView nestedScrollEnabled={true}>
            <FlatList
              scrollEnabled={false}
              data={candidates}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.candidateCard}>
                  <Text style={styles.candidateName}>{item.name}</Text>
                  <Text style={styles.candidateDetail}>
                    {item.department} • {item.position}
                  </Text>
                </View>
              )}
            />
          </ScrollView>
        )}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#777" }]}
          onPress={clearCandidates}
        >
          <Text style={styles.buttonText}>Clear Candidates</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.button, { backgroundColor: "#1E88E5", marginTop: 10 }]}
          onPress={exportResults}
        >
          <Text style={styles.buttonText}>Export Results (PDF)</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f7fb" },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  candidateCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  candidateName: { fontSize: 16, fontWeight: "700" },
  candidateDetail: { fontSize: 14, color: "#555" },
});
