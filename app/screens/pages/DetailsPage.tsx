/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { Screen, Text } from "../../components"
import { spacing } from "app/theme"
import { useNavigation } from "@react-navigation/native"
import QRCode from "react-native-qrcode-svg"
import { Buffer } from "buffer"
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { api } from "../../services/api" // Import the api

export const DetailsPage = ({ route }) => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState("Tabungan")
  const { item, accountNumber, initial_balance, final_balance, userId, transactionBatchData } =
    route.params || {
      item: {
        name: "No Name",
        cif: "No CIF",
        phone: "-",
        email: "-",
        address: "No Address",
      },
      userId: "No UserId", // Nilai default untuk userId
      transactionBatchData: [],
    }
  const [loansData, setLoansData] = useState([]) // State to store loans data

  // Function to fetch customer loans by CIF
  const fetchCustomerLoans = async () => {
    const response = await api.getCustomerLoansByCif(item.cif)

    if (response?.kind === "ok" && response.loans.length > 0) {
      console.log("Loans data found:", response.loans)
      setLoansData(response.loans) // Set the loans data
    } else {
      console.log("No loans data found for CIF:", item.cif)
      setLoansData([]) // Set loans data as empty if none found
    }
  }

  useEffect(() => {
    console.log("Received userId in DetailsPage:", userId)
    console.log("Received transactionBatchData in DetailsPage:", transactionBatchData)
    fetchCustomerLoans() // Fetch loans data when component mounts
  }, [])

  const handleAccountDetailsPress = () => {
    navigation.navigate("AccountDetails", {
      accountNumber: accountNumber,
      name: item.full_name,
      cif: item.cif,
      phone: item.phone,
      email: item.email,
      address: item.address,
      initial_balance,
      final_balance,
      userId,
      transactionBatchData,
    })
    console.log("Navigating to AccountDetails with data:", {
      accountNumber,
      name: item.full_name,
      cif: item.cif,
      phone: item.phone,
      email: item.email,
      address: item.address,
      initial_balance,
      final_balance,
      userId,
      transactionBatchData, // Log transactionBatchData
    })
    console.log("Received data in DetailsPage:", {
      item,
      accountNumber,
      initial_balance,
      final_balance,
      userId, // Tambahkan userId ke log
    })
  }

  const handleCreditDetailsPress = (loan) => {
    navigation.navigate("CreditDetails", {
      loanData: loan, // Mengirimkan data loan yang dipilih
      loansData: loansData, // Mengirimkan semua data pinjaman
      userId, // Kirim userId
      transactionBatchData, // Kirim transactionBatchData
    })
    console.log("Navigating to CreditDetails with data:", {
      loanData: loan,
      loansData: loansData,
      userId, // Tambahkan userId ke log
      transactionBatchData, // Tambahkan transactionBatchData ke log
    })
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Tabungan":
        return (
          <View>
            {accountNumber ? (
              <TouchableOpacity style={styles.walletContainer} onPress={handleAccountDetailsPress}>
                <FontAwesome name="money" size={24} color="gray" />
                <View style={styles.walletDetails}>
                  <Text>{accountNumber}</Text>
                  <Text>Tabungan Umum</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.tabContent}>No saving data available</Text> // Pesan jika tidak ada tabungan
            )}
          </View>
        )
      case "Kredit":
        return (
          <View>
            {loansData.length > 0 ? (
              loansData.map((loan, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.walletContainer}
                  onPress={() => handleCreditDetailsPress(loan)} // Pass loan data saat menekan
                >
                  <FontAwesome name="credit-card" size={24} color="gray" />
                  <View style={styles.walletDetails}>
                    <Text>{loan.account_number}</Text>
                    <Text>Kredit Tanpa Agunan</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.tabContent}>No loan data available</Text>
            )}
          </View>
        )
      case "Log":
        return <Text style={styles.tabContent}>No log data available</Text>
      default:
        return null
    }
  }

  const jsonData = JSON.stringify({ type: "customer", cif: item.cif })
  const base64Data = Buffer.from(jsonData).toString("base64")

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CustomerList")}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={18} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{item.full_name}</Text>
      </View>

      <View style={styles.container}>
        <QRCode value={base64Data || "default"} size={150} />

        <TouchableOpacity
          onPress={async () => {
            try {
              // Mencetak QR code dengan nilai dari base64Data
              await BluetoothEscposPrinter.printQRCode(
                base64Data || "default", // Hanya kirim string, bukan komponen
                280,
                BluetoothEscposPrinter.ERROR_CORRECTION.L,
              )
              await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {}) // Menambahkan spasi setelah QR code
            } catch (error) {
              console.error("Error printing QR code:", error)
            }
          }}
          style={styles.printButton}
        >
          <Text style={styles.printText}>PRINT</Text>
        </TouchableOpacity>

        <View style={styles.smallInfoCard}>
          <Text style={styles.smallLabel}>Nama Lengkap</Text>
          <Text style={styles.smallInfo}>{item.full_name}</Text>
        </View>

        <View style={styles.horizontalRow}>
          <View style={styles.smallInfoCardHalf}>
            <Text style={styles.smallLabel}>CIF</Text>
            <Text style={styles.smallInfo}>{item.cif}</Text>
          </View>
          <View style={styles.smallInfoCardHalf}>
            <Text style={styles.smallLabel}>No. Handphone</Text>
            <Text style={styles.smallInfo}>{item.phone || "-"}</Text>
          </View>
        </View>

        <View style={styles.smallInfoCard}>
          <Text style={styles.smallLabel}>Email</Text>
          <Text style={styles.smallInfo}>{item.email || "-"}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Alamat</Text>
          <Text style={styles.info}>{item.address}</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "Tabungan" && styles.activeTab]}
            onPress={() => setActiveTab("Tabungan")}
          >
            <Text style={activeTab === "Tabungan" ? styles.activeTabText : styles.tabText}>
              Tabungan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "Kredit" && styles.activeTab]}
            onPress={() => setActiveTab("Kredit")}
          >
            <Text style={activeTab === "Kredit" ? styles.activeTabText : styles.tabText}>
              Kredit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "Log" && styles.activeTab]}
            onPress={() => setActiveTab("Log")}
          >
            <Text style={activeTab === "Log" ? styles.activeTabText : styles.tabText}>Log</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContentContainer}>{renderContent()}</View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  activeTab: {
    borderBottomColor: "#007bff",
    borderBottomWidth: 2,
  },
  activeTabText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginRight: 8,
    padding: 8,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  container: {
    alignItems: "center",
    paddingTop: 40,
    padding: 20,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#007bff",
    flexDirection: "row",
    paddingLeft: spacing.lg,
    paddingVertical: 24,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  horizontalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    width: "100%",
  },
  info: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginTop: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "100%",
  },
  label: {
    color: "#666",
    fontSize: 14,
  },
  printButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginTop: 20,
    paddingHorizontal: 60,
    paddingVertical: 10,
  },
  printText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl + 24,
  },
  smallInfo: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 3,
    color: "#333",
  },
  smallInfoCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    marginTop: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "100%",
  },
  smallInfoCardHalf: {
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "48%",
  },
  smallLabel: {
    color: "#888",
    fontSize: 12,
  },
  tabButton: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  tabContent: {
    color: "#666",
    fontSize: 18,
  },
  tabContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    padding: 20,
  },
  tabText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textTransform: "capitalize",
  },
  walletContainer: {
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    flexDirection: "row",
    marginTop: -30,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "100%",
  },
  walletDetails: {
    marginLeft: 20,
    alignItems: "left",
  },
})
