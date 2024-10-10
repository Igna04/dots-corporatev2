/* eslint-disable react-native/sort-styles */
import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Keyboard } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from "../../components";
import { spacing } from "app/theme";
import { api } from "../../services/api";
import { StackNavigationProp } from '@react-navigation/stack';

// Definisikan tipe untuk parameter yang diterima oleh 'DetailsPage'
type RootStackParamList = {
    ActivityPage: undefined;
    DetailsPage: { item: Customer };
};

// Definisikan tipe untuk navigasi
type ActivityPageNavigationProp = StackNavigationProp<RootStackParamList, 'ActivityPage'>;

// Interface untuk mendefinisikan tipe data nasabah
interface Customer {
    ljk_code: string;
    office_code: string;
    cif: string;
    id_name: string;
    full_name: string;
}

// Buat konstanta COLORS untuk mengikuti linting dan meningkatkan keterbacaan kode
const COLORS = {
    white: "#FFFFFF",
    gray: "#808080",
    black: "#000000",
    blue: "#0044cc",
    lightGray: "#e0e0e0",
};

export const CustomerListPage = () => {
    // State Declaration
    const navigation = useNavigation<ActivityPageNavigationProp>();
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [customerData, setCustomerData] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetching Data 
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const result = await api.getAllCustomers();

                if (result && result.kind === "ok") {
                    setCustomerData(result.customers);
                } else {
                    console.error("Gagal mengambil data nasabah");
                }
            } catch (error) {
                console.error("Kesalahan saat mengambil data nasabah:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);


    // Filter data berdasarkan query pencarian
    const filteredData = customerData.filter(item =>
        item.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sembunyikan keyboard setelah pencarian dikirim
    const handleSearchSubmit = () => {
        Keyboard.dismiss();
    };

    // Navigasi ke 'DetailsPage' dengan parameter item
    const handleCardPress = (item: Customer) => {
        navigation.navigate("Details", { item });
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text>Memuat data nasabah...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.title}>Fasilitas Nasabah</Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari berdasarkan nama nasabah"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                    }}
                    onFocus={() => setIsFocused(true)} 
                    onBlur={() => setIsFocused(false)} 
                    onSubmitEditing={handleSearchSubmit} 
                />
                <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchIcon}>
                    <FontAwesome name="search" size={20} color={COLORS.gray} />
                </TouchableOpacity>
            </View>

            {/* Render data nasabah yang difilter */}
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.cif}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
                        <View style={styles.cardContent}>
                            <View style={styles.textContainer}>
                                <Text style={styles.cardText}>{item.full_name}</Text>
                                <View style={styles.divider} />
                                <Text style={styles.cardDetails}>{item.id_name}</Text>
                            </View>
                            <Text style={styles.cardCode}>{item.cif}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.cardList}
            />
        </View>
    );
};

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
        backgroundColor: COLORS.white,
        display: "flex",
        flexDirection: "row",
        paddingLeft: spacing.lg,
        paddingVertical: 24,
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 10,
        marginTop: 20,
    },
    searchContainer: {
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderBottomWidth: 0,
        borderRadius: 8,
        flexDirection: "row",
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg + 60,
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
        fontSize: 18,
        fontWeight: "bold",
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        marginVertical: 10,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardContent: {
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textContainer: {
        flex: 1,
    },
    cardText: {
        fontSize: 16,
        fontWeight: "700",
    },
    cardDetails: {
        color: COLORS.gray,
        fontSize: 14,
    },
    cardCode: {
        color: COLORS.gray,
        fontSize: 14,
        fontWeight: "600",
        marginLeft: spacing.md,
    },
    divider: {
        borderBottomColor: COLORS.lightGray,
        borderBottomWidth: 1,
        marginVertical: spacing.sm,
    },
    cardList: {
        paddingBottom: spacing.lg,
        paddingTop: spacing.xl + 100,
    },
});

export default CustomerListPage;
