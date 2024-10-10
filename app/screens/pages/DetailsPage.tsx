/* eslint-disable react-native/no-color-literals */
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg'; // Install this package
import { Buffer } from 'buffer'; // Import buffer for encoding to base64

export const DetailsPage = ({ route }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Tabungan'); // New state to manage tab selection

    const { item } = route.params || {
        item: {
            name: 'No Name',
            cif: 'No CIF',
            phone: '-',
            email: '-',
            address: 'No Address'
        }
    };

    // Fungsi untuk navigasi ke halaman AccountDetails
    const handleAccountDetailsPress = () => {
        navigation.navigate('AccountDetails', { accountNumber: '00102010007783' });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Tabungan':
                return (
                    <View>
                        {/* Bagian yang bisa diklik untuk navigasi */}
                        <TouchableOpacity style={styles.walletContainer} onPress={handleAccountDetailsPress}>
                            <FontAwesome name="money" size={24} color="gray" />
                            <View style={styles.walletDetails}>
                                <Text style={styles.walletText}>00102010007783</Text>
                                <Text style={styles.walletLabel}>Tab Umum</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            case 'Kredit':
                return <Text style={styles.tabContent}>Data Kredit</Text>;
            case 'Log':
                return <Text style={styles.tabContent}>Data Log</Text>;
            default:
                return null;
        }
    };

    // Assuming `item.cif` is defined and available
    const jsonData = JSON.stringify({ type: 'customer', cif: item.cif });

    // Encode JSON data to base64
    const base64Data = Buffer.from(jsonData).toString('base64');

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('CustomerList')} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{item.full_name}</Text>
            </View>

            <View style={styles.container}>
                {/* QR Code Display */}
                <QRCode
                    value={base64Data || 'default'}
                    size={150} // Adjust size as needed
                />

                {/* Print Ecpos Printer  */}
                <TouchableOpacity style={styles.printButton}>
                    <Text style={styles.printText}>PRINT</Text>
                </TouchableOpacity>

                {/* User Information */}
                <View style={styles.smallInfoCard}>
                    <Text style={styles.smallLabel}>Nama Lengkap</Text>
                    <Text style={styles.smallInfo}>{item.full_name}</Text>
                </View>

                {/* CIF and No. Handphone side-by-side */}
                <View style={styles.horizontalRow}>
                    <View style={styles.smallInfoCardHalf}>
                        <Text style={styles.smallLabel}>CIF</Text>
                        <Text style={styles.smallInfo}>{item.cif}</Text>
                    </View>
                    <View style={styles.smallInfoCardHalf}>
                        <Text style={styles.smallLabel}>No. Handphone</Text>
                        <Text style={styles.smallInfo}>{item.phone || '-'}</Text>
                    </View>
                </View>

                <View style={styles.smallInfoCard}>
                    <Text style={styles.smallLabel}>Email</Text>
                    <Text style={styles.smallInfo}>{item.email || '-'}</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Alamat</Text>
                    <Text style={styles.info}>{item.address}</Text>
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'Tabungan' && styles.activeTab]}
                        onPress={() => setActiveTab('Tabungan')}
                    >
                        <Text style={activeTab === 'Tabungan' ? styles.activeTabText : styles.tabText}>Tabungan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'Kredit' && styles.activeTab]}
                        onPress={() => setActiveTab('Kredit')}
                    >
                        <Text style={activeTab === 'Kredit' ? styles.activeTabText : styles.tabText}>Kredit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'Log' && styles.activeTab]}
                        onPress={() => setActiveTab('Log')}
                    >
                        <Text style={activeTab === 'Log' ? styles.activeTabText : styles.tabText}>Log</Text>
                    </TouchableOpacity>
                </View>

                {/* Render Tab Content */}
                <View style={styles.tabContentContainer}>
                    {renderContent()}
                </View>

            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    activeTab: {
        borderBottomColor: '#007bff',
    },
    activeTabText: {
        color: '#007bff',
        fontSize: 16,
    },
    backButton: {
        marginRight: 8,
    },
    container: {
        alignItems: 'center',
        paddingTop: 40,
        padding: 20,
    },
    header: {
        alignItems: "center",
        backgroundColor: "white",
        flexDirection: "row",
        paddingLeft: spacing.lg,
        paddingVertical: 24,
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 10,
    },
    horizontalRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '100%',
    },
    info: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        marginTop: 10,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        width: '100%',
    },
    label: {
        color: 'gray',
        fontSize: 14,
    },
    printButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginTop: 20,
        paddingHorizontal: 50,
        paddingVertical: 5,
    },
    printText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: spacing.lg,
        paddingTop: spacing.xl + 24,
    },
    smallInfo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 3,
    },
    smallInfoCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        marginTop: 10,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        width: '100%',
    },
    smallInfoCardHalf: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        marginTop: 10,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        width: '48%',
    },
    smallLabel: {
        color: 'gray',
        fontSize: 12,
    },
    tabButton: {
        alignItems: 'center',
        borderBottomColor: 'transparent',
        borderBottomWidth: 2,
        flex: 1,
        padding: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '100%',
    },
    tabContent: {
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
    },
    tabContentContainer: {
        marginTop: 20,
        width: '100%',
    },
    tabText: {
        color: 'gray',
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    walletContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
    },
    walletDetails: {
        flexDirection: 'column',
        marginLeft: 25,
    },
    walletLabel: {
        color: 'gray',
        fontSize: 14,
        marginTop: 5,
    },
    walletText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
