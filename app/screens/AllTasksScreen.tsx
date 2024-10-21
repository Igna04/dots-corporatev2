import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from "react-native"
import { Calendar } from "react-native-calendars"
import Icon from "react-native-vector-icons/Ionicons"
import { colors, spacing } from "../theme"
import { useNavigation } from "@react-navigation/native"
import { supabaseClient } from "app/utils/supabaseClient"

export const AllTasksScreen = () => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isSelectingStart, setIsSelectingStart] = useState(false)
  const [tasks, setTasks] = useState([]) 
  const navigation = useNavigation()

  const handleDateChange = (day) => {
    if (isSelectingStart) {
      setStartDate(day.dateString)
      setIsSelectingStart(false)
    } else {
      if (day.dateString > startDate) {
        setEndDate(day.dateString)
      } else {
        Alert.alert("Peringatan", "Tanggal akhir harus lebih dari tanggal mulai!")
      }
    }
  }

  const fetchTasks = async () => {
  if (!startDate || !endDate) {
    Alert.alert("Peringatan", "Silakan pilih rentang tanggal sebelum melanjutkan!");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('tasks')
      .select('*')
      .gte('date', startDate)  
      .lte('date', endDate)    

    if (error) throw error;

    if (data.length === 0) {
      Alert.alert("Pemberitahuan", "Tidak ada kegiatan pada rentang tanggal tersebut.");
      return;
    }

    setTasks(data);  
  } catch (error) {
    Alert.alert("Error", error.message);
  }
}

  const showUserGuide = () => {
    Alert.alert(
      "Panduan Pengguna",
      "Klik kotak 'Dari' untuk memilih tanggal mulai.\nKlik kotak 'Sampai' untuk memilih tanggal akhir setelahnya.",
      [{ text: "OK", onPress: () => console.log("User guide closed") }]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text><Icon name="arrow-back" size={24} color={colors.primaryText} /></Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Pilih Tanggal</Text>
        <TouchableOpacity onPress={showUserGuide} style={styles.helpIcon}>
          <Text><Icon name="help-circle-outline" size={24} color={colors.primaryText} /></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.datePickersContainer}>
        <TouchableOpacity 
          style={[styles.dateBox, startDate ? styles.selectedDateBox : styles.unselectedDateBox]} 
          onPress={() => setIsSelectingStart(true)}
        >
          <Text style={styles.dateLabel}>Dari</Text>
          <Text style={styles.dateText}>{startDate ? startDate : "Pilih Tanggal"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.dateBox, endDate ? styles.selectedDateBox : styles.unselectedDateBox]} 
          onPress={() => setIsSelectingStart(false)}
        >
          <Text style={styles.dateLabel}>Sampai</Text>
          <Text style={styles.dateText}>{endDate ? endDate : "Pilih Tanggal"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={{
            [startDate]: { startingDay: true, color: colors.primaryColor, textColor: "white" },
            [endDate]: { endingDay: true, color: colors.primaryColor, textColor: "white" },
          }}
          onDayPress={handleDateChange}
          markingType="period"
          monthFormat={"MMMM yyyy"}
          hideExtraDays={true}
          theme={{
            todayTextColor: colors.primaryColor,
            arrowColor: colors.primaryColor,
            selectedDayBackgroundColor: colors.primaryColor,
            selectedDayTextColor: "#ffffff",
          }}
        />
      </View>

      <TouchableOpacity 
        style={styles.applyButton} 
        onPress={fetchTasks}
      >
        <Text style={styles.applyButtonText}>Cari Kegiatan</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TaskItem', { item })}>
            <View style={styles.taskItem}>
              <Text>{item.judul_kegiatan}</Text>
              <Text>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  applyButton: {
    borderRadius: 10,
    backgroundColor: colors.primaryColor,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  calendarContainer: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  dateBox: {
    alignItems: "center",
    borderRadius: 5,
    flex: 1,
    marginHorizontal: spacing.sm,
    padding: spacing.md,  
  },
  dateLabel: {
    fontSize: 14,
    color: "#666",
  },
  datePickersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primaryColor,  
  },
  headerText: {
    fontSize: 20,
    color: colors.primaryText,
    marginLeft: spacing.sm,
  },
  helpIcon: {
    marginRight: spacing.sm,
  },
  selectedDateBox: {
    backgroundColor: "#cceeff",
    borderColor: "#007bff",
    borderWidth: 1,
  },
  unselectedDateBox: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  taskItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
})
