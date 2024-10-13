import React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { Screen, Text } from "../../components"
import { spacing } from "app/theme"
import { useNavigation } from "@react-navigation/native"

export const PrintPage: React.FC = () => {
  const navigation = useNavigation()

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
          <Text style={styles.value}>ZHF2sSB4Ugqx4CHh0U9Gg</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tanggal Transaksi:</Text>
          <Text style={styles.value}>Minggu, 13/10/2024 17:30:9 WIB</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nama Nasabah:</Text>
          <Text style={styles.value}>KARNAEN LUBIS</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nama Kolektor:</Text>
          <Text style={styles.value}>Jimmy</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Jumlah Tabungan:</Text>
          <Text style={styles.value}>Rp. 10.000</Text>
        </View>
        <Text style={styles.notice}>
          Bukti ini merupakan bukti pembayaran yang sah yang diterbitkan oleh BPR secara elektronik
        </Text>
        <TouchableOpacity style={styles.printButton} onPress={() => console.log("Print action")}>
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
    flexDirection: "row",
    paddingLeft: spacing.lg,
    paddingVertical: 16,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    elevation: 4, // Adds shadow for Android
  },

  icon: {
    marginRight: 8,
  },

  transactionHeader: {
    flexDirection: "row",
    alignItems: "center",
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

  infoContainer: {
    marginBottom: 16, // Space between each info block
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
  },

  value: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10, // Space between label and value
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
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
})

export default PrintPage
