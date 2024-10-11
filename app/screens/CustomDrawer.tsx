/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-color-literals */
// CustomDrawer.tsx
import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { useNavigation } from "@react-navigation/native"

export const CustomDrawer = () => {
  const navigation = useNavigation()

  return (
    <View style={[styles.drawer1, styles.drawerInsets1]}>
      <View style={styles.logoContainer1}>
        {/* <Image source={logo} style={styles.logoImage1} /> */}
        {/* <TouchableOpacity style={styles.menuItem1} onPress={() => navigation.navigate("SavingDeposit")}>
            <FontAwesome name="money" size={20} style={styles.menuIcon1} />
            <Text style={styles.menuText1}>Setoran Tabungan (offline)</Text>
          </TouchableOpacity> */}
        <View style={styles.menuContainer1}>
          <TouchableOpacity style={styles.menuItem1} onPress={() => navigation.navigate("CustomerList")}>
            <FontAwesome name="user" size={20} style={styles.menuIcon1} />
            <Text style={styles.menuText1}>Daftar Nasabah</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem1} onPress={() => navigation.navigate("TransactionHistory")}>
            <FontAwesome name="history" size={20} style={styles.menuIcon1} />
            <Text style={styles.menuText1}>Sejarah Transaksi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem1} onPress={() => navigation.navigate("AllBatch")}>
            <FontAwesome name="list" size={20} style={styles.menuIcon1} />
            <Text style={styles.menuText1}>All Batch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem1} onPress={() => navigation.navigate("Loan")}>
            <FontAwesome name="file-text" size={20} style={styles.menuIcon1} />
            <Text style={styles.menuText1}>Pengajuan Peminjaman</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  drawer1: {
    backgroundColor: '#fff',
    flex: 1,
    paddingVertical: 20,
  },
  drawerInsets1: {
    paddingHorizontal: 16,
  },
  logoContainer1: {
    alignItems: 'center',
    marginBottom: 20,
  },
  menuContainer1: {
    paddingTop: 90,
    width: '100%',
  },
  menuIcon1: {
    color: '#333',
    marginRight: 10,
  },
  menuItem1: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  menuText1: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
})
