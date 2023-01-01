import { Camera, CameraType } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";

export default function App() {
  let cameraRef = useRef();
  let ratio = undefined;
  let suggestedRatio;
  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    requestPermission;
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  const onCameraReadyHandler = async () => {
    setIsCameraReady(true);
    ratio = await cameraRef.current.getSupportedRatiosAsync();
    console.log(ratio);
    suggestedRatio = ratio.pop();
    console.log(suggestedRatio);
  };

  return (
    <View style={styles.container}>
      <StatusBar style='hidden' />
      <Camera
        style={styles.camera}
        type={type}
        ratio={"20:9"}
        ref={cameraRef}
        onCameraReady={onCameraReadyHandler}
      ></Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("screen").height,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
