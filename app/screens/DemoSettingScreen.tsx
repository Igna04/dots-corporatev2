/* eslint-disable react-native/no-color-literals */
/* eslint-disable import/no-duplicates */
import React, { FC, useState } from "react"
import { View, ViewStyle, StyleSheet, Image, ImageStyle, TextStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import { Drawer } from "react-native-drawer-layout"
import { isRTL } from "../i18n"
import { CustomDrawer } from "./CustomDrawer"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"
import { openLinkInBrowser } from "app/utils/openLinkInBrowser"

export const DemoDebugScreen: FC<DemoTabScreenProps<"DemoDebug">> = function DemoDebugScreen(
  _props,
) {
  const {
    authenticationStore: { logout },
  } = useStores()

  const [open, setOpen] = useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
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
          <Button
            style={$bluetoothButton}
            onPress={() => openLinkInBrowser("https://bluetooth-settings-url")}
          >
            <View style={$buttonContent}>
              <Image source={require("../assets/img/Bluetooth.png")} style={$bluetoothIcon} />
              <Text style={$bluetoothButtonText}>Konfigurasi Bluetooth</Text>
            </View>
          </Button>
        </View>

        <View style={$buttonContainer}>
          <Button style={$logoutButton} onPress={logout}>
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
    backgroundColor: "white",
    flexDirection: "row",
    paddingVertical: spacing.sm,
    position: "absolute",
    top: 0,
    width: "109%",
    zIndex: 10,
  },
  headerText: {
    color: "#000",
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
  backgroundColor: "#FFFFFF",
  borderRadius: 5,
  marginTop: spacing.md,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderColor: "#0000FF",
  borderWidth: 1,
  flexDirection: "row",
  alignItems: "center",
}

const $buttonContent: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $bluetoothIcon: ImageStyle = {
  width: 20,
  height: 20,
  marginRight: spacing.sm,
}

const $bluetoothButtonText: TextStyle = {
  color: "#000000",
}

const $buttonContainer: ViewStyle = {
  position: "absolute",
  right: spacing.lg,
  bottom: spacing.lg,
}

const $logoutButton: ViewStyle = {
  backgroundColor: "#FF0000",
  borderRadius: 5,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  flexDirection: "row",
  alignItems: "center",
}

const $logoutButtonText: TextStyle = {
  color: "#FFFFFF",
  marginLeft: spacing.sm,
}

const $logoutIcon: ImageStyle = {
  width: 20,
  height: 20,
}
