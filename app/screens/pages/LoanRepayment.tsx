import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native"
import { Screen } from "../../components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import { spacing } from "app/theme"
import { Api } from "../../services/api"

export const LoanRepayment: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { loanData, repaymentSchedules, userId, transactionBatchData } = route.params

  console.log("User ID:", userId)
  console.log("Transaction Batch Data:", transactionBatchData)

  const currentSchedule = repaymentSchedules[0]

  const [nominal, setNominal] = useState("")

  const formatCurrency = (amount: string) => {
    return `Rp. ${parseFloat(amount).toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const formatNominal = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, "")
    return new Intl.NumberFormat("id-ID").format(Number(cleanedValue))
  }

  const handleNominalChange = (value: string) => {
    setNominal(formatNominal(value))
  }

  const handleSave = async () => {
    try {
      const postData = {
        nominal: nominal.replace(/\./g, ""),
        accountNumber: loanData.account_number,
        userId,
        batchId: transactionBatchData?.id || "",
      }

      console.log("Data yang akan dipost:", postData)

      const api = new Api()
      const result = await api.createTransaction(
        "0",
        postData.nominal,
        3, 
        1,
        "",
        postData.accountNumber,
        "",
        "",
        postData.userId,
        "",
        "",
        "",
        postData.batchId,
      )

      console.log("Hasil transaksi:", result)

      if (result) {
        Alert.alert("Sukses", "Pembayaran pinjaman berhasil disimpan!")

        // Navigasi ke halaman Print
        navigation.navigate("Print", {
          ...postData,
          transactionResult: result,
          name: loanData.customer_data.full_name.trim(),
          loanData: loanData,
          currentSchedule: currentSchedule,
        })
      } else {
        Alert.alert("Error", "Terjadi kesalahan saat menyimpan pembayaran.")
      }
    } catch (error) {
      console.error("Error dalam membuat transaksi:", error)
      Alert.alert("Error", "Gagal melakukan pembayaran pinjaman.")
    }
  }

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Angsuran Kredit</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nomor Rekening</Text>
            <Text style={styles.info}>{loanData.account_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama Nasabah</Text>
            <Text style={styles.info}>{loanData.customer_data.full_name.trim()}</Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Tagihan</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pokok</Text>
            <Text style={styles.info}>{formatCurrency(currentSchedule.principal_amount)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bunga</Text>
            <Text style={styles.info}>{formatCurrency(currentSchedule.interest_amount)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Denda</Text>
            <Text style={styles.info}>{formatCurrency(currentSchedule.penalty_amount)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total</Text>
            <Text style={[styles.info, styles.totalAmount]}>
              {formatCurrency(currentSchedule.total_installment)}
            </Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Pembayaran</Text>
          <View style={styles.checkboxRow}>
            <FontAwesome name="check-square" size={24} color="#007bff" />
            <Text style={styles.checkboxLabel}>Angsuran masuk ke rek. tabungan</Text>
          </View>

          <Text style={styles.inputLabel}>Nominal Pembayaran</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nominal pembayaran"
            keyboardType="numeric"
            value={nominal}
            onChangeText={handleNominalChange}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SIMPAN</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingHorizontal: spacing.lg,
    paddingVertical: 24,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    paddingTop: 80, // Atur padding atas sesuai kebutuhan
    paddingBottom: 24, // Sesuaikan padding bawah untuk tombol
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  info: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  totalAmount: {
    fontWeight: "bold",
    color: "#007bff",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 16,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
