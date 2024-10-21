import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Screen } from "../../components"
import { useNavigation } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import { spacing } from "app/theme"

export const LoanRepaymentList: React.FC = () => {
  const navigation = useNavigation()

  // Ambil data dari console log
  const loanData = [
    {
      account_number: "00104090004692",
      cif: "0110003",
      contract_number: "<no.spk>",
      installments: [
        {
          installment_date: "1900-01-01",
          principal_amount: "2600000",
          interest_amount: "285000",
          penalty_amount: "0",
          total_installment: "285000",
        },
        // Tambahkan lebih banyak objek dengan data angsuran sesuai kebutuhan
      ],
    },
  ]

  // Mengubah data untuk digunakan dalam komponen
  const scheduleData = loanData[0].installments.map((installment, index) => ({
    ke: index + 1,
    tanggal: installment.installment_date, // Ambil dari installment_date
    pokok: parseFloat(installment.principal_amount), // Ambil dari principal_amount
    bunga: parseFloat(installment.interest_amount), // Ambil dari interest_amount
    denda: parseFloat(installment.penalty_amount), // Ambil dari penalty_amount
    tagihan: parseFloat(installment.total_installment), // Ambil dari total_installment
  }))

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Jadwal Angsuran Kredit</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Nomor Rekening</Text>
            <Text style={styles.info}>{loanData[0].account_number}</Text>
            <Text style={styles.label}>Nama Nasabah</Text>
            <Text style={styles.info}>AGUS HARIYANTO</Text>
          </View>

          <Text style={styles.scheduleTitle}>Jadwal</Text>
          <ScrollView horizontal style={styles.tableContainer}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.cellKe]}>Ke</Text>
                <Text style={[styles.headerCell, styles.cellTanggal]}>Tanggal</Text>
                <Text style={[styles.headerCell, styles.cellAmount]}>Pokok</Text>
                <Text style={[styles.headerCell, styles.cellAmount]}>Bunga</Text>
                <Text style={[styles.headerCell, styles.cellAmount]}>Denda</Text>
                <Text style={[styles.headerCell, styles.cellAmount]}>Tagihan</Text>
              </View>
              {scheduleData.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.cell, styles.cellKe]}>{item.ke}</Text>
                  <Text style={[styles.cell, styles.cellTanggal]}>{item.tanggal}</Text>
                  <Text style={[styles.cell, styles.cellAmount]}>
                    {item.pokok.toLocaleString()}
                  </Text>
                  <Text style={[styles.cell, styles.cellAmount]}>
                    {item.bunga.toLocaleString()}
                  </Text>
                  <Text style={[styles.cell, styles.cellAmount]}>
                    {item.denda.toLocaleString()}
                  </Text>
                  <Text style={[styles.cell, styles.cellAmount]}>
                    {item.tagihan.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: "#007bff",
    flexDirection: "row",
    paddingLeft: spacing.lg,
    paddingVertical: 24,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    marginRight: 8,
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    flex: 1,
    marginRight: spacing.lg,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 80, // Adjust this value to match your header height
    paddingBottom: spacing.lg,
  },
  container: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
    marginVertical: 10,
    padding: 15,
  },
  label: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerCell: {
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    padding: 10,
    textAlign: "center",
  },
  cellKe: {
    width: 40,
  },
  cellTanggal: {
    width: 100,
  },
  cellAmount: {
    width: 120,
  },
})
