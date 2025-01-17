import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";
import { RouteProp } from '@react-navigation/native';

type SavingsDepositPage2RouteProp = RouteProp<{ params: { accountNumber: string } }, 'params'>;

export const SavingsDepositPage2 = () => {
    const navigation = useNavigation();
    const route = useRoute<SavingsDepositPage2RouteProp>();

    // Ambil nomor rekening dari parameter rute untuk digunakan nanti
    const { accountNumber } = route.params || { accountNumber: '-' };

    // State untuk menampung data form
    const [nomorRekening, setNomorRekening] = useState(accountNumber || "-");
    const [namaNasabah, setNamaNasabah] = useState("-");
    const [alamatNasabah, setAlamatNasabah] = useState("-");
    const [nominal, setNominal] = useState("");

    // Fungsi untuk memformat angka agar menggunakan separator ribuan
    const formatNominal = (value: string) => {
        const cleanedValue = value.replace(/[^0-9]/g, "");
        const formattedValue = new Intl.NumberFormat("id-ID").format(Number(cleanedValue));
        return formattedValue;
    };

    const handleNominalChange = (value: string) => {
        setNominal(formatNominal(value));
    };

    // Ambil data dari SearchAccountPage jika ada
    useEffect(() => {
        if (route.params) {
            setNomorRekening(route.params.nomorRekening || nomorRekening);
            setNamaNasabah(route.params.namaNasabah || namaNasabah);
            setAlamatNasabah(route.params.alamatNasabah || alamatNasabah);
        }
    }, [route.params]);

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('AccountDetails', { accountNumber: nomorRekening })} 
                    style={styles.backButton}
                >
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Setoran Tabungan</Text>
            </View>

            {/* Kontainer Utama */}
            <View style={styles.container}>
                {/* Tombol untuk mencari rekening */}
                <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("SearchAccountPage")}>
                    <Text style={styles.searchButtonText}>Cari Rekening</Text>
                </TouchableOpacity>

                {/* Input Nomor Rekening */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nomor Rekening:</Text>
                    <TextInput
                        value={nomorRekening}
                        onChangeText={setNomorRekening}
                        style={styles.input}
                        editable={false}
                    />
                </View>

                {/* Input Nama Nasabah */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nama Nasabah</Text>
                    <TextInput
                        value={namaNasabah}
                        onChangeText={setNamaNasabah}
                        style={styles.input}
                        editable={false}
                    />
                </View>

                {/* Input Alamat Nasabah */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Alamat Nasabah</Text>
                    <TextInput
                        value={alamatNasabah}
                        onChangeText={setAlamatNasabah}
                        style={styles.input}
                        editable={false}
                    />
                </View>

                {/* Input Nominal */}
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
        paddingTop: spacing.xl + 24,
    },
    searchButton: {
        alignItems: "center",
        backgroundColor: "#1a73e8",
        borderRadius: 8,
        marginBottom: 24,
        padding: 8,
    },
    searchButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    }
});

export default SavingsDepositPage2;
