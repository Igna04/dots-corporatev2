/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
import React, { FC, useState } from "react";
import { View, ViewStyle, StyleSheet, FlatList } from "react-native";
import { Screen, Text } from "../components";
import { DemoTabScreenProps } from "../navigators/DemoNavigator";
import { colors, spacing } from "../theme";
import { Button } from "../components/Button";
import { CustomDrawer } from "./CustomDrawer";
import { Drawer } from "react-native-drawer-layout";
import { isRTL } from "../i18n";
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton";

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  assignedTo: string;
  attachment: string;
}

export const DemoCommunityScreen: FC<DemoTabScreenProps<"DemoCommunity">> = function DemoCommunityScreen(
  { route, navigation }
) {
  const { activities } = route.params || { activities: [] }; // Receive the list of activities from route.params

  const handleNavigate = () => {
    navigation.navigate("Activity");
  };

  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const renderItem = ({ item }: { item: Activity }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>Deskripsi: {item.description}</Text>
      <Text style={styles.cardDescription}>Tanggal: {item.date}</Text>
      <Text style={styles.cardDescription}>Ditugaskan: {item.assignedTo}</Text>
      <Text style={styles.cardDescription}>Lampiran: {item.attachment}</Text>
    </View>
  );

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="back"
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={() => <CustomDrawer />}
    >
      <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <View style={styles.headerContainer}>
          <DrawerIconButton onPress={toggleDrawer} />
          <Text style={styles.headerText}>Aktivitas</Text>
          <Button
            text="+ Tambah"
            preset="default"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={handleNavigate}
          />
        </View>

        <View style={styles.content}>
          {activities.length === 0 ? (
            <Text style={styles.noDataText}>Tidak ada data tersedia</Text>
          ) : (
            <FlatList
              data={activities}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
      </Screen>
    </Drawer>
  );
};

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "darkorange",
    borderRadius: 20,
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardDescription: {
    color: "gray",
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  content: {
    marginTop: 60, // Adjusted margin to position content below the header
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    flexDirection: "row",
    justifyContent: "space-between", // Distribute space evenly
    paddingVertical: spacing.sm,
    position: "absolute",
    top: 0,
    left: 0, // Ensure the left position is set
    right: 0, // Ensure the right position is set
    zIndex: 10,
  },
  headerText: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1, // Allow text to take up available space
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  noDataText: {
    color: "gray",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});
