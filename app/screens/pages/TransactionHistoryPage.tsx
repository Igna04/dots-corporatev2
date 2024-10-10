/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-color-literals */
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";

export const TransactionHistory = () => {
    const navigation = useNavigation();

    // Sample state for transactions
    const [transactions] = useState([
        {
            batchId: 'asiodjaijsdajod',
            status: 'Aktif',
            totalReceived: 100000,
        },
        {
            batchId: 'bsdfkj23432kjd',
            status: 'Tidak Aktif',
            totalReceived: 50000,
        },
        {
            batchId: 'zxcvbnm09876',
            status: 'Aktif',
            totalReceived: 150000,
        },
        // Add more transactions as needed
    ]);

    // Sort transactions in descending order based on totalReceived
    const sortedTransactions = [...transactions].sort((a, b) => b.totalReceived - a.totalReceived);

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Sejarah Transaksi</Text>
            </View>
            <ScrollView style={styles.cardContainer}>
                {sortedTransactions.map((transaction, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>Batch ID: {transaction.batchId}</Text>
                        <Text style={styles.cardText}>Status: {transaction.status}</Text>
                        <Text style={styles.cardText}>Total Tunai Diterima: Rp. {transaction.totalReceived.toLocaleString()}</Text>
                    </View>
                ))}
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

export default TransactionHistory;
