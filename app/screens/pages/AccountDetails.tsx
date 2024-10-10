/* eslint-disable react-native/no-color-literals */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../components'; // Assuming you have a Screen component
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { RootStackParamList } from 'app/screens/pages/navigation/navigationTypes'; // Adjust the path as needed
import { spacing } from '../../theme'; // Assuming you have spacing available
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component

// Define the props for this screen
type AccountDetailsRouteProp = RouteProp<RootStackParamList, 'AccountDetails'>;

export const AccountDetails: React.FC = () => {
    const route = useRoute<AccountDetailsRouteProp>();
    const navigation = useNavigation(); // Use navigation to go back and navigate to other screens
    const { accountNumber } = route.params || {}; // Handle undefined params

    // Fungsi untuk navigasi ke halaman SavingsDepositPage2
    const handleSavingsDepositPress = () => {
        navigation.navigate('SavingsDeposit2', { accountNumber });
    };

    // Fungsi untuk navigasi ke halaman WithdrawalSavings
    const handleSavingsWithdrawalPress = () => {
        navigation.navigate('WithdrawalSavings', { accountNumber });
    };

    return (
        <Screen preset="scroll" contentContainerStyle={styles.screenContainer} safeAreaEdges={["top"]}>
            {/* Header Section */}
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Details')} style={styles.backButton}>
                <FontAwesome name="arrow-left" size={18} color="black" />
            </TouchableOpacity>
                <Text style={styles.headerTitle}>Tabungan</Text>
            </View>

            {/* Konten Scrollable di bawah header */}
            <View style={styles.container}>
                {/* QR Code Display */}
                <View style={styles.qrContainer}>
                    <QRCode
                        value={accountNumber || '00102010007783'} // Use accountNumber for QR code value
                        size={150} // Adjust the size as needed
                    />
                    <TouchableOpacity>
                        <Text style={styles.printButton}>PRINT</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Information */}
                <Text style={styles.accountTitle}>Tab Umum</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.smallLabel}>Nama Lengkap</Text>
                    <Text style={styles.infoText}>KARNAEN LUBIS</Text>
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.smallLabel}>Nomor Rekening</Text>
                    <Text style={styles.infoText}>{accountNumber || '00102010007783'}</Text>
                </View>

                {/* Action Buttons */}
                <Text style={styles.actionTitle}>Aksi</Text>
                <View style={styles.actions}>
                    {/* Setoran Tabungan */}
                    <TouchableOpacity style={styles.actionButton} onPress={handleSavingsDepositPress}>
                        <FontAwesome name="credit-card" size={40} color="orange" /> 
                        <Text style={styles.actionText}>Setoran Tabungan</Text>
                    </TouchableOpacity>

                    {/* Penarikan Tabungan */}
                    <TouchableOpacity style={styles.actionButton} onPress={handleSavingsWithdrawalPress}>
                        <FontAwesome name="money" size={40} color="orange" /> 
                        <Text style={styles.actionText}>Penarikan Tabungan</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    accountTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    actionButton: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        width: '45%',
    },
    actionText: {
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
        width: '100%',
    },
    backButton: {
        marginRight: 8,
    },
    container: {
        alignItems: 'center',
        paddingTop: 100, // Adjust padding for header
        padding: 20,
    },
    header: {
        alignItems: "center",
        backgroundColor: "white",
        elevation: 2,
        flexDirection: "row",
        paddingLeft: spacing.lg,
        paddingVertical: 24,
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 10, // Add shadow for header
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        marginVertical: 10,
        padding: 15,
        width: '100%', // Full width for the card
    },
    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    printButton: {
        color: '#007bff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    screenContainer: {
        backgroundColor: "#F4F4F4",
        flexGrow: 1,
    },
    smallLabel: {
        color: 'gray',
        fontSize: 14,
    },
});
