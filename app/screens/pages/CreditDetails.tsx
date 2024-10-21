import React, { useEffect, useState } from "react" // Tambahkan useState
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Screen } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import QRCode from "react-native-qrcode-svg"
import { Buffer } from "buffer"
import { spacing } from "app/theme"
import { api } from "../../services/api"

export const CreditDetails: React.FC = ({ route }) => {
  const { loanData, userId, transactionBatchData } = route.params // Ambil data dari route params
  const navigation = useNavigation()
  const [repaymentSchedules, setRepaymentSchedules] = useState([]) // State untuk jadwal pembayaran

  // Buat data JSON untuk QR code
  const jsonData = JSON.stringify({
    type: "loan",
    accountNumber: loanData.account_number,
    cif: loanData.customer_data.cif, // Pastikan ada properti CIF di loanData
  })
  const base64Data = Buffer.from(jsonData).toString("base64") // Encode ke base64

  // Fungsi untuk mendapatkan jadwal pembayaran
  const fetchRepaymentSchedules = async () => {
    const response = await api.getRepaymentSchedulesByAccountNumber(loanData.account_number)
    if (response?.kind === "ok") {
      console.log("Repayment schedules:", response.schedules) // Log data jadwal pembayaran
      setRepaymentSchedules(response.schedules) // Simpan jadwal pembayaran ke state
    } else {
      console.error("Failed to fetch repayment schedules")
    }
  }

  // Mengambil jadwal pembayaran saat komponen dimount
  useEffect(() => {
    fetchRepaymentSchedules()
  }, [])

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Kredit</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.qrContainer}>
          <QRCode value={base64Data || "default"} size={150} />
          <TouchableOpacity>
            <Text style={styles.printButton}>PRINT</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.accountTitle}>Kredit Tanpa Agunan</Text>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.info}>{loanData.customer_data.id_name}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.info}>{loanData.account_number}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Baki Debet</Text>
          <Text style={styles.info}>{loanData.balance}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Kolektibilitas</Text>
          <Text style={styles.info}>{loanData.collectibility}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Plafond</Text>
          <Text style={styles.info}>{loanData.ceiling}</Text>
        </View>

        <Text style={styles.actionTitle}>Aksi</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log(
                "Mengirim data ke LoanRepayment:",
                loanData,
                repaymentSchedules,
                userId,
                transactionBatchData,
              ) // Menampilkan data di konsol
              navigation.navigate("LoanRepayment", {
                loanData,
                repaymentSchedules,
                userId, // Kirim userId
                transactionBatchData, // Kirim transactionBatchData
              })
            }}
          >
            <FontAwesome name="credit-card" size={40} color="orange" />
            <Text style={styles.actionText}>Pembayaran Angsuran</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              console.log(
                "Mengirim data ke LoanRepaymentList:",
                loanData,
                repaymentSchedules,
                userId,
                transactionBatchData,
              ) // Menampilkan data di konsol
              navigation.navigate("LoanRepaymentList", {
                loanData,
                repaymentSchedules,
                userId, // Kirim userId
                transactionBatchData, // Kirim transactionBatchData
              })
            }}
          >
            <FontAwesome name="calendar" size={40} color="orange" />
            <Text style={styles.actionText}>List Jadwal Angsuran</Text>
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
