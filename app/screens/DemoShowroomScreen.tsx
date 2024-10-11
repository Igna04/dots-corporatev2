/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
// DemoShowroomScreen.tsx
import React, { FC, useState, useEffect } from "react"
import { View, ViewStyle, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Screen } from "../components"
import { isRTL } from "../i18n"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { CustomDrawer } from "./CustomDrawer"

export const DemoShowroomScreen: FC<DemoTabScreenProps<"DemoShowroom">> = function DemoShowroomScreen(_props) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const navigation = useNavigation()

  const [showAttendance, setShowAttendance] = useState(false); // state to handle the attendance component

  const handleBatchPress = async () => {
    const kodeKantor = await AsyncStorage.getItem('kodeKantor')
    const token = await AsyncStorage.getItem('authToken')
    const isActive = true
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const username = decodedToken.user?.username
        const createdBy = decodedToken.user?.id
        console.log(username)
        console.log(createdBy)
      } catch (error) {
        console.error("Failed to decode token:", error)
      }
    }
    console.log(kodeKantor)
    console.log(isActive)

    setShowAttendance(true); // When button is pressed, show attendance component

  };

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

  const handleEndBatch = () => {
    setShowAttendance(false); // Sembunyikan attendance component
  };

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

        <View style={styles.buttonContainer}>
          <Text style={styles.welcomeText}>
            Selamat Datang, <Text style={styles.userName}>{username || "User"}</Text>
          </Text>
          {!showAttendance && (
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.beginEndBatch} onPress={handleBatchPress}>
                <Text style={styles.buttonText}>Mulai Batch</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {showAttendance && (
          <View style={styles.attendanceContainer}>
            <Text style={styles.timeText}>06:12 PM</Text>
            <Text style={styles.dateText}>Fri, 26 Jan 2020</Text>
            <View style={styles.scheduleCard}>
              <Text style={styles.scheduleText}>Schedule: 26 Jan 2020</Text>
              <Text style={styles.timeRangeText}>08:00 AM - 05:00 PM</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.historyButton}>
                  <Text style={styles.buttonText}>History Batch</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.endBatch} onPress={handleEndBatch}>
                  <Text style={styles.buttonText}>Hentikan Batch</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Screen>
    </Drawer>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
  padding: spacing.md,
  backgroundColor: "#e0e0e0",
}

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
    fontSize: 22,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 20,
    marginTop: 100,
    marginVertical: spacing.xl,
    color: "#333",
  },
  userName: {
    fontWeight: "bold",
    color: "black",
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  buttonWrapper: {
    marginBottom: spacing.md,
    width: "100%",
  },
  beginEndBatch: {
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  attendanceContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#2f86ff',
  },
  dateText: {
    fontSize: 18,
    color: '#999',
  },
  scheduleCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 16,
    color: '#333',
  },
  timeRangeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 15,
  },
  historyButton: {
    marginHorizontal: 10,
    backgroundColor: colors.primaryColor,
    padding: 10,
    borderRadius: 5,
  },
  endBatch: {
    marginHorizontal: 10,
    backgroundColor: '#d10404',
    padding: 10,
    borderRadius: 5,
  },
})

export default DemoShowroomScreen
