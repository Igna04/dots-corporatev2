/* eslint-disable react-native/no-color-literals */
// DemoShowroomScreen.tsx
import React, { FC, useState, useEffect } from "react"
import { View, ViewStyle, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Screen } from "../components"
import { isRTL } from "../i18n"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { CustomDrawer } from "./CustomDrawer" 

export const DemoShowroomScreen: FC<DemoTabScreenProps<"DemoShowroom">> = function DemoShowroomScreen(_props) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const navigation = useNavigation()

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('authToken')
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const username = decodedToken.user?.username
        if (username) setUsername(username)
      } catch (error) {
        console.error("Failed to decode token:", error)
      }
    }
  }

  useEffect(() => {
    fetchToken()
  }, [])

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="back"
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={() => <CustomDrawer />} 
    >
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
        <View style={styles.headerContainer}>
          <DrawerIconButton onPress={toggleDrawer} />
          <Text style={styles.headerText}>BPR Dev</Text>
        </View>

        <Text style={styles.welcomeText}>
          Selamat Datang, <Text style={styles.userName}>{username || "User"}</Text>
        </Text>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.lookAllBatch} onPress={() => navigation.navigate("AllBatch")}>
              <Text style={styles.buttonText}>LIHAT SEMUA BATCH</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.beginEndBatch} onPress={() => console.log("Selesai Batch pressed")}>
              <Text style={styles.buttonText}>SELESAI BATCH</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    </Drawer>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
  padding: spacing.md,
  backgroundColor: "#f4f4f4",
}

// Updated styles for header
const styles = StyleSheet.create({
  beginEndBatch: {
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonWrapper: {
    marginBottom: spacing.md,
    width: "100%",
  },

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
  lookAllBatch: {
    alignItems: "center",
    backgroundColor: "#0044cc",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  userName: {
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 18,
    marginTop: 90,
    marginVertical: spacing.xl,
  },
})



export default DemoShowroomScreen
