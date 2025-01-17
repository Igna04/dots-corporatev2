import React, { useEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import { Screen, Text } from "../../components"
import { spacing } from "app/theme"
import { RootStackParamList } from "app/screens/pages/navigationTypes"
import { Api } from "app/services/api"

// Define the props for this screen
type WithdrawalSavingsRouteProp = RouteProp<RootStackParamList, "WithdrawalSavings">

export const WithdrawalSavings = () => {
  const navigation = useNavigation()
  const route = useRoute<WithdrawalSavingsRouteProp>()

  // Menerima data dari route.params
  const {
    name,
    accountNumber,
    cif,
    phone,
    email,
    address,
    initial_balance,
    final_balance,
    userId,
    transactionBatchData,
  } = route.params || {}

  // Ekstrak batchId dari transactionBatchData
  const batchId = transactionBatchData?.id || ""

  // State untuk menyimpan nominal
  const [nominal, setNominal] = useState("")

  // Fungsi untuk memformat angka menjadi format ribuan
  const formatNominal = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, "")
    return new Intl.NumberFormat("id-ID").format(Number(cleanedValue))
  }

  const handleNominalChange = (value: string) => {
    setNominal(formatNominal(value))
  }

  // Fungsi untuk membuat transaksi penarikan
  const handleSave = async () => {
    try {
      // Data yang akan dipost
      const postData = {
        nominal: nominal.replace(/\./g, ""), // Menghapus titik dari nominal
        accountNumber: accountNumber || "",
        userId,
        batchId,
      }

      console.log("Data yang dipost:", postData)

      const api = new Api()
      const result = await api.createTransaction(
        "0",
        postData.nominal,
        2,
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

      console.log("Transaction result:", result)

      if (result) {
        Alert.alert("Sukses", "Penarikan berhasil disimpan!")

        // Kirim data ke halaman Print
        navigation.navigate("Print", {
          ...postData, // Kirim semua data yang dipost
          transactionResult: result, // Kirim hasil transaksi
          name: name,
        })
      } else {
        Alert.alert("Error", "Terjadi kesalahan saat menyimpan penarikan.")
      }
    } catch (error) {
      console.error("Error in creating withdrawal transaction:", error)
      Alert.alert("Error", "Gagal melakukan penarikan.")
    }
  }

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        {/* Tombol Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Navigasi kembali
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={18} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Penarikan Tabungan</Text>
      </View>

      {/* Kontainer utama */}
      <View style={styles.container}>
        {/* Input Nomor Rekening */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nomor Rekening:</Text>
          <TextInput value={accountNumber || "-"} style={styles.input} editable={false} />
        </View>

        {/* Input Nama Nasabah */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Nasabah</Text>
          <TextInput value={name || "-"} style={styles.input} editable={false} />
        </View>

        {/* Saldo Saat Ini */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Saldo Saat Ini:</Text>
          <TextInput
            value={final_balance ? formatNominal(final_balance.toString()) : "-"} // Tampilkan final_balance
            style={styles.input}
            editable={false} // Non-editable
          />
        </View>

        {/* Saldo Dapat Digunakan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Saldo Dapat Digunakan:</Text>
          <TextInput
            value={initial_balance ? formatNominal(initial_balance.toString()) : "-"} // Tampilkan initial_balance
            style={styles.input}
            editable={false} // Non-editable
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nominal</Text>
          <TextInput
            value={nominal}
            onChangeText={handleNominalChange}
            style={styles.input}
            keyboardType="numeric"
            placeholder="Masukkan Nominal"
          />
        </View>

        {/* Tombol Simpan */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan</Text>
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
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 16,
  },
  header: {
    alignItems: "center",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    paddingLeft: spacing.lg,
    paddingVertical: 24,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#000",
    fontSize: 16,
    marginBottom: 8,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    marginTop: 24,
    padding: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl + 24, // Pastikan ada padding di bawah header
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default WithdrawalSavings
