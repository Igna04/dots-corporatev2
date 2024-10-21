import React, { FC, useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ViewStyle, Alert } from "react-native";
import { observer } from "mobx-react-lite";
import { Drawer } from "react-native-drawer-layout";
import TaskModal from "../screens/pages/TaskModal";
import TaskItem from "../screens/pages/TaskItem";
import TaskStatusFilter from "../screens/pages/TaskStatusFilter";
import { supabaseClient } from "app/utils/supabaseClient";
import { colors, spacing } from "../theme";
import { isRTL } from "../i18n";
import { CustomDrawer } from "./CustomDrawer";
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton";
import { useNavigation } from "@react-navigation/native";

export const DemoActivityScreen: FC = observer(function DemoActivityScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("To Do");
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const navigation = useNavigation();

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data: tasks, error } = await supabaseClient.from("tasks").select("*").eq("date", today);

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    const newItems: any = {};
    const strTime = today;

    if (tasks && tasks.length > 0) {
      newItems[strTime] = tasks.map((task: any) => ({
        id: task.id,
        judulKegiatan: task.judul_kegiatan,
        deskripsiKegiatan: task.deskripsi_kegiatan,
        waktuKegiatan: task.waktu_kegiatan,
        nomorTelepon: task.nomor_telepon,
        status: task.status,
        date: task.date,
        comments: task.comments || [],
        lokasi: task.lokasi,
        location: task.location,
        photoUrl: task.photo_url,
      }));
    } else {
      newItems[strTime] = [];
    }

    setItems(newItems[strTime] || []);
  };

  const filteredItems = items.filter((item) => selectedStatus === "All" || item.status === selectedStatus);

  useEffect(() => {
    if (filteredItems.length === 0) {
      Alert.alert("Tidak Ada Kegiatan", `Tidak ada kegiatan untuk status ${selectedStatus}.`);
    }
  }, [filteredItems, selectedStatus]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="back"
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={() => <CustomDrawer />}
    >
      <View style={$screenContentContainer}>
        <View style={styles.headerContainer}>
          <DrawerIconButton onPress={toggleDrawer} />
          <Text style={styles.headerText}>Aktivitas</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TaskStatusFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskItem
              key={item.id}
              item={item}
              selectedStatus={selectedStatus}
              setItems={setItems}
            />
          )}
          contentContainerStyle={styles.taskListContainer}
        />

        <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("AllTasks")}>
          <Text style={styles.viewAllText}>Lihat Semua Kegiatan</Text>
        </TouchableOpacity>

        <TaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          setItems={setItems}
          selectedDate={new Date().toISOString().split("T")[0]}
        />
      </View>
    </Drawer>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  headerText: {
    flex: 1,
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: spacing.sm,
  },
  addButton: {
    padding: 10,
  },
  addButtonText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    top: 5,
  },
  dateContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllButton: {
    backgroundColor: colors.primaryColor,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: "center",
    margin: spacing.md,
  },
  viewAllText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: "bold",
  },
  taskListContainer: {
    paddingBottom: spacing.xl,
  },
});

const $screenContentContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingTop: spacing.xl + spacing.md,
};
