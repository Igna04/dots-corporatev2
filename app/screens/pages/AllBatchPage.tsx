/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";
import { api } from "../../services/api";

// Define the structure of a transaction based on the API data
interface Transaction {
  id: string; // 'id' from API
  status: number; // 'status' from API
  created_at: string; // 'created_at' from API
  created_by: {
    first_name: string;
    last_name: string;
    username: string;
  }; // Added to display the creator's information if needed
}

export const AllBatchPage: React.FC = ({ route }) => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await api.getTransactionBatches();
        if (result && result.kind === "ok") {
          console.log("Data from API: ", result.transactionBatches); // Debugging
          setTransactions(result.transactionBatches);
        } else {
          console.error("Failed to load transaction batches");
        }
      } catch (error) {
        console.error("Error fetching transaction batches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  console.log("Transactions state: ", transactions); // Debugging to ensure state is updated

  return (
    <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={18} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Daftar Batch Transaksi</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <ScrollView style={styles.cardContainer}>
          {transactions.length === 0 ? (
            <Text style={styles.noDataText}>Tidak ada transaksi yang tersedia</Text>
          ) : (
            transactions.map((transaction, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>Batch ID: {transaction.id}</Text>
                <Text style={styles.cardText}>Status: {transaction.status}</Text>
                <Text style={styles.cardText}>
                  Tanggal Buat: {new Date(transaction.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.cardText}>
                  Dibuat oleh: {transaction.created_by.first_name} {transaction.created_by.last_name}
                </Text>
                <TouchableOpacity onPress={() => console.log("Sejarah pressed")}>
                  <Text style={styles.historyLink}>SEJARAH</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
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
  loader: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center', /* Adjust as needed */
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
