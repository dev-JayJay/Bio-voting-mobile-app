import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function FaceVerificationScreen({ route, navigation }) {
  const { selectedCandidates, userId } = route.params;
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Needed</Text>
        <Text style={styles.permissionText}>
          To continue with biometric verification, please enable your camera.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionBtn}
        >
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const captureAndVerify = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    navigation.navigate("Fingerprint", { selectedCandidates, userId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UDUS E-Voting</Text>
        <Text style={styles.headerSubtitle}>Face Verification</Text>
      </View>

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Candidate Summary */}
        <View style={styles.candidateCard}>
          <Text style={styles.summaryTitle}>Your Selections</Text>
          {Object.keys(selectedCandidates).map((pos) => {
            const candidate = selectedCandidates[pos];
            return (
              <View key={candidate._id} style={styles.selectionItem}>
                <Text style={styles.positionLabel}>{pos}</Text>
                <Text style={styles.candidateName}>{candidate.name}</Text>
                <Text style={styles.candidateDetail}>
                  Department:{" "}
                  <Text style={styles.bold}>{candidate.department}</Text>
                </Text>
              </View>
            );
          })}
        </View>

        {/* Camera */}
        <View style={styles.cameraWrapper}>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>
              Align your face within the frame
            </Text>
          </View>
        </View>

        {/* Capture Button */}
        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.captureBtn}
            onPress={captureAndVerify}
          >
            <Text style={styles.captureText}>Capture Face</Text>
          </TouchableOpacity>
        </View>
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

  candidateCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    elevation: 4,
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  selectionItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  positionLabel: { fontSize: 16, fontWeight: "700", color: "#1E88E5" },
  candidateName: { fontSize: 16, fontWeight: "600", marginVertical: 2 },
  candidateDetail: { fontSize: 14, color: "#333" },
  bold: { fontWeight: "700" },

  cameraWrapper: {
    height: 350,
    margin: 20,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#1E88E5",
  },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  overlayText: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    color: "white",
    borderRadius: 20,
    fontSize: 14,
  },

  btnArea: { paddingBottom: 25, alignItems: "center" },
  captureBtn: {
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    elevation: 3,
  },
  captureText: { color: "white", fontSize: 18, fontWeight: "700" },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    alignItems: "center",
    backgroundColor: "#f4f7fb",
  },
  permissionTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  permissionText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  permissionBtn: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  permissionBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
});
