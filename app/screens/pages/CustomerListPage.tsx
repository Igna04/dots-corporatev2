import React, { useEffect, useState } from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Keyboard } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { FontAwesome } from "@expo/vector-icons"
import { Text } from "../../components"
import { colors, spacing } from "app/theme"
import { api } from "../../services/api"
import { StackNavigationProp } from "@react-navigation/stack"

// Definisikan tipe untuk parameter yang diterima oleh 'DetailsPage'
type RootStackParamList = {
  ActivityPage: undefined
  DetailsPage: {
    item: any
    accountNumber?: string
    initial_balance?: number
    final_balance?: number
    userId?: string // Tambahkan userId di sini
  }
}

// Definisikan tipe untuk navigasi
type ActivityPageNavigationProp = StackNavigationProp<RootStackParamList, "ActivityPage">

const COLORS = {
  white: "#FFFFFF",
  gray: "#808080",
  black: "#000000",
  blue: "#0044cc",
  lightGray: "#e0e0e0",
}

export const CustomerListPage = () => {
  const navigation = useNavigation<ActivityPageNavigationProp>()
  const route = useRoute() // Mengambil parameter navigasi
  const { userId, transactionBatchData } = route.params || {}
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [customerData, setCustomerData] = useState<any[]>([]) // Gunakan any untuk customerData
  const [loading, setLoading] = useState(true)

  // Log userId untuk memastikan apakah data telah dikirim
  console.log("User ID yang diterima di CustomerListPage:", userId)
  console.log("Transaction batch data yang diterima di CustomerListPage:", transactionBatchData)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const result = await api.getAllCustomers()
        if (result && result.kind === "ok") {
          setCustomerData(result.customers)
        } else {
          console.error("Gagal mengambil data nasabah")
        }
      } catch (error) {
        console.error("Kesalahan saat mengambil data nasabah:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredData = customerData.filter((item) =>
    item.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSearchSubmit = () => {
    Keyboard.dismiss()
  }

  const handleCardPress = async (item: any) => {
    const savingsResponse = await api.getCustomerSavingsByCif(item.cif)

    console.log("Savings Response:", savingsResponse)

    if (savingsResponse && savingsResponse.kind === "ok") {
      console.log("Received Savings Data:", savingsResponse.savings)

      if (savingsResponse.savings.length > 0) {
        const accountNumber = savingsResponse.savings[0]?.account_number
        const initialBalance = savingsResponse.savings[0]?.initial_balance
        const finalBalance = savingsResponse.savings[0]?.final_balance

        console.log("Account Number:", accountNumber)
        console.log("Initial Balance:", initialBalance)
        console.log("Final Balance:", finalBalance)

        if (accountNumber) {
          navigation.navigate("Details", {
            item,
            accountNumber,
            initial_balance: initialBalance,
            final_balance: finalBalance,
            userId, // Menambahkan userId ke parameter navigasi
            transactionBatchData,
          })
        } else {
          console.log("Account number not found")
          navigation.navigate("Details", { item, transactionBatchData }) // Tanpa accountNumber
        }
      } else {
        console.log("No savings data found")
        navigation.navigate("Details", { item, transactionBatchData }) // Tanpa accountNumber
      }
    } else {
      console.log("Savings data not available: ", savingsResponse?.savings)
      navigation.navigate("Details", { item, transactionBatchData }) // Tanpa accountNumber
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Welcome")} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color={"black"} />
        </TouchableOpacity>
        <Text style={styles.title}>Fasilitas Nasabah</Text>
      </View>

      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berdasarkan nama nasabah"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchIcon}>
          <FontAwesome name="search" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.cif}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Text style={styles.cardText}>{item.full_name}</Text>
                <View style={styles.divider} />
                <Text style={styles.cardDetails}>{item.address}</Text>
              </View>
              <Text style={styles.cardCode}>{item.cif}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.cardList}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: 8,
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
    marginTop: 30,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1, // Tambahkan borderWidth untuk membuat border
    borderColor: COLORS.lightGray, // Tentukan warna border
    borderRadius: 8,
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg + 90,
    paddingHorizontal: spacing.md,
  },
  searchContainerFocused: {
    borderBottomColor: COLORS.blue,
    borderBottomWidth: 2,
  },
  searchIcon: {
    paddingLeft: spacing.sm,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    flex: 1,
    fontSize: 16,
    height: 40,
    paddingLeft: spacing.sm,
  },
  title: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8, // Reduced for a smoother corner
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 12, // Reduced horizontal padding
    marginVertical: 8, // Slight margin between cards
    marginHorizontal: spacing.lg, // Horizontal margins adjusted
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 }, // Reduced shadow offset
    shadowOpacity: 0.1,
    shadowRadius: 4, // Reduced shadow radius for a subtler effect
    elevation: 2, // Lowered elevation for a cleaner, flat look
    borderWidth: 1, // Thin border
    borderColor: COLORS.lightGray,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 8, // Reduced margin for tighter layout
  },
  cardText: {
    fontSize: 14, // Slightly smaller text size
    fontWeight: "600",
    color: COLORS.black,
  },
  cardDetails: {
    color: COLORS.gray,
    fontSize: 12, // Smaller address font size
    marginTop: 2, // Tighter spacing between name and address
  },
  cardCode: {
    color: COLORS.black, // Subtle color for the code
    fontSize: 12, // Smaller font size for the code
  },
  divider: {
    borderBottomColor: COLORS.lightGray,
    borderBottomWidth: 0.5, // Lighter divider line
    marginVertical: 4, // Reduced spacing for tighter layout
  },
  cardList: {
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },
})

export default CustomerListPage
