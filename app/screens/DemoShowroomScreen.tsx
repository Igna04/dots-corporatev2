/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-color-literals */
import React, { FC, useState, useEffect } from "react"
import { View, ViewStyle, StyleSheet, Text, TouchableOpacity } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Screen } from "../components"
import { isRTL } from "../i18n"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { CustomDrawer } from "./CustomDrawer"
import { api } from "app/services/api"
import moment from 'moment-timezone'

export const DemoShowroomScreen: FC<DemoTabScreenProps<"DemoShowroom">> = function DemoShowroomScreen(_props) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [showAttendance, setShowAttendance] = useState(false)
  const [idBatch, setIdBatch] = useState("")
  const [userId, setUserId] = useState<number | null>(null)
  const [transactionBatch, setTransactionBatch] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(moment().tz('Asia/Jakarta'))

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const fetchToken = async () => {
    const token = await AsyncStorage.getItem('authToken')
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const username = decodedToken.user?.username
        const userId = decodedToken.user?.id
        if (username) setUsername(username)
        if (userId) setUserId(userId)
      } catch (error) {
        console.error("Failed to decode token:", error)
      }
    }
  }

  const handleBatchPress = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken')
      const isActive = true
      const status = 1
      const coreTrxGroupId = ""
      const branchId = ""

      if (!token) {
        console.error("No auth token found. User might not be logged in.")
        return
      }

      if (!userId) {
        console.error("User ID not found.")
        return
      }

      const result = await api.createTransactionBatch(
        String(userId),
        userId,
        status,
        branchId,
        coreTrxGroupId,
        isActive
      )

      console.log("API Response:", result)
      setIdBatch(result.id)
      setShowAttendance(true)
    } catch (error) {
      console.error("Error in handleBatchPress:", error)
    }
  }

  const handleEndBatch = async () => {
    try {
      if (!idBatch) {
        console.error("No batch ID available");
        return;
      }

      setIsLoading(true);
      setError(null);

      const result = await api.updateTransactionBatch(
        idBatch,
        0,
        moment().tz('Asia/Jakarta').format(),
        userId,
        false
      );

      if (result && !result.error) {
        console.log("Batch ended successfully:", result);
        setTransactionBatch(result);  // Update the state with the new batch data
        setTimeout(() => {
          setShowAttendance(false);
          setTransactionBatch(null);
          setIdBatch("");
          setError(null);
        }, 1000);
      } else {
        console.error("Failed to end batch:", result.error || "Unknown error");
        setError("Failed to end the batch. Please try again.");
      }
    } catch (err) {
      console.error("Error ending batch:", err);
      setError("An unexpected error occurred while ending the batch");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactionBatch = async (id) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await api.getTransactionBatchById(id)
      if (result?.kind === "ok") {
        setTransactionBatch({
          id: result.transactionBatch.id || 'N/A',
          status: result.transactionBatch.status || 0,
          created_by: {
            username: result.transactionBatch.created_by?.username || 'Unknown'
          },
          // Add other properties as needed, with fallback values
        })
      } else if (result?.kind === "bad-data") {
        setError("Failed to retrieve transaction batch data")
      } else {
        setError("An error occurred")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchToken()
  }, [])

  useEffect(() => {
    if (idBatch) {
      fetchTransactionBatch(idBatch)
    }
  }, [idBatch])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().tz('Asia/Jakarta'))
    }, 1000)
    return () => clearInterval(timer)
  }, [])



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().tz('Asia/Jakarta'))
    }, 1000)
    return () => clearInterval(timer)
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
          <Text style={styles.headerText}>Ini Header</Text>
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

        {showAttendance && transactionBatch && (
          <View style={styles.attendanceContainer}>
            <Text style={styles.timeText}>{currentTime.format('HH:mm:ss')}</Text>
            <Text style={styles.dateText}>{currentTime.format('DD MMMM YYYY')} WIB</Text>
            <View style={styles.scheduleCard}>
              <Text style={styles.scheduleText}>Batch ID: {transactionBatch.id || 'N/A'}</Text>
              <Text style={styles.timeRangeText}>
                Status: {transactionBatch.status === 1 ? 'Active' : 'Inactive'}
              </Text>
              <Text style={styles.createdByText}>
                Created by: {transactionBatch.created_by?.username || 'Unknown'}
              </Text>
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

        {isLoading && <Text>Loading...</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
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
  attendanceContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  beginEndBatch: {
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonContainer: {
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonWrapper: {
    marginBottom: spacing.md,
    width: "100%",
  },
  createdByText: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  dateText: {
    color: '#999',
    fontSize: 18,
  },
  endBatch: {
    backgroundColor: '#d10404',
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    flexDirection: "row",
    paddingVertical: spacing.sm,
    position: "absolute",
    top: 0,
    width: "110%",
    zIndex: 10,
  },
  headerText: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "bold",
  },
  historyButton: {
    backgroundColor: colors.primaryColor,
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 10,
  },
  scheduleCard: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginTop: 20,
    padding: 15,
  },
  scheduleText: {
    color: '#333',
    fontSize: 16,
  },
  timeRangeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  timeText: {
    color: '#2f86ff',
    fontSize: 38,
    fontWeight: 'bold',
  },
  userName: {
    color: "black",
    fontWeight: "bold",
  },
  welcomeText: {
    color: "#333",
    fontSize: 20,
    marginTop: 100,
    marginVertical: spacing.xl,
  },
})

export default DemoShowroomScreen