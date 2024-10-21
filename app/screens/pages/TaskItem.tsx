import React, { FC, useState, useEffect } from "react";
import { TouchableOpacity, View, Text, Alert, Button, Linking, Modal, TextInput, Image, FlatList, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Card } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import styles from "../../theme/KalenderStyles";
import { colors } from "../../theme/colorsActivity";
import { TaskItems } from "./types"; 
import { supabaseClient } from "app/utils/supabaseClient";

interface Comment {
    id: string;
    text: string;
    timestamp: string;
}

interface TaskItemProps {
    item: {
        id: string;
        judulKegiatan: string;
        deskripsiKegiatan: string;
        waktuKegiatan: string;
        nomorTelepon: number;
        status: string;
        date: string;
        comments: Comment[];
        photoUrl?: string;
        lokasi: string;
        location?: {
            latitude: number;
            longitude: number;
        } | undefined; 
    };
    setItems: React.Dispatch<React.SetStateAction<TaskItems>>;
    selectedStatus: string;
}

export const TaskItem: FC<TaskItemProps> = ({ item, setItems, selectedStatus }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [photoUrl, setPhotoUrl] = useState(item.photoUrl || "");
    const [comments, setComments] = useState<Comment[]>(item.comments || []);

    const changeStatus = () => {
        const nextStatus = item.status === "To Do" 
            ? "In Progress" 
            : item.status === "In Progress" 
                ? "Finished" 
                : "To Do";

        updateItem({ status: nextStatus });
    };

    const handleShowDetails = () => {
        setModalVisible(true);
    };

    const updateItem = (updates: Partial<typeof item>) => {
        setItems((prevItems: TaskItems) => {
            const currentItems = prevItems[item.date] || [];
            const updatedItems = currentItems.map((task) =>
                task.id === item.id ? { ...task, ...updates } : task
            );
            return {
                ...prevItems,
                [item.date]: updatedItems,
            };
        });
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            const newCommentObj: Comment = {
                id: Date.now().toString(),
                text: newComment.trim(),
                timestamp: new Date().toISOString(),
            };

            const { error } = await supabaseClient
                .from('media_comments')
                .insert([
                    {
                        task_id: item.id,
                        comment: newCommentObj.text,
                        photo_url: photoUrl,
                    },
                ]);

            if (error) {
                console.error('Error adding comment to media_comments:', error);
                Alert.alert('Error', 'Gagal menambahkan komentar.');
            } else {
                updateItem({ comments: [...(item.comments || []), newCommentObj] });
                setNewComment("");
                setPhotoUrl("");
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            setPhotoUrl(result.assets[0].uri);
            updateItem({ photoUrl: result.assets[0].uri });
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [5, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            setPhotoUrl(result.assets[0].uri);
            updateItem({ photoUrl: result.assets[0].uri });
        }
    };

    const showPhotoOptions = () => {
        Alert.alert(
            "Ambil Foto",
            "Pilih sumber foto",
            [
                {
                    text: "Dari Galeri",
                    onPress: () => pickImage(),
                },
                {
                    text: "Dari Kamera",
                    onPress: () => takePhoto(),
                },
                {
                    text: "Batal",
                    style: "cancel"
                }
            ],
            { cancelable: true }
        );
    };

    const fetchTaskData = async() => {
        try {
            const { data, error } = await supabaseClient
                .from('media_comments')
                .select('comment, photo_url')
                .eq('task_id', item.id);
            
            if ( error ) {
                console.error('Error fetching comments and photo from media_comments:', error)
            } else {
                if(data && data.length > 0 ) {
                    const fetchedComments: Comment[] = data.map((commentData) => ({
                        id : Date.now().toString(),
                        text : commentData.comment,
                        timestamp : new Date().toISOString(),
                    }));

                    setComments(fetchedComments);
                    if ( data[0].photo_url) {
                        setPhotoUrl(data[0].photo_url);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching task data:', error);
        }
    };

    useEffect(() => {
        if(isModalVisible) {
            fetchTaskData();
        }
    }, [isModalVisible]);

    if (selectedStatus === "All" || item.status === selectedStatus) {
        return (
            <>
                <TouchableOpacity style={styles.touchable} onPress={handleShowDetails}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.cardContent}>
                                <View style={styles.row}>
                                    <Text style={styles.judulKegiatan}>{item.judulKegiatan}</Text>
                                    <TouchableOpacity onPress={() => openGoogleMaps(item)}>
                                        <Icon name="location" size={22} color={colors.palette.primary200} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.description}>{item.deskripsiKegiatan}</Text>
                                <View style={styles.timeRow}>  
                                    <Icon name="time" size={18}  color={colors.palette.primary200}    /> 
                                    <Text style={styles.timeText}>{item.waktuKegiatan}</Text>

                                    <TouchableOpacity style={styles.button} onPress={changeStatus}> 
                                        <Text style={styles.buttonText}>{item.status}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>

                <Modal visible={isModalVisible} animationType="slide">
                <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        keyboardVerticalOffset={Platform.select({ ios: 0, android: 25 })}
                    >
                    <View style={styles.modalContent}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


                        <Text style={styles.modalTitle}>Detail Kegiatan</Text>

                        <Text style={styles.modalDescription}>Judul Kegiatan:</Text>
                            <View style={styles.box}>
                            <View style={styles.modalRow}>
                                <Text style={styles.modalDescription}>{item.judulKegiatan}</Text>
                                <Icon name="information-circle-outline" size={20}  style={styles.iconRight} />
                            </View>
                            </View>


                        <Text style={styles.modalDescription}>Deskripsi:</Text>
                        <View style={styles.box}>
                            <View style={styles.modalRow}>
                                <Text style={styles.modalDescription}>{item.deskripsiKegiatan}</Text>
                                <Icon name="information-circle-outline" size={20} color={colors.palette.primary} />
                            </View>
                        </View>
                        
                        <Text style={styles.modalDescription}>Nomor Telepon:</Text>
                        <View style={styles.box}>
                            <View style={styles.modalRow}>
                                <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.nomorTelepon}`)}>
                                    <Text style={styles.modalDescription}>{item.nomorTelepon}</Text>
                                </TouchableOpacity>
                                <Icon name="call-outline" size={20} color={colors.palette.primary} />
                            </View>
                        </View>
                        
                        <Text style={styles.modalDescription}>Lokasi:</Text>
                        <View style={styles.box}>
                            <View style={styles.modalRow}>
                                <TouchableOpacity onPress={() => openGoogleMaps(item)}>
                                    <Text style={styles.modalDescription} numberOfLines={1}>
                                        {item.lokasi}
                                    </Text>
                                </TouchableOpacity>
                                <Icon name="location-outline" size={20} color={colors.palette.primary} />
                            </View>
                        </View>

                        {/* Box for Photo Section */}
                        <View style={styles.box}>
                            <View style={styles.photoSection}>
                                {photoUrl ? (
                                    <Image source={{ uri: photoUrl }} style={styles.imageStyle} />
                                ) : (
                                    <TouchableOpacity onPress={showPhotoOptions} style={styles.addPhotoContainer}>
                                        <Icon name="add-circle" size={50} color={colors.palette.primary} />
                                        <Text style={styles.noPhotoText}>Tambahkan Foto</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {/* Comment Section */}
                            <FlatList
                                    data={item.comments}
                                    keyExtractor={(comment) => comment.id}
                                    renderItem={({ item: comment }) => (
                                        <View style={styles.commentItem}>
                                            <Text style={styles.commentText}>{comment.text}</Text>
                                            <Text style={styles.timestamp}>{new Date(comment.timestamp).toLocaleString()}</Text>
                                        </View>
                                    )}
                                />
                            <View style={styles.addCommentSection}>
                                <TextInput
                                    placeholder="Tambahkan komentar"
                                    value={newComment}
                                    onChangeText={setNewComment}
                                    style={styles.input}
                                    multiline
                                />
                            </View>
                        </View>
                        </ScrollView>
                        
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={[styles.buttonSubmit, { backgroundColor: colors.palette.grey }]} 
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Tutup</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.buttonSubmit, { backgroundColor: colors.palette.secondary }]} 
                                onPress={handleAddComment}
                            >
                                <Text style={styles.buttonText}>Tambah Komentar</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </>
        );
    }
    return null;
};

const openGoogleMaps = (item: any) => {
    if (item.lokasi) {
        const [latitude, longitude] = item.lokasi.split(", ");
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    }
};

export default TaskItem;
