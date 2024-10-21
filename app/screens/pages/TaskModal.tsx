import React, { FC, useEffect, useState } from "react"
import {
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  View,
  StyleSheet,
  Linking,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { BlurView } from "@react-native-community/blur"
import Icon from "react-native-vector-icons/Ionicons" 
import styles from "../../theme/KalenderStyles"
import { colors } from "../../theme/colorsActivity"
import { TaskItems } from "./types"
import { supabaseClient } from "app/utils/supabaseClient"
import DateTimePicker from '@react-native-community/datetimepicker'

interface TaskModalProps {
  visible: boolean
  onClose: () => void
  setItems: React.Dispatch<React.SetStateAction<TaskItems>>
  selectedDate: string
}

const TaskModal: FC<TaskModalProps> = ({ visible, onClose, setItems, selectedDate }) => {
  const [judulKegiatan, setJudulKegiatan] = useState("")
  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState("")
  const [waktuKegiatan, setWaktuKegiatan] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [tanggalKegiatan, setTanggalKegiatan] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [namaJalan, setNamaJalan] = useState("")
  const [titles, setTitles] = useState<string[]>([])
  const [isCustomTitle, setIsCustomTitle] = useState(false)

  useEffect(() => {
    const fetchTitles = async () => {
      const { data, error } = await supabaseClient
        .from("events_title")
        .select("title")

      if (error) {
        console.error("Error fetching titles:", error)
      } else {
        const titlesArray = data.map((item: { title: string }) => item.title)
        console.log("Titles array:", titlesArray) 
        setTitles(titlesArray)
      }
    }

    fetchTitles()
  }, [])

  const addItem = async () => {
    if (!judulKegiatan || !deskripsiKegiatan) {
      Alert.alert("Error", "Judul dan Deskripsi harus diisi.")
      return
    }

    const newItem = {
      judulKegiatan,
      deskripsiKegiatan,
      waktuKegiatan: formatTime(waktuKegiatan),  
      status: "To Do",
      date: selectedDate,
      lokasi: namaJalan,
    }

    try {
      const { data, error } = await supabaseClient
        .from('tasks')
        .insert([{
          judul_kegiatan: newItem.judulKegiatan,
          deskripsi_kegiatan: newItem.deskripsiKegiatan,
          waktu_kegiatan: newItem.waktuKegiatan,  
          date: tanggalKegiatan.toISOString().split('T')[0],
          status: newItem.status,
          date: newItem.date,
          lokasi: newItem.lokasi,
        }])

      if (error) {
        console.error('Error inserting data:', error)
        Alert.alert("Error", "Gagal menyimpan kegiatan.")
      } else {
        Alert.alert("Sukses", "Kegiatan berhasil disimpan.")

        setItems((prevItems: TaskItems) => ({
          ...prevItems,
          [selectedDate]: [...(prevItems[selectedDate] || []), newItem],
        }))

        onClose()
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      Alert.alert("Error", "Terjadi kesalahan tak terduga.")
    }
  }

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const onChangeTime = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || waktuKegiatan
    setShowTimePicker(false)
    setWaktuKegiatan(currentDate)
  }

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || tanggalKegiatan
    setShowDatePicker(false)
    setTanggalKegiatan(currentDate)
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(namaJalan)}`
    Linking.openURL(url).catch((err) => console.error("Failed to open Google Maps", err))
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <BlurView style={styles.blurContent}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tambah Kegiatan</Text>

          <Text style={styles.modalDescription}>Judul Kegiatan</Text>
          <Picker
            selectedValue={isCustomTitle ? "Custom" : judulKegiatan}
            onValueChange={(value) => {
              if (value === "Custom") {
                setIsCustomTitle(true)
                setJudulKegiatan("")
              } else {
                setIsCustomTitle(false)
                setJudulKegiatan(value)
              }
            }}
            style={styles.picker}
          >
            {titles.map((title, index) => (
              <Picker.Item label={title} value={title} key={index} />
            ))}
            <Picker.Item label="Isi Sendiri .." value="Custom" />
          </Picker>

          {isCustomTitle && (
            <TextInput
              placeholder="Masukkan judul kegiatan"
              value={judulKegiatan}
              onChangeText={setJudulKegiatan}
              style={styles.box}
            />
          )}

          <Text style={styles.modalDescription}>Deskripsi Kegiatan</Text>
          <TextInput
            placeholder="Deskripsi Kegiatan"
            value={deskripsiKegiatan}
            onChangeText={setDeskripsiKegiatan}
            style={styles.box}
            multiline
          />

          <Text style={styles.modalDescription}>Atur Tanggal</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.timePickerContainer}
            >
              <Text style={styles.timePickerText}>
                {tanggalKegiatan.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={tanggalKegiatan}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

          <Text style={styles.modalDescription}>Atur Waktu</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.timePickerContainer}
          >
            <Text style={styles.timePickerText}>{waktuKegiatan.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={waktuKegiatan}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeTime}
            />
          )}

          <Text style={styles.modalDescription}>Lokasi</Text>
          <View style={styles.box}>
            <View style={styles.modalRow}>
              <TextInput
                placeholder="Masukkan nama jalan"
                value={namaJalan}
                onChangeText={setNamaJalan}
              />
              <Icon
                name="location-outline"
                onPress={openGoogleMaps}
                size={20}
                color={colors.palette.primary}
                style={styles.iconRight}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonSubmit, { backgroundColor: colors.cancelButton }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Tutup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonSubmit, { backgroundColor: colors.palette.primary200 }]}
              onPress={addItem}
            >
              <Text style={styles.buttonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  )
}

export default TaskModal
