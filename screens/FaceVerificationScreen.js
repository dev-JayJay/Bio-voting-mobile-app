// import { CameraView, useCameraPermissions } from "expo-camera";
// import { useRef, useState } from "react";
// import {
//   View,
//   Button,
//   Text,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import axios from "axios";

// export default function FaceVerificationScreen({ route, navigation }) {
//   const { candidate, userId } = route.params;
//   const cameraRef = useRef(null);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [facing, setFacing] = useState("front");
//   const [permission, requestPermission] = useCameraPermissions();

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Ask for permission
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to access the camera
//         </Text>
//         <Button onPress={requestPermission} title="Grant Permission" />
//       </View>
//     );
//   }

//   const capturePhoto = async () => {
//     if (!cameraRef.current) {
//       Alert.alert("Error", "Camera not ready yet.");
//       return;
//     }

//     if (isCapturing) return;
//     setIsCapturing(true);

//     try {
//       const photo = await cameraRef.current.takePictureAsync({ base64: true });
//       const base64Image = photo.base64;

//       const name = "John Doe";
//       const admissionNumber = "123456";

//       // Send to your mobile server
//       const response = await axios.post("http://192.168.165.95:5001/vote", {
//         name,
//         admissionNumber,
//         candidate,
//         imageBase64: base64Image,
//       });

//       console.log("Server response:", response.data);

//       if (
//         response.data.status === "voteRegistered" ||
//         response.data.status === "newVoter"
//       ) {
//         Alert.alert("Success", `Vote cast for ${candidate} successfully!`);
//         navigation.navigate("VoteSubmit", { candidate, userId });
//       } else if (response.data.error) {
//         Alert.alert("Error", response.data.error);
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Face verification or vote submission failed.");
//     } finally {
//       setIsCapturing(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={capturePhoto}>
//           <Text style={styles.text}>Capture Face</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center" },
//   message: { textAlign: "center", paddingBottom: 10 },
//   camera: { flex: 1 },
//   buttonContainer: {
//     position: "absolute",
//     bottom: 64,
//     width: "100%",
//     alignItems: "center",
//   },
//   button: {
//     backgroundColor: "#1E88E5",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   text: { color: "white", fontWeight: "bold", fontSize: 18 },
// });

import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function FaceVerificationScreen({ route, navigation }) {
  const { candidate, userId } = route.params;
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

        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const captureAndVerify = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);


    navigation.navigate("Fingerprint", { candidate, userId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UDUS E-Voting</Text>
        <Text style={styles.headerSubtitle}>Face Verification</Text>
      </View>

      {/* Candidate Info Card */}
      <View style={styles.candidateCard}>
        <Text style={styles.candidateName}>{candidate.name}</Text>
        <Text style={styles.candidateDetail}>
          Department: <Text style={styles.bold}>{candidate.department}</Text>
        </Text>
        <Text style={styles.candidateDetail}>
          Position: <Text style={styles.bold}>{candidate.position}</Text>
        </Text>
      </View>

      {/* Camera */}
      <View style={styles.cameraWrapper}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

        {/* Overlay */}
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Align your face within the frame</Text>
        </View>
      </View>

      {/* Capture Button */}
      <View style={styles.btnArea}>
        <TouchableOpacity style={styles.captureBtn} onPress={captureAndVerify}>
          <Text style={styles.captureText}>Capture Face</Text>
        </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e0e0",
  },

  candidateCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    elevation: 4,
  },
  candidateName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  candidateDetail: {
    fontSize: 15,
    color: "#333",
    marginTop: 3,
  },
  bold: { fontWeight: "700" },

  cameraWrapper: {
    flex: 1,
    margin: 20,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#1E88E5",
  },

  camera: {
    flex: 1,
  },

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

  btnArea: {
    paddingBottom: 25,
    alignItems: "center",
  },
  captureBtn: {
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    elevation: 3,
  },
  captureText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  // Permission Screen
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
