/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    DeviceEventEmitter,
    NativeEventEmitter,
    PermissionsAndroid,
    Platform,
    ScrollView,
    ToastAndroid,
    Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Screen, Text } from "../../components";
import { colors, spacing } from "app/theme";
import { useNavigation } from "@react-navigation/native";
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import ItemList from './ItemList';
import SamplePrint from './SamplePrint';
import { StyleBluetooth } from './Styles';

interface BluetoothPageProps {
    route: any; // You may want to add a more specific type depending on the route structure
}

interface BluetoothDevice {
    name: string;
    address: string;
}

export const BluetoothPage: React.FC<BluetoothPageProps> = ({ route }) => {
    const navigation = useNavigation();
    const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
    const [foundDs, setFoundDs] = useState<BluetoothDevice[]>([]);
    const [bleOpend, setBleOpend] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>('');
    const [boundAddress, setBoundAddress] = useState<string>('');

    useEffect(() => {
        BluetoothManager.isBluetoothEnabled().then(
            (enabled: boolean) => {
                setBleOpend(Boolean(enabled));
                setLoading(false);
            },
            err => {
                // Handle error if necessary
            },
        );

        if (Platform.OS === 'ios') {
            const bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
            bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, deviceAlreadPaired);
            bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, deviceFoundEvent);
            bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
                setName('');
                setBoundAddress('');
            });
        } else if (Platform.OS === 'android') {
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, deviceAlreadPaired);
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, deviceFoundEvent);
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
                setName('');
                setBoundAddress('');
            });
            DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
                ToastAndroid.show('Device Not Support Bluetooth!', ToastAndroid.LONG);
            });
        }

        if (pairedDevices.length < 1) {
            scan();
        }
    }, [boundAddress, pairedDevices, scan]);

    const deviceAlreadPaired = useCallback(
        (rsp: any) => {
            let ds: BluetoothDevice[] | null = null;
            if (typeof rsp.devices === 'object') {
                ds = rsp.devices;
            } else {
                try {
                    ds = JSON.parse(rsp.devices);
                } catch (e) {
                    // Handle error if necessary
                }
            }
            if (ds && ds.length) {
                let pared = pairedDevices;
                if (pared.length < 1) {
                    pared = pared.concat(ds || []);
                }
                setPairedDevices(pared);
            }
        },
        [pairedDevices],
    );

    const deviceFoundEvent = useCallback(
        (rsp: any) => {
            let r: BluetoothDevice | null = null;
            try {
                if (typeof rsp.device === 'object') {
                    r = rsp.device;
                } else {
                    r = JSON.parse(rsp.device);
                }
            } catch (e) {
                // Handle error if necessary
            }

            if (r) {
                let found = foundDs || [];
                if (found.findIndex) {
                    const duplicated = found.findIndex((x: BluetoothDevice) => x.address === r.address);
                    if (duplicated === -1) {
                        found.push(r);
                        setFoundDs(found);
                    }
                }
            }
        },
        [foundDs],
    );

    const connect = (row: BluetoothDevice) => {
        setLoading(true);
        BluetoothManager.connect(row.address).then(
            s => {
                setLoading(false);
                setBoundAddress(row.address);
                setName(row.name || 'UNKNOWN');
            },
            e => {
                setLoading(false);
                alert(e);
            },
        );
    };

    const unPair = (address: string) => {
        setLoading(true);
        BluetoothManager.unpaire(address).then(
            s => {
                setLoading(false);
                setBoundAddress('');
                setName('');
            },
            e => {
                setLoading(false);
                alert(e);
            },
        );
    };

    const scanDevices = useCallback(() => {
        setLoading(true);
        BluetoothManager.scanDevices().then(
            (s: any) => {
                let found = s.found;
                try {
                    found = JSON.parse(found);
                } catch (e) {
                    // Ignore parse error
                }
                let fds = foundDs;
                if (found && found.length) {
                    fds = found;
                }
                setFoundDs(fds);
                setLoading(false);
            },
            er => {
                setLoading(false);
                // Handle error if necessary
            },
        );
    }, [foundDs]);

    const scan = useCallback(() => {
        try {
            async function blueTooth() {
                const permissions = {
                    title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
                    message: 'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
                    buttonNeutral: 'Lain Waktu',
                    buttonNegative: 'Tidak',
                    buttonPositive: 'Boleh',
                };

                const bluetoothConnectGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    permissions,
                );
                if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
                    const bluetoothScanGranted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                        permissions,
                    );
                    if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
                        scanDevices();
                    }
                } else {
                    // Ignore access denied
                }
            }
            blueTooth();
        } catch (err) {
            console.warn(err);
        }
    }, [scanDevices]);

    const scanBluetoothDevice = async () => {
        setLoading(true);
        try {
            const request = await requestMultiple([
                PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ]);

            if (request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED) {
                scanDevices();
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
        }
    };

    return (

        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Konfigurasi Bluetooth</Text>
            </View>

            <ScrollView style={StyleBluetooth.container}>
                <View style={StyleBluetooth.bluetoothStatusContainer}>
                    <Text style={StyleBluetooth.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
                        Bluetooth {bleOpend ? 'Aktif' : 'Non Aktif'}
                    </Text>
                </View>
                {!bleOpend && <Text style={StyleBluetooth.bluetoothInfo}>Mohon aktifkan bluetooth anda</Text>}
                <Text style={StyleBluetooth.sectionTitle}>Printer yang terhubung ke aplikasi:</Text>
                {boundAddress.length > 0 && (
                    <ItemList
                        label={name}
                        value={boundAddress}
                        onPress={() => unPair(boundAddress)}
                        actionText="Putus"
                        color="#E9493F"
                    />
                )}
                {boundAddress.length < 1 && <Text style={StyleBluetooth.printerInfo}>Belum ada printer yang terhubung</Text>}
                <Text style={StyleBluetooth.sectionTitle}>Bluetooth yang terhubung ke HP ini:</Text>
                {loading ? <ActivityIndicator animating={true} /> : null}
                <View style={StyleBluetooth.containerList}>
                    {pairedDevices.map((item, index) => (
                        <ItemList
                            key={index}
                            onPress={() => connect(item)}
                            label={item.name}
                            value={item.address}
                            connected={item.address === boundAddress}
                            actionText="Hubungkan"
                            color="#00BCD4"
                        />
                    ))}
                </View>
                <SamplePrint />
                <Button onPress={scanBluetoothDevice} title="Scan Bluetooth" />
                <View style={{ height: 100 }} />
            </ScrollView>
        </Screen>

    );
};

export default BluetoothPage;


const styles = StyleSheet.create({
    backButton: {
        marginRight: 8,
    },
    webViewContainer: {
        flex: 1, 
        marginTop: spacing.lg + 40, 
        height: 500, 
    },
    webView: {
        flex: 1, 
    },
    header: {
        alignItems: "center",
        backgroundColor: colors.primaryColor,
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
        color: colors.primaryText,
        fontSize: 18,
        fontWeight: "bold",
    },
});
