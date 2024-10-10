/* eslint-disable react-native/no-color-literals */
import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";

export const AllBatchPage = ({ route }) => {
    const navigation = useNavigation();

    // Terima daftar transaksi dari route.params, atau fallback ke array kosong jika tidak ada
    const { transactions } = route.params || { transactions: [] };

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Daftar Batch Transaksi</Text>
            </View>
            <ScrollView style={styles.cardContainer}>
                {transactions.length === 0 ? (
                    <Text style={styles.noDataText}>Tidak ada transaksi yang tersedia</Text>
                ) : (
                    transactions.map((transaction, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.cardTitle}>{transaction.batchId}</Text>
                            <Text style={styles.cardText}>Status : {transaction.status}</Text>
                            <Text style={styles.cardText}>Tanggal Buat: {transaction.createdAt}</Text>
                            <TouchableOpacity onPress={() => console.log("Sejarah pressed")}>
                                <Text style={styles.historyLink}>SEJARAH</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    backButton: {
        marginRight: 8,
    },
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        elevation: 2,
        marginBottom: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    cardContainer: {
        marginTop: 24,
        paddingHorizontal: spacing.lg,
    },
    cardText: {
        color: "#333",
        fontSize: 14,
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
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
    historyLink: {
        color: "#007bff",
        fontSize: 14,
        marginTop: 8,
    },
    noDataText: {
        color: "gray",
        fontSize: 16,
        marginTop: 20,
        textAlign: "center",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: spacing.lg,
        paddingTop: spacing.xl + 24, // Ensure padding below the header
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default AllBatchPage;
