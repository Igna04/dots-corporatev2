/* eslint-disable react-native/no-color-literals */
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Screen, Text } from "../../components";
import { spacing } from "app/theme";
import { useNavigation } from "@react-navigation/native";
import { WebView } from 'react-native-webview'; // Import WebView

export const LoanPage: React.FC = ({ route }) => {
    const navigation = useNavigation();

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Peminjaman</Text>
            </View>

            <View style={styles.webViewContainer}>
                <WebView
                    source={{ uri: 'https://dynamic-webform-react.vercel.app/form-ksm' }}
                    style={styles.webView}
                    startInLoadingState={true} // Show loading state while the page is loading
                    javaScriptEnabled={true} // Enable JavaScript
                />
            </View>

        </Screen>
    );
};

const styles = StyleSheet.create({
    backButton: {
        marginRight: 8,
    },
    webViewContainer: {
        flex: 1, // Make WebView container take the available space
        marginTop: spacing.lg + 40, // Adjust margin to avoid overlap with header
        height: 500, // Set specific height if needed
    },
    webView: {
        flex: 1, // Make WebView take the available space inside its container
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

export default LoanPage;
