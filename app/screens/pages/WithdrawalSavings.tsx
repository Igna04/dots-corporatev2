/* eslint-disable react-native/no-color-literals */
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";

// Definisikan tipe untuk parameter rute (optional, jika menggunakan TypeScript)
type WithdrawalSavingsRouteProp = {
  params: {
    accountNumber: string;
    namaNasabah: string;
    alamatNasabah: string;
  }
};

export const WithdrawalSavings = () => {
  const navigation = useNavigation();
  const route = useRoute<WithdrawalSavingsRouteProp>();

  // State untuk menampung data form
  const [nomorRekening, setNomorRekening] = useState(route.params?.accountNumber || "-");
  const [namaNasabah, setNamaNasabah] = useState(route.params?.namaNasabah || "-");
  const [alamatNasabah, setAlamatNasabah] = useState(route.params?.alamatNasabah || "-");
  const [nominal, setNominal] = useState("");

  // Fungsi untuk memformat angka
  const formatNominal = (value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const formattedValue = new Intl.NumberFormat("id-ID").format(Number(cleanedValue));
    return formattedValue;
  };

  // Handle perubahan nominal
  const handleNominalChange = (value: string) => {
    setNominal(formatNominal(value));
  };

  // Update state saat parameter rute berubah
  useEffect(() => {
    if (route.params) {
      setNomorRekening(route.params.accountNumber || "-");
      setNamaNasabah(route.params.namaNasabah || "-");
      setAlamatNasabah(route.params.alamatNasabah || "-");
    }
  }, [route.params]);

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        {/* Tombol Back */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('AccountDetails', { accountNumber: nomorRekening })} 
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
          <TextInput
            value={nomorRekening}
            onChangeText={setNomorRekening}
            style={styles.input}
            editable={false} // Non-editable karena diisi dari parameter
          />
        </View>

        {/* Input Nama Nasabah */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Nasabah</Text>
          <TextInput
            value={namaNasabah}
            onChangeText={setNamaNasabah}
            style={styles.input}
            editable={false} // Non-editable
          />
        </View>

        {/* Input Alamat Nasabah */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alamat Nasabah</Text>
          <TextInput
            value={alamatNasabah}
            onChangeText={setAlamatNasabah}
            style={styles.input}
            editable={false} // Non-editable
          />
        </View>

        {/* Input Nominal Penarikan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nominal</Text>
          <TextInput
            value={nominal}
            onChangeText={handleNominalChange} // Format nominal saat user mengetik
            style={styles.input}
            keyboardType="numeric"
            placeholder="Masukkan Nominal Penarikan"
          />
        </View>

        {/* Tombol Simpan */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

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
});

export default WithdrawalSavings;
