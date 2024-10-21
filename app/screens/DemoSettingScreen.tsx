/* eslint-disable react-native/no-color-literals */
/* eslint-disable import/no-duplicates */

import React, { FC, useState } from "react"
import { View, ViewStyle, StyleSheet, Image, ImageStyle, TextStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { useStores } from "../models"
import { Drawer } from "react-native-drawer-layout"
import { isRTL } from "../i18n"
import { CustomDrawer } from "./CustomDrawer"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const DemoDebugScreen: FC<DemoTabScreenProps<"DemoDebug">> = function DemoDebugScreen(
  _props,
) {
  const {
    authenticationStore: { logout },
  } = useStores()

  const [open, setOpen] = useState(false)

  const navigation = useNavigation()
  const toggleDrawer = () => {
    setOpen(!open)
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken")

      await logout()
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="back"
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={() => <CustomDrawer />}
    >
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$container}>
        <View style={styles.headerContainer}>
          <DrawerIconButton onPress={toggleDrawer} />
          <Text style={styles.headerText}>Pengaturan</Text>
        </View>

        <View style={$content}>
          <Button style={$bluetoothButton} onPress={() => navigation.navigate("Bluetooth")}>
            <View style={$buttonContent}>
              <Image source={require("../assets/img/Bluetooth.png")} style={$bluetoothIcon} />
              <Text style={$bluetoothButtonText}>Konfigurasi Bluetooth</Text>
            </View>
          </Button>
        </View>

        <View style={$buttonContainer}>
          <Button style={$logoutButton} onPress={handleLogout}>
            <View style={$buttonContent}>
              <Image source={require("../assets/img/Move_object.png")} style={$logoutIcon} />
              <Text style={$logoutButtonText}>Keluar</Text>
            </View>
          </Button>
        </View>
      </Screen>
    </Drawer>
  )
}

// Style yang disesuaikan dari DemoPodcastListScreen
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    flexDirection: "row",
    paddingVertical: spacing.sm,
    position: "absolute",
    top: 0,
    width: "109%",
    zIndex: 10,
  },
  headerText: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "bold",
  },
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "#F4F4F4",
  justifyContent: "space-between",
}

const $content: ViewStyle = {
  marginTop: spacing.xxxl + spacing.lg,
  alignItems: "center",
}

const $bluetoothButton: ViewStyle = {
  backgroundColor: "#2196F3",
  borderRadius: 15,
  marginTop: spacing.md,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  flexDirection: "row",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
}

const $buttonContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $bluetoothIcon: ImageStyle = {
  width: 24, // Slightly increase the icon size for better visibility
  height: 24,
  marginRight: spacing.sm,
}

const $bluetoothButtonText: TextStyle = {
  color: "#FFFFFF", // Switch to white text for contrast
  fontSize: 18, // Slightly increase the font size
  fontWeight: "600", // Make the text bold
  marginLeft: spacing.sm,
}

const $buttonContainer: ViewStyle = {
  position: "absolute",
  right: spacing.lg,
  bottom: spacing.lg,
}

const $logoutButton: ViewStyle = {
  backgroundColor: "red", // A softer red color for a modern look
  borderRadius: 15, // Same rounded style as the Bluetooth button
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  flexDirection: "row",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
}
const $logoutButtonText: TextStyle = {
  color: "#FFFFFF", // Keep white text for contrast
  fontSize: 18,
  fontWeight: "600",
  marginLeft: spacing.sm,
}

const $logoutIcon: ImageStyle = {
  width: 24, // Match the icon size for consistency
  height: 24,
}
