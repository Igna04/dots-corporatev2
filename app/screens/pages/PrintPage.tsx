/* eslint-disable react-native/no-color-literals */
import React, { useEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { Screen, Text } from "../../components"
import { spacing } from "app/theme"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { RootStackParamList } from "app/screens/pages/navigationTypes"
import { api } from "app/services/api"
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { hsdLogo } from "./DummyLogo.js"

// Define the route prop for the Print page
type PrintRouteProp = RouteProp<RootStackParamList, "Print">

export const PrintPage: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<PrintRouteProp>()

  // Extract the data passed from SavingDepositPage
  const receivedData = route.params || {}
  const { name, accountNumber, cif, phone, email, address, userId, transactionBatchData } =
    route.params || {}

  // Destructure the data
  const { transactionResult } = receivedData
  const batchId = transactionResult?.transaction?.batch_id || ""

  // State to hold fetched transaction data
  const [username, setUsername] = useState("")

  // Fetch transactions by batch ID and extract the collector's username
  useEffect(() => {
    const fetchTransactions = async () => {
      const result = await api.getTransactionsByBatchId(batchId)

      console.log("Data received from getTransactionsByBatchId:", result)

      if (result?.kind === "ok" && result.transactions.length > 0) {
        const firstTransaction = result.transactions[0]

        // Ambil nilai 'username' dari objek 'created_by'
        const { username } = firstTransaction.created_by
        setUsername(username)
        console.log("Username set to:", username) // Log untuk memastikan username di-update
      } else {
        console.error("Failed to fetch transactions or no transactions found")
      }
    }

    if (batchId) {
      fetchTransactions()
    }
  }, [batchId])

  // Extract other needed values from transactionResult
  const transactionId = transactionResult?.transaction?.id || "N/A"
  const transactionCreatedAt = transactionResult?.transaction?.created_at || "N/A"
  const transactionAmount = transactionResult?.transaction?.amount || "N/A"

  // Convert date to a readable format
  const formattedDate = new Date(transactionCreatedAt).toLocaleString() || "N/A"

  console.log("Rendering PrintPage with username:", username) // Log untuk melihat nilai username saat render

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Bukti Transaksi</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.transactionHeader}>
          <FontAwesome name="file-text" size={40} color="#1a73e8" style={styles.icon} />
          <Text style={styles.transactionText}>Bukti Pembayaran</Text>
        </View>
        <View style={styles.underline} />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Kode Transaksi:</Text>
          <Text style={styles.value}>{transactionId}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tanggal Transaksi:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nama Nasabah:</Text>
          <Text style={styles.value}>{name || "Tidak Diketahui"}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nama Kolektor:</Text>
          <Text style={styles.value}>{username || "Memuat..."}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Jumlah Tabungan:</Text>
          <Text style={styles.value}>Rp. {transactionAmount}</Text>
        </View>
        <Text style={styles.notice}>
          Bukti ini merupakan bukti pembayaran yang sah yang diterbitkan oleh BPR secara elektronik
        </Text>

        <TouchableOpacity
          onPress={async () => {
            try {
              await BluetoothEscposPrinter.printText("\r\n", {})
              await BluetoothEscposPrinter.printPic(hsdLogo, { width: 200, left: 100 })
              await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)

              // Header Bukti Pembayaran
              await BluetoothEscposPrinter.printText("Bukti Pembayaran\r\n", { widthtimes: 1 })
              await BluetoothEscposPrinter.printText("============\r\n", {})

              // Informasi dalam format dua kolom
              const printTransactionCode = async (label, value) => {
                await BluetoothEscposPrinter.printColumn(
                  [40], // Ubah menjadi 40 karakter agar seluruh teks bisa muat dalam satu kolom
                  [BluetoothEscposPrinter.ALIGN.LEFT], // Align kiri
                  [`${label} ${value}`], // Gabungkan label dan value dalam satu string
                  { fonttype: 0 },
                )
              }

              await printTransactionCode("Kode Trx:\n", transactionId)
              await printTransactionCode("Tgl Trx:", formattedDate)
              await printTransactionCode("Nama Nasabah:", name.trim())
              await printTransactionCode("Nama Kolektor:", username)
              await printTransactionCode("Jml Tabungan:", transactionAmount)

              await BluetoothEscposPrinter.printText("============\r\n", {})

              // Footer
              await BluetoothEscposPrinter.printText(
                "Bukti ini merupakan bukti pembayaran yang sah\r\n" +
                  "yang diterbitkan oleh BPR secara elektronik.\r\n",
                { fonttype: 0 },
              )

              await BluetoothEscposPrinter.printText("\r\n", {})
              await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)

              // QR Code
              await BluetoothEscposPrinter.printQRCode(
                "DP0837849839",
                200,
                BluetoothEscposPrinter.ERROR_CORRECTION.L,
              )

              await BluetoothEscposPrinter.printText("\r\n\r\n", {})
            } catch (e) {
              Alert.alert("Error", e.message || "An error occurred while printing")
            }
          }}
          style={styles.printButton}
        >
          <Text style={styles.printButtonText}>PRINT</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}
const styles = StyleSheet.create({
  backButton: {
    marginRight: 8,
  },

  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginTop: spacing.xl + 24, // To avoid overlap with the header
    borderWidth: 1,
    borderColor: "#ddd",
  },

  header: {
    alignItems: "center",
    backgroundColor: "#1a73e8",
    elevation: 4,
    flexDirection: "row",
    paddingLeft: spacing.lg,
    paddingVertical: 16,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10, // Adds shadow for Android
  },

  icon: {
    marginRight: 8,
  },

  infoContainer: {
    marginBottom: 16, // Space between each info block
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
  },

  notice: {
    color: "#000",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "left",
  },

  printButton: {
    alignItems: "center",
    backgroundColor: "#1a73e8",
    borderRadius: 10,
    padding: 12,
  },

  printButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl + 24,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  transactionHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8, // Reduced space between header and underline
  },

  transactionText: {
    fontSize: 23,
    fontWeight: "bold",
    marginLeft: 10,
  },

  underline: {
    height: 2,
    backgroundColor: "#1a73e8", // Color of the underline
    width: "100%",
    marginBottom: 16, // Space below the underline
  },

  value: {
    color: "#333",
    fontSize: 16,
    marginLeft: 10, // Space between label and value
  },
})

export default PrintPage
