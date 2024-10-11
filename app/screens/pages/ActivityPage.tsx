/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useState, useRef } from "react";
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView, ViewStyle, Modal, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Screen, Text } from "../../components";
import { colors, spacing } from "app/theme";
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

export const ActivityPage = () => {
    const navigation = useNavigation();
    const scrollViewRef = useRef<ScrollView>(null);

    // State untuk menyimpan daftar aktivitas
    const [activities, setActivities] = useState([]);

    const [activityName, setActivityName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [assignedTo, setAssignedTo] = useState("");
    const [attachment, setAttachment] = useState("");
    const [attachmentType, setAttachmentType] = useState(""); // Menambahkan state untuk attachment type

    // State untuk modal dan lainnya
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [modalType, setModalType] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false); // Menambahkan state untuk menampilkan DatePicker

    const handleSubmit = () => {
        if (activityName && description && date) {
            const newActivity = {
                id: Math.random().toString(), // ID unik
                title: activityName,
                description,
                date: date.toISOString().split('T')[0], // Format tanggal sebagai string
                assignedTo,
                attachment,
            };

            // Menambahkan aktivitas baru ke dalam daftar
            setActivities((prevActivities) => [...prevActivities, newActivity]);

            // Reset input setelah menambahkan
            setActivityName("");
            setDescription("");
            setDate(new Date()); // Reset tanggal
            setAssignedTo("");
            setAttachment("");
            setAttachmentType(""); // Reset attachmentType

            // Navigasi ke halaman berikutnya dengan daftar aktivitas terbaru
            navigation.navigate("DemoCommunity", { activities: [...activities, newActivity] });
        } else {
            Alert.alert("Error", "Please fill all the fields");
        }
    };

    // Fungsi untuk menangani perubahan tanggal dari DateTimePicker
    const onChangeDate = (event: any, selectedDate: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios'); // Sembunyikan picker setelah memilih tanggal pada Android
        setDate(currentDate); // Set tanggal yang dipilih
    };

    const handleUserSearch = () => {
        setModalType("user"); // Set modal type to "user"
        setModalVisible(true); // Open the modal
    };

    const handleAttachmentSearch = () => {
        setModalType("attachment"); // Set modal type to "attachment"
        setModalVisible(true); // Open the modal
    };

    const handleModalSubmit = () => {
        if (modalType === "user") {
            Alert.alert("Username Submitted", `Searching for user: ${username}`);
            setAssignedTo(username); // Set assignedTo dengan username yang dipilih
        } else if (modalType === "attachment") {
            Alert.alert("Attachment Submitted", `Adding attachment: ${username}`);
            setAttachment(username); // Set attachment dengan nama file atau link yang dipilih
        }
        setModalVisible(false); // Close the modal after submission
        setUsername(""); // Reset the input field
    };

    return (
        <Screen preset="scroll" contentContainerStyle={styles.scrollContainer} safeAreaEdges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('DemoCommunity')} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Buat Aktivitas</Text>
            </View>
            <ScrollView ref={scrollViewRef} contentContainerStyle={$container} showsVerticalScrollIndicator={false}>

                {/* Section Umum dengan background putih dan rounded corners */}
                <View style={styles.sectionContainerUmum}>
                    <Text style={styles.sectionTitle}>Umum</Text>
                    <Text style={styles.label}>Judul:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter activity title"
                            value={activityName}
                            onChangeText={setActivityName}
                        />
                    </View>

                    <Text style={styles.label}>Deskripsi (optional):</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.label}>Waktu:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Select date"
                            value={date.toISOString().split('T')[0]} // Menampilkan tanggal yang dipilih
                            editable={false} // Tidak bisa diinput secara manual
                        />
                        <TouchableOpacity style={styles.iconWrapper} onPress={() => setShowDatePicker(true)}>
                            <FontAwesome name="calendar" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}

                    <Text style={styles.label}>Ditugaskan pada:</Text>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={handleUserSearch}>
                            <TextInput
                                style={styles.input}
                                placeholder="Assign to"
                                value={assignedTo}
                                editable={false} // Prevent manual input
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconWrapper} onPress={handleUserSearch}>
                            <FontAwesome name="user" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Gap antara section Umum dan Lampiran */}
                <View style={styles.gap} />

                {/* Section Lampiran dengan background putih dan rounded corners */}
                <View style={styles.sectionContainerLampiran}>
                    <Text style={styles.sectionTitleLampiran}>Lampiran</Text>

                    <Text style={styles.label}>Tipe Lampiran:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Attachment type"
                            value={attachmentType}
                            onChangeText={setAttachmentType}
                        />
                    </View>

                    <Text style={styles.label}>Lampiran:</Text>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={handleAttachmentSearch}>
                            <TextInput
                                style={styles.input}
                                placeholder="Add attachment"
                                value={attachment}
                                editable={false} // Disable manual input
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconWrapper} onPress={handleAttachmentSearch}>
                            <FontAwesome name="paperclip" size={18} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.submitButtonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>

            {/* Modal for both username and attachment input */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{modalType === "user" ? "Cari User" : "Add Attachment"}</Text>
                        <View style={styles.modalInputContainer}>
                            <TextInput
                                style={styles.modalInput}
                                placeholder={modalType === "user" ? "Masukkan username" : "Enter attachment"}
                                value={username}
                                onChangeText={setUsername}
                            />
                            <TouchableOpacity style={styles.searchIconWrapper} onPress={handleModalSubmit}>
                                <FontAwesome name="search" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCloseText}>Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Screen>
    );
};

