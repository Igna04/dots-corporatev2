/* eslint-disable no-useless-catch */
/* eslint-disable react-native/no-color-literals */
import React, { FC, useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Screen } from "../components"
import { isRTL } from "../i18n"
import { DemoTabScreenProps, DemoNavigator } from "../navigators/DemoNavigator"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { jwtDecode } from "jwt-decode"
import { CustomDrawer } from "./CustomDrawer"
import { api } from "app/services/api"
import moment from "moment-timezone"
import { colors, spacing } from "app/theme"
import { useNavigation } from "@react-navigation/native"

export const DemoShowroomScreen: FC<DemoTabScreenProps<"DemoShowroom">> =
  function DemoShowroomScreen(_props) {
    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState<string | null>(null)
    const [showAttendance, setShowAttendance] = useState(false)
    const [idBatch, setIdBatch] = useState("")
    const [userId, setUserId] = useState<number | null>(null)
    const [transactionBatch, setTransactionBatch] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isEndingBatch, setIsEndingBatch] = useState(false)
    const [error, setError] = useState(null)
    const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Jakarta"))
    const [startTime, setStartTime] = useState<moment.Moment | null>(null)
    const [elapsedTime, setElapsedTime] = useState<string>("00:00:00")
    const navigation = useNavigation()
    const [trxId, setTrxId] = useState("")
    const [active, setActive] = useState(0)

    useEffect(() => {
      fetchToken()
      const timer = setInterval(() => {
        setCurrentTime(moment().tz("Asia/Jakarta"))
      }, 1000)
      return () => clearInterval(timer)
    }, [])

    useEffect(() => {
      if (startTime) {
        const timer = setInterval(() => {
          const duration = moment.duration(moment().diff(startTime))
          setElapsedTime(
            `${String(duration.hours()).padStart(2, "0")}:${String(duration.minutes()).padStart(
              2,
              "0",
            )}:${String(duration.seconds()).padStart(2, "0")}`,
          )
        }, 1000)
        return () => clearInterval(timer)
      }
    }, [startTime])

    useEffect(() => {
      if (isEndingBatch) {
        const timer = setTimeout(() => {
          setShowAttendance(false)
          setTransactionBatch(null)
          setIdBatch("")
          setError(null)
          setIsEndingBatch(false)
          setStartTime(null)
          setElapsedTime("00:00:00")
        }, 2000)

        return () => clearTimeout(timer)
      }
    }, [isEndingBatch])

    const toggleDrawer = () => setOpen(!open)

    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("authToken")
      console.log(token)
      if (token) {
        try {
          const decodedToken = jwtDecode(token)
          const username = decodedToken.user?.username
          const userId = decodedToken.user?.id
          if (username) setUsername(username)
          if (userId) {
            setUserId(userId)
            console.log("User ID retrieved:", userId) // Tambahkan baris ini
          }
        } catch (error) {
          console.error("Failed to decode token:", error)
        }
      }
    }

    const handleBatchPress = async () => {
      setIsLoading(true)
      try {
        const token = await AsyncStorage.getItem("authToken")
        const branchId = ""
        if (!token || !userId) {
          console.error("No auth token or user ID found.")
          return
        }

        const result = await api.createTransactionBatch(
          String(userId),
          userId,
          1, // status
          branchId, // branchId
          "", // coreTrxGroupId
          true, // isActive
        )

        console.log("API Response:", result)
        setIdBatch(result.id)
        setActive(result.is_active)
        console.log(result)
        console.log("result id" + result.id)
        setTrxId(result.id)
        await fetchTransactionBatch(result.id)
        setStartTime(moment().tz("Asia/Jakarta"))
        setShowAttendance(true)
      } catch (error) {
        console.error("Error in handleBatchPress:", error)
        setError("Failed to start batch. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    const handleEndBatch = async () => {
      setIsEndingBatch(true)
      try {
        if (!idBatch) {
          console.error("No batch ID available")
          return
        }

        setError(null)

        const result = await api.updateTransactionBatch(
          idBatch,
          0,
          moment().tz("Asia/Jakarta").format(),
          userId,
          false,
        )

        if (result && !result.error) {
          console.log("Batch ended successfully:", result)
        } else {
          console.error("Failed to end batch:", result.error || "Unknown error")
          setError("Failed to end the batch. Please try again.")
          setIsEndingBatch(false)
        }
      } catch (err) {
        console.error("Error ending batch:", err)
        setError("An unexpected error occurred while ending the batch")
        setIsEndingBatch(false)
      }
    }

    const handleSejarahBatch = () => {
      navigation.navigate("TransactionHistory", {
        trxId,
        active,
      })
    }

    const fetchTransactionBatch = async (id) => {
      setError(null)
      try {
        const result = await api.getTransactionBatchById(id)
        if (result?.kind === "ok") {
          setTransactionBatch({
            id: result.transactionBatch.id || "N/A",
            status: result.transactionBatch.status || 0,
            created_by: {
              username: result.transactionBatch.created_by?.username || "Unknown",
            },
          })
        } else {
          throw new Error(
            result?.kind === "bad-data"
              ? "Failed to retrieve transaction batch data"
              : "An error occurred",
          )
        }
      } catch (err) {
        throw err
      }
    }

    return (
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerType="back"
        drawerPosition={isRTL ? "right" : "left"}
        renderDrawerContent={() => (
          <CustomDrawer userId={userId} transactionBatchData={transactionBatch} />
        )}
      >
        <Screen
          preset="fixed"
          safeAreaEdges={["top"]}
          contentContainerStyle={styles.screenContainer}
        >
          <StatusBar barStyle="light-content" />
          <View style={styles.headerContainer}>
            <DrawerIconButton onPress={toggleDrawer} />
            <Text style={styles.headerText}>Attendance Dashboard</Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.welcomeText}>
              Welcome, <Text style={styles.userName}>{username || "User"}</Text>
            </Text>

            {!showAttendance && !isEndingBatch && (
              <TouchableOpacity
                style={styles.beginBatchButton}
                onPress={handleBatchPress}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>Start Batch</Text>
              </TouchableOpacity>
            )}

            {isLoading && !showAttendance && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Starting batch...</Text>
              </View>
            )}

            {showAttendance && transactionBatch && !isEndingBatch && (
              <View style={styles.attendanceContainer}>
                <View style={styles.timeContainer}>
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeLabel}>Waktu Mulai</Text>
                    <Text style={styles.timeText}>
                      {startTime ? startTime.format("HH:mm:ss") : "N/A"}
                    </Text>
                  </View>
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeLabel}>Waktu Saat Ini</Text>
                    <Text style={styles.timeText}>{currentTime.format("HH:mm:ss")}</Text>
                  </View>
                </View>
                <Text style={styles.elapsedTimeText}>Lama Batch Aktif: {elapsedTime}</Text>
                <View style={styles.scheduleCard}>
                  <Text style={styles.scheduleText}>Batch ID: {transactionBatch.id || "N/A"}</Text>
                  <Text style={styles.statusText}>
                    Status: {transactionBatch.status === 1 ? "Active" : "Inactive"}
                  </Text>
                  <Text style={styles.createdByText}>
                    Dibuat Oleh: {transactionBatch.created_by?.username || "Unknown"}
                  </Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.historyButton} onPress={handleSejarahBatch}>
                      <Text style={styles.buttonText}>Sejarah Batch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.endBatchButton}
                      onPress={handleEndBatch}
                      disabled={isEndingBatch}
                    >
                      <Text style={styles.buttonTextEnd}>Akhiri Batch</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {isEndingBatch && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Ending batch...</Text>
              </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </Screen>
      </Drawer>
    )
  }

