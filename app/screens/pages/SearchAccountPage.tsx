/* eslint-disable react-native/sort-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-color-literals */
import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Keyboard } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";
import { RootStackParamList } from "app/screens/pages/navigationTypes"; // Import the types
import { StackNavigationProp } from '@react-navigation/stack'; // Import navigation prop

type SearchAccountPageNavigationProp = StackNavigationProp<RootStackParamList, 'SearchAccountPage'>;

export const SearchAccountPage = () => {
    const navigation = useNavigation<SearchAccountPageNavigationProp>();
    const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
    const [isFocused, setIsFocused] = useState(false); // State to track if the search input is focused
    const [searchSubmitted, setSearchSubmitted] = useState(false); // Track when search is submitted

    // Sample data array with names, details, and codes
    const data = [
        { name: "Murniati Lubis", address: "Dusun Pasar Lama RT -/- Sei Rakyat Medang Deras", cif: "0100010" },
        { name: "Karnaen Lubis", address: "Dukuh Hilir Timur 05/01 Dukuh", cif: "9001146" },
        { name: "Jimmy", address: "Pasar Depok", cif: "0100022" },
        { name: "Jimbo", address: "Dukuh Timur", cif: "9001178" },
    ];

    // Filter data based on the search query
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchSubmit = () => {
        // Trigger search when the button is pressed or the enter key is pressed
        setSearchSubmitted(true);
        Keyboard.dismiss(); // Hide the keyboard after submission
    };
    const handleCardPress = (item: { name: string; address: string; cif: string; }) => {
        // Navigate to SavingDepositPage with params
        navigation.navigate("SavingDepositPage", {
          nomorRekening: item.cif,
          namaNasabah: item.name,
          alamatNasabah: item.address,
        });
      };

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Fasilitas Nasabah</Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari berdasarkan nama nasabdah"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        setSearchSubmitted(false); // Reset search submission state when typing
                    }} // Handle search input
                    onFocus={() => setIsFocused(true)} // Set focused state to true when input is focused
                    onBlur={() => setIsFocused(false)} // Set focused state to false when input is blurred
                    onSubmitEditing={handleSearchSubmit} // Trigger search when enter is pressed
                />
                <TouchableOpacity onPress={handleSearchSubmit} style={styles.searchIcon}>
                    <FontAwesome name="search" size={20} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Render filtered names as cards */}
            {searchSubmitted && searchQuery.length > 0 && (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.cif} // Ensure unique keys with the code
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
                            <View style={styles.cardContent}>
                                {/* Container for name and details */}
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardText}>{item.name}</Text>
                                    <View style={styles.divider} />
                                    <Text style={styles.cardDetails}>{item.address}</Text>
                                </View>
                                {/* CIF code */}
                                <Text style={styles.cardCode}>{item.cif}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    style={styles.cardList}
                />
            )}
        </Screen>
    );
};

const styles = StyleSheet.create({
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

    // Styles for the search bar
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        marginVertical: spacing.lg,
        marginHorizontal: spacing.lg,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 0, // No bottom border initially
    },

    searchContainerFocused: {
        borderBottomWidth: 2, // Border bottom appears when focused
        borderBottomColor: "#0044cc", // Active border color
    },

    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        paddingLeft: spacing.sm,
        backgroundColor: "white", // Background color for the input field
        borderRadius: 8, // Rounded corners for the search input field
    },

    searchIcon: {
        paddingLeft: spacing.sm,
    },

    // Card styles
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: spacing.md, // Padding inside the card
        paddingHorizontal: spacing.lg,
        marginVertical: 10, // Space between the cards
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // For Android shadow effect
    },
    cardContent: {
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "space-between", // Ensure name and code are aligned
    },
    textContainer: {
        flex: 1, // Ensures the container fills the remaining space
    },
    cardText: {
        fontSize: 16,
        fontWeight: "700", // Bold text for name
    },
    cardDetails: {
        color: "gray",
        flexShrink: 1,
        fontSize: 14, // Adjust long text
    },
    cardCode: {
        color: "gray",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: spacing.md, // Space between code and details
    },
    divider: {
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: 1,
        marginVertical: spacing.sm,
    },
    cardList: {
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
    },
});

export default SearchAccountPage;
