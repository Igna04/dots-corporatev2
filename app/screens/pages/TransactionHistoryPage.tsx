/* eslint-disable react-native/no-color-literals */
import React, { useEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import { Screen, Text } from "../../components"
import { RootStackParamList } from "app/screens/pages/navigationTypes"
import { spacing } from "app/theme"
import { api } from "app/services/api"

type TransactionHistoryRouteProp = RouteProp<RootStackParamList, "TransactionHistory">

export const TransactionHistory = () => {
  const navigation = useNavigation()
  const route = useRoute<TransactionHistoryRouteProp>()
  const [responseData, setResponseData] = useState({ transactions: [] })
  const [customerNames, setCustomerNames] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { trxId, active } = route.params || ""

  const fetchTransactionByBatchId = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.getTransactionsByBatchId(trxId)
      setResponseData(response)
      await fetchCustomerNames(response.transactions)
    } catch (err) {
      console.error("Error fetching transaction batch:", err)
      setError("Failed to fetch transaction details. Please try again later.")
      Alert.alert(
        "Error",
        `Failed to fetch transaction batch with ID: ${trxId}. The batch may not exist or there might be a network issue.`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCustomerNames = async (transactions) => {
    const names = {}
    for (const transaction of transactions) {
      if (transaction.saving_id) {
        try {
          const savingResponse = await api.getSavingByAccountNumber(transaction.saving_id)
          console.log("Response for customer names:", JSON.stringify(savingResponse))

          // Check if the response is successful and has the expected structure
          if (savingResponse.kind === "ok" && savingResponse.savingId) {
            const customerData = savingResponse.savingId.customer_data
            if (customerData && customerData.full_name) {
              // Trim whitespace from the full name
              names[transaction.saving_id] = customerData.full_name.trim()
            } else {
              names[transaction.saving_id] = "N/A"
              console.log(`No full name found for saving ID ${transaction.saving_id}`)
            }
          } else {
            names[transaction.saving_id] = "N/A"
            console.log(`Invalid response structure for saving ID ${transaction.saving_id}`)
          }

          console.log(
            `Customer name for saving ID ${transaction.saving_id}:`,
            names[transaction.saving_id],
          )
        } catch (err) {
          console.error(`Error fetching customer name for saving ID ${transaction.saving_id}:`, err)
          names[transaction.saving_id] = "N/A"
        }
      }
    }
    setCustomerNames(names)
    console.log("All customer names:", names)
  }
  useEffect(() => {
    fetchTransactionByBatchId()
  }, [])

  const totalReceived = responseData.transactions.reduce(
    (total, transaction) => total + parseInt(transaction.amount),
    0,
  )

  if (isLoading) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transaction details...</Text>
        </View>
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTransactionByBatchId}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Sejarah Transaksi</Text>
      </View>
      <ScrollView style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Batch ID:</Text>
          <Text style={styles.cardValue}>{responseData.transactions[0]?.batch_id || "N/A"}</Text>

          <Text style={styles.cardText}>Status:</Text>
          <Text style={styles.cardValue}>{active == 1 ? "Active" : "Inactive"}</Text>

          <Text style={styles.cardText}>Total Tunai Diterima:</Text>
          <Text style={styles.cardValue}>Rp.{totalReceived.toLocaleString()}</Text>

          {responseData.transactions.map((transaction, index) => (
            <View key={index} style={styles.detailCard}>
              <Text style={styles.detailTitle}>
                Setoran Tabungan a/n {customerNames[transaction.saving_id] || "N/A"}
              </Text>
              <Text style={styles.detailText}>
                Tanggal: {new Date(transaction.created_at).toLocaleString()}
              </Text>
              <Text style={styles.detailText}>Trx Id.: {transaction.id}</Text>
              <Text style={styles.detailText}>No. Rekening: {transaction.saving_id}</Text>
              <Text style={styles.detailText}>
                Nominal: Rp. {parseInt(transaction.amount).toLocaleString()}
              </Text>
              <Text style={styles.detailText}>
                Status: {transaction.status === 1 ? "APPROVED" : "PENDING"}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>PRINT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>REVERSE</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: spacing.sm,
  },
  button: {
    backgroundColor: "#3949AB",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardContainer: {
    padding: spacing.md,
  },
  cardText: {
    color: "#666",
    fontSize: 14,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  detailCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  errorContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing.md,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#3949AB",
    flexDirection: "row",
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#3949AB",
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollContainer: {
    backgroundColor: "#f0f0f0",
    flexGrow: 1,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default TransactionHistory
