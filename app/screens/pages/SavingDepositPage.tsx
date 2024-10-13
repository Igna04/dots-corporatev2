import React, { useEffect, useState } from "react"
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import { Screen, Text } from "../../components"
import { spacing } from "app/theme"
import { RootStackParamList } from "app/screens/pages/navigationTypes"

// Define the props for this screen
type SavingDepositRouteProp = RouteProp<RootStackParamList, "SavingDepositPage">

export const SavingDepositPage: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<SavingDepositRouteProp>()

  // Menerima data dari route.params
  const { name, accountNumber, cif, phone, email, address } = route.params || {}

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

  // Fungsi untuk menangani navigasi ke PrintPage
  const handleSave = () => {
    navigation.navigate("Print")
  }

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Setoran Tabungan</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nomor Rekening:</Text>
          <TextInput value={accountNumber || "-"} style={styles.input} editable={false} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Nasabah</Text>
          <TextInput value={name || "-"} style={styles.input} editable={false} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alamat Nasabah</Text>
          <TextInput value={address || "-"} style={styles.input} editable={false} />
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
    paddingTop: spacing.xl + 24,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default SavingDepositPage