const styles = StyleSheet.create({
  attendanceContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
    marginTop: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "90%",
  },
  beginBatchButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    marginTop: 20,
    overflow: "hidden",
    paddingVertical: 12,
    width: "80%",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    alignItems: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonTextEnd: {
    alignItems: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
  },
  createdByText: {
    color: "#666",
    fontSize: 14,
    marginTop: 5,
  },
  elapsedTimeText: {
    color: "#666",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  endBatchButton: {
    alignItems: "center",
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    overflow: "hidden",
    paddingVertical: 12,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 10,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  historyButton: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    overflow: "hidden",
    paddingVertical: 12,
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    color: "#3498db",
    fontSize: 16,
    marginTop: 10,
  },
  scheduleCard: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    marginTop: 20,
    padding: 20,
    width: "100%",
  },
  scheduleText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  screenContainer: {
    backgroundColor: "#f0f0f0",
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  timeColumn: {
    alignItems: "center",
    flex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  timeLabel: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  timeText: {
    color: "#3498db",
    fontSize: 26,
    fontWeight: "bold",
  },
  userName: {
    color: "#3498db",
    fontWeight: "bold",
  },
  welcomeText: {
    color: "#333",
    fontSize: 24,
    marginTop: 100,
    textAlign: "center",
  },
})

export default DemoShowroomScreen
