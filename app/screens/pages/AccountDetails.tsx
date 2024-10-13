import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Screen } from "../../components"
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import { RootStackParamList } from "app/screens/pages/navigationTypes"
import { spacing } from "../../theme"
import QRCode from "react-native-qrcode-svg"
import { Buffer } from "buffer"

type AccountDetailsRouteProp = RouteProp<RootStackParamList, "AccountDetails">

export const AccountDetails: React.FC = () => {
  const route = useRoute<AccountDetailsRouteProp>()
  const navigation = useNavigation()

  // Menerima semua data dari route.params
  const {
    name = "No Name",
    accountNumber = "No Account Number",
    cif,
    phone,
    email,
    address,
    initial_balance, // Terima initial_balance
    final_balance, // Terima final_balance
  } = route.params || {}

  // Console log semua data yang diterima
  console.log("Received data:", {
    name,
    accountNumber,
    cif,
    phone,
    email,
    address,
    initial_balance,
    final_balance,
  })

  // Prepare the QR Code value in base64 format
  const jsonData = JSON.stringify({ accountNumber })
  const base64Data = Buffer.from(jsonData).toString("base64")

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Account Details</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.qrContainer}>
          <QRCode value={base64Data} size={150} />
          <TouchableOpacity>
            <Text style={styles.printButton}>PRINT</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.accountTitle}>Account Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.info}>{name}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.info}>{accountNumber}</Text>
        </View>

        {/* Action Buttons */}
        <Text style={styles.actionTitle}>Aksi</Text>
        <View style={styles.actions}>
          {/* Setoran Tabungan */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("SavingDeposit", {
                name,
                accountNumber,
                cif,
                phone,
                email,
                address,
              })
            }
          >
            <FontAwesome name="credit-card" size={40} color="orange" />
            <Text style={styles.actionText}>Setoran Tabungan</Text>
          </TouchableOpacity>

          {/* Penarikan Tabungan */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigation.navigate("WithdrawalSavings", {
                name,
                accountNumber,
                cif,
                phone,
                email,
                address,
                initial_balance, // Kirim initial_balance
                final_balance, // Kirim final_balance
              })
              console.log("Navigating to WithdrawalSavings with data:", {
                initial_balance,
                final_balance,
              }) // Console log untuk data yang dikirim
            }}
          >
            <FontAwesome name="money" size={40} color="orange" />
            <Text style={styles.actionText}>Penarikan Tabungan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
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
  info: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
    padding: 15,
    width: "100%", // Full width for the card
  },
  label: {
    color: "#666",
    fontSize: 14,
  },
  printButton: {
    color: "#007bff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl + 24,
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 20,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    width: "45%",
  },
  actionText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    width: "100%",
  },
})