const $container: ViewStyle = {
    paddingTop: spacing.lg + spacing.xl,
    paddingHorizontal: spacing.lg,
};

const styles = StyleSheet.create({
    backButton: {
        marginRight: 8,
    },
    button: {
        backgroundColor: "darkorange",
        borderRadius: 25,
        elevation: 3,
        paddingHorizontal: 20,
        paddingVertical: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    gap: {
        height: 24, // Gap antara dua section
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
        width: '100%',
        zIndex: 10,
    },
    iconWrapper: {
        padding: 8,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 8,
    },
    inputContainer: {
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderColor: "#ccc",
        borderRadius: 5,
        borderWidth: 1,
        flexDirection: "row",
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    modalBackground: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        flex: 1,
        justifyContent: "center", // Background blur effect
    },
    modalCloseText: {
        color: "blue",
        marginTop: 10,
    },
    modalContainer: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "80%",
    },
    modalInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    modalInputContainer: {
        alignItems: "center",
        borderColor: "gray",
        borderRadius: 5,
        borderWidth: 1,
        flexDirection: "row",
        marginBottom: 20,
        paddingHorizontal: 10,
        width: "100%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: spacing.lg,
    },
    searchIconWrapper: {
        padding: 10,
    },
    sectionContainerUmum: {
        marginTop: 36,
        backgroundColor: "white", // Background color putih
        borderRadius: 10, // Rounded corners
        padding: 16, // Padding dalam section
        shadowColor: "#000", // Shadow untuk depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionContainerLampiran: {
        backgroundColor: "white", // Background color putih
        borderRadius: 10, // Rounded corners
        padding: 16, // Padding dalam section
        shadowColor: "#000", // Shadow untuk depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    sectionTitleLampiran: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 24,
    },
    submitButtonContainer: {
        marginBottom: 40,
        marginTop: 20,
    },
    textArea: {
        backgroundColor: "#f9f9f9",
        borderColor: "#ccc",
        borderRadius: 5,
        borderWidth: 1,
        height: 120,
        marginBottom: 16,
        paddingHorizontal: 8,
        paddingVertical: 10,
        textAlignVertical: "top",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.primaryText,
    },
});

export default ActivityPage;

