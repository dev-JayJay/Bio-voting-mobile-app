// screens/AdminScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; 

export default function AdminScreen({ navigation, userId }) {
  const API_URL = "https://bio-mobile-server.vercel.app";

  // Session
  const [sessionName, setSessionName] = useState("");
  const [sessionActive, setSessionActive] = useState(false);

  // Positions & Candidates
  const [positions, setPositions] = useState([]); 
  const [loadingPositions, setLoadingPositions] = useState(true);

  const [candidates, setCandidates] = useState([]); 
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  // Form for adding position / candidate
  const [newPosition, setNewPosition] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    // initial load
    fetchPositions();
    fetchCandidates();
    fetchSession();
  }, []);

  // ---------- Fetchers ----------
  const fetchPositions = async () => {
    setLoadingPositions(true);
    try {
      const res = await axios.get(`${API_URL}/position/list`);
      // If server response shape is { success: true, positions: [...] } handle it:
      const data = res.data.positions ?? res.data;
      setPositions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchPositions:", err?.message ?? err);
      Alert.alert("Error", "Could not load positions from server");
    } finally {
      setLoadingPositions(false);
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await axios.get(`${API_URL}/candidate/list`);
      // server earlier used { success: true, candidates }
      const data = res.data.candidates ?? res.data;
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchCandidates:", err?.message ?? err);
      Alert.alert("Error", "Failed to fetch candidates");
    } finally {
      setLoadingCandidates(false);
    }
  };

  const fetchSession = async () => {
    try {
      const res = await axios.get(`${API_URL}/session/active`);
      const active = !!(res.data?.session ?? res.data);
      setSessionActive(active);
    } catch (err) {
      console.error("fetchSession:", err?.message ?? err);
    }
  };

  // ---------- Actions ----------
  const createSession = async () => {
    if (!sessionName.trim()) {
      Alert.alert("Error", "Please enter a session name");
      return;
    }
    try {
      await axios.post(`${API_URL}/session/start`, { name: sessionName });
      setSessionActive(true);
      Alert.alert("Success", `Session "${sessionName}" started`);
    } catch (err) {
      console.error("createSession:", err?.message ?? err);
      Alert.alert("Error", "Failed to start session");
    }
  };

  const endSession = async () => {
    try {
      await axios.post(`${API_URL}/session/end`);
      setSessionActive(false);
      Alert.alert("Success", "Voting session ended");
    } catch (err) {
      console.error("endSession:", err?.message ?? err);
      Alert.alert("Error", "Failed to end session");
    }
  };

  const addPosition = async () => {
    if (!newPosition.trim()) {
      Alert.alert("Error", "Please enter a position name");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/position/add`, {
        name: newPosition.trim(),
      });
      setNewPosition("");
      console.log("just added the position", response);
      await fetchPositions();
      Alert.alert("Success", "Position added");
    } catch (err) {
      // console.error("addPosition:", err?.message ?? err);
      console.error("addPosition:", err);
      // Alert.alert("Error", "Failed to add position");
    }
  };

  const addCandidate = async () => {
    if (!candidateName.trim() || !department.trim() || !selectedPositionId) {
      Alert.alert(
        "Error",
        "Please fill candidate name, department and select a position"
      );
      return;
    }

    try {
      await axios.post(`${API_URL}/candidate/add`, {
        name: candidateName.trim(),
        department: department.trim(),
        positionId: selectedPositionId,
      });

      setCandidateName("");
      setDepartment("");
      await fetchCandidates();
      Alert.alert("Success", "Candidate added");
    } catch (err) {
      console.error("addCandidate:", err?.message ?? err);
      Alert.alert("Error", "Failed to add candidate");
    }
  };

  const clearCandidates = async () => {
    try {
      await axios.delete(`${API_URL}/candidate/clear`);
      setCandidates([]);
      Alert.alert("Success", "Candidates cleared");
    } catch (err) {
      console.error("clearCandidates:", err?.message ?? err);
      Alert.alert("Error", "Failed to clear candidates");
    }
  };

  const groupedByPosition = {};
  candidates.forEach((c) => {
    const posId =
      c.position && typeof c.position === "object"
        ? c.position._id
        : c.position;
    const posName =
      c.position && typeof c.position === "object"
        ? c.position.name
        : (c.positionName ?? c.position);
    if (!groupedByPosition[posId])
      groupedByPosition[posId] = { name: posName || "Unknown", list: [] };
    groupedByPosition[posId].list.push(c);
  });

  const orphanPositionKeys = Object.keys(groupedByPosition).filter(
    (pid) => !positions.find((p) => p._id === pid)
  );

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

      {/* Position Creation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Position</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="e.g. President"
            value={newPosition}
            onChangeText={setNewPosition}
          />
          <TouchableOpacity
            style={[styles.button, { paddingHorizontal: 16 }]}
            onPress={addPosition}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ marginTop: 10, color: "#555" }}>
          Existing positions:
        </Text>
        {loadingPositions ? (
          <ActivityIndicator size="small" style={{ marginTop: 8 }} />
        ) : positions.length === 0 ? (
          <Text style={{ color: "#777", marginTop: 8 }}>No positions yet</Text>
        ) : (
          <View style={{ marginTop: 8 }}>
            {positions.map((p) => (
              <Text key={p._id} style={{ paddingVertical: 6 }}>
                • {p.name}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Add Candidate */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Candidate</Text>

        <Text style={{ marginBottom: 6, color: "#555" }}>Select Position</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedPositionId}
            onValueChange={(val) => setSelectedPositionId(val)}
          >
            <Picker.Item label="-- Select position --" value="" />
            {positions.map((p) => (
              <Picker.Item key={p._id} label={p.name} value={p._id} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
        />
        <TextInput
          style={styles.input}
          placeholder="Candidate Name"
          value={candidateName}
          onChangeText={setCandidateName}
        />

        <TouchableOpacity style={styles.button} onPress={addCandidate}>
          <Text style={styles.buttonText}>Add Candidate</Text>
        </TouchableOpacity>
      </View>

      {/* Candidate List grouped by position */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Candidates</Text>

        {(loadingCandidates || loadingPositions) && (
          <ActivityIndicator size="large" color="#1E88E5" />
        )}

        {!loadingCandidates && candidates.length === 0 && (
          <Text style={{ color: "#555" }}>No candidates added</Text>
        )}

        {!loadingCandidates && candidates.length > 0 && (
          <>
            {/* Render in positions order */}
            {positions.map((pos) => {
              const group = groupedByPosition[pos._id];
              if (!group || group.list.length === 0) return null;
              return (
                <View key={pos._id} style={styles.positionBlock}>
                  <Text style={styles.positionTitle}>{pos.name}</Text>
                  {group.list.map((c) => (
                    <View key={c._id} style={styles.candidateCard}>
                      <Text style={styles.candidateName}>{c.name}</Text>
                      <Text style={styles.candidateDetail}>
                        {c.department} • {pos.name}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}

            {/* Render any orphaned position groups (candidates whose position wasn't in positions[]) */}
            {orphanPositionKeys.map((pid) => {
              const group = groupedByPosition[pid];
              return (
                <View key={pid} style={styles.positionBlock}>
                  <Text style={styles.positionTitle}>
                    {group.name ?? "Unknown Position"}
                  </Text>
                  {group.list.map((c) => (
                    <View key={c._id} style={styles.candidateCard}>
                      <Text style={styles.candidateName}>{c.name}</Text>
                      <Text style={styles.candidateDetail}>
                        {c.department} • {group.name}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </>
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
        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={() =>
            navigation.navigate("AdminResult", { userId })
          }
        >
          <Text style={styles.buttonText}>View Results</Text>
        </TouchableOpacity>
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
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 10,
    overflow: "hidden",
  },
  positionBlock: { marginBottom: 16 },
  positionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  candidateCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  candidateName: { fontSize: 16, fontWeight: "700" },
  candidateDetail: { fontSize: 14, color: "#555" },
});
