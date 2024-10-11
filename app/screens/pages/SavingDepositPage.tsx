/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
/* eslint-disable react-native/no-color-literals */
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";

export const SavingDepositPage = () => {
    const navigation = useNavigation();
    const route = useRoute(); // To get params from navigation

    // State to hold form data
    const [nomorRekening, setNomorRekening] = useState("-");
    const [namaNasabah, setNamaNasabah] = useState("-");
    const [alamatNasabah, setAlamatNasabah] = useState("-");
    const [nominal, setNominal] = useState("");

    // Format number to include thousands separators
    const formatNominal = (value: string) => {
        // Remove non-numeric characters before formatting
        const cleanedValue = value.replace(/[^0-9]/g, "");

        // Format the number with commas (or periods depending on locale)
        const formattedValue = new Intl.NumberFormat("id-ID").format(Number(cleanedValue));

        return formattedValue;
    };

    const handleNominalChange = (value: string) => {
        // Update the nominal value with formatted version
        setNominal(formatNominal(value));
    };

    // Effect to handle data from SearchAccountPage
    useEffect(() => {
        if (route.params) {
            setNomorRekening(route.params.nomorRekening);
            setNamaNasabah(route.params.namaNasabah);
            setAlamatNasabah(route.params.alamatNasabah);
        }
    }, [route.params]);

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('DemoShowroom')} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Setoran Tabungan</Text>
            </View>

            <View style={styles.container}>
                <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("SearchAccount")}>
                    <Text style={styles.searchButtonText}>Cari Rekening</Text>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nomor Rekening:</Text>
                    <TextInput
                        value={nomorRekening}
                        onChangeText={setNomorRekening}
                        style={styles.input}
                        editable={false} // Filled via search, not editable
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nama Nasabah</Text>
                    <TextInput
                        value={namaNasabah}
                        onChangeText={setNamaNasabah}
                        style={styles.input}
                        editable={false} // Filled via search, not editable
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Alamat Nasabah</Text>
                    <TextInput
                        value={alamatNasabah}
                        onChangeText={setAlamatNasabah}
                        style={styles.input}
                        editable={false} // Filled via search, not editable
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nominal</Text>
                    <TextInput
                        value={nominal}
                        onChangeText={handleNominalChange} // Format the value as the user types
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Masukkan Nominal"
                    />
                </View>

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
        paddingTop: spacing.xl + 24, // Ensure padding below the header
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

export default SavingDepositPage;