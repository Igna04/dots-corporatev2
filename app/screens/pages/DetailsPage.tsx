/* eslint-disable react-native/no-color-literals */
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Buffer } from 'buffer';

export const DetailsPage = ({ route }) => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Tabungan');
    const { item, accountNumber } = route.params || {
        item: {
            name: 'No Name',
            cif: 'No CIF',
            phone: '-',
            email: '-',
            address: 'No Address'
        }
    };

    const handleAccountDetailsPress = () => {
        navigation.navigate('AccountDetails', {
            accountNumber: accountNumber,
            name: item.full_name, // Ganti ini untuk mengirim name
        });
        console.log('Navigating to AccountDetails with data:');
        console.log('Account Number:', accountNumber);
        console.log('Customer Name:', item.full_name); // Tambahkan log untuk memeriksa nama
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Tabungan':
                return (
                    <View>
                        {accountNumber ? (
                            <TouchableOpacity style={styles.walletContainer} onPress={handleAccountDetailsPress}>
                                <FontAwesome name="money" size={24} color="gray" />
                                <View style={styles.walletDetails}>
                                    <Text>Account Number: {accountNumber}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
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

    const jsonData = JSON.stringify({ type: 'customer', cif: item.cif });
    const base64Data = Buffer.from(jsonData).toString('base64');

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('CustomerList')} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>{item.full_name}</Text>
            </View>

            <View style={styles.container}>
                <QRCode value={base64Data || 'default'} size={150} />

                <TouchableOpacity style={styles.printButton}>
                    <Text style={styles.printText}>PRINT</Text>
                </TouchableOpacity>

                <View style={styles.smallInfoCard}>
                    <Text style={styles.smallLabel}>Nama Lengkap</Text>
                    <Text style={styles.smallInfo}>{item.full_name}</Text>
                </View>

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
        borderBottomWidth: 2,
    },
    activeTabText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        marginRight: 8,
        padding: 8,
        backgroundColor: '#007bff',
        borderRadius: 8,
    },
    container: {
        alignItems: 'center',
        paddingTop: 40,
        padding: 20,
    },
    header: {
        alignItems: "center",
        backgroundColor: "#007bff",
        flexDirection: "row",
        paddingLeft: spacing.lg,
        paddingVertical: 24,
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 10,
    },
    horizontalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        width: '100%',
    },
    info: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 5,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '100%',
    },
    label: {
        color: '#666',
        fontSize: 14,
    },
    printButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        marginTop: 20,
        paddingHorizontal: 60,
        paddingVertical: 10,
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
        fontWeight: '500',
        marginTop: 3,
        color: '#333',
    },
    smallInfoCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        marginTop: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '100%',
    },
    smallInfoCardHalf: {
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '48%',
    },
    smallLabel: {
        color: '#888',
        fontSize: 12,
    },
    tabButton: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    tabContent: {
        color: '#666',
        fontSize: 18,
    },
    tabContentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 20,
    },
    tabText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        textTransform: "capitalize",
    },
    walletContainer: {
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        flexDirection: 'row',
        marginTop: -30,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '100%',
    },
    walletDetails: {
        marginLeft: 20,
    },
});