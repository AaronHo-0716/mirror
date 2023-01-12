import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Platform, Dimensions } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { StatusBar } from "expo-status-bar";

let aspectRatio;

export default function App() {
  //  camera permissions
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  const [ratio, setRatio] = useState("4:3"); // default is 4:3
  const [isRatioSet, setIsRatioSet] = useState(false);

  // on screen  load, ask for permission to use the camera
  useEffect(() => {
    requestPermission();
  }, []);

  const calWidth = dim => {
    aspectRatio = dim[1] / dim[0];
  };

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    if (Platform.OS === "android") {
      const ratios = await camera.getSupportedRatiosAsync();
      let ratio = ratios.pop();
      setRatio(ratio);
      calWidth(ratio.split(":"));
      setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  if (!permission) {
    return (
      <View style={styles.information}>
        <Text>Waiting for camera permissions</Text>
      </View>
    );
  } else if (permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <Camera
          type={CameraType.front}
          style={[styles.cameraPreview]}
          onCameraReady={setCameraReady}
          ratio={ratio}
          ref={ref => {
            setCamera(ref);
          }}
        ></Camera>
      </View>
    );
  } else {
    return (
      <View>
        <Text>Waiting For Permission</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  cameraPreview: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    aspectRatio: aspectRatio,
  },
});
