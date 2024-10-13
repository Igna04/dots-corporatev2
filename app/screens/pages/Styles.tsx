/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';

export const StyleBluetooth = StyleSheet.create({
    bluetoothInfo: {
        color: '#FFC806',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    bluetoothStatus: (color: string) => ({
        backgroundColor: color,
        padding: 8,
        borderRadius: 2,
        color: 'white',
        paddingHorizontal: 14,
        marginBottom: 20,
    }),
    bluetoothStatusContainer: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end'
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    containerList: {
        flex: 1,
        flexDirection: 'column'
    },
    printerInfo: {
        color: '#E9493F',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12
    },
});
