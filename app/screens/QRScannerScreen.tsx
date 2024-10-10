/* eslint-disable react-native/no-color-literals */
import { observer } from "mobx-react-lite";
import React, { FC, useState } from "react";
import { View, ViewStyle, StyleSheet, Alert } from "react-native";
import { Screen, Text } from "../components";
import { DemoTabScreenProps } from "../navigators/DemoNavigator";
import { spacing } from "../theme";
import { RNCamera } from "react-native-camera";

export const QRScannerScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function QRScannerScreen(_props) {
    const [scanned, setScanned] = useState(false);

    const handleBarCodeScanned = ({ data }) => {
      if (!scanned) {
        setScanned(true);
        Alert.alert("QR Code Scanned", data, [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
      }
    };

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>QR Code Scanner</Text>
        </View>

        <View style={$container}>
          <RNCamera
            style={styles.camera}
            type={RNCamera.Constants.Type.back}
            onBarCodeRead={handleBarCodeScanned}
            captureAudio={false}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          />
        </View>
      </Screen>
    );
  },
);

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  flex: 1,
};
// Styles
const styles = StyleSheet.create({
  camera: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

const $screenContentContainer: ViewStyle = {
  flex: 1,
};
