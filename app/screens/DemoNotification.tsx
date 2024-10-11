/* eslint-disable react-native/no-color-literals */
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { View, ViewStyle, StyleSheet } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { Drawer } from "react-native-drawer-layout"
import { isRTL } from "../i18n"
import { CustomDrawer } from "./CustomDrawer"
import { DrawerIconButton } from "./DemoShowroomScreen/DrawerIconButton"

export const DemoPodcastListScreen: FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function DemoPodcastListScreen(_props) {
    const [open, setOpen] = useState(false)

    const toggleDrawer = () => {
      setOpen(!open)
    }

    return (
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerType="back"
        drawerPosition={isRTL ? "right" : "left"}
        renderDrawerContent={() => <CustomDrawer />}
      >
        <Screen
          preset="fixed"
          safeAreaEdges={["top"]}
          contentContainerStyle={$screenContentContainer}
        >
          <View style={styles.headerContainer}>
            <DrawerIconButton onPress={toggleDrawer} />
            <Text style={styles.headerText}>Notifikasi</Text>
          </View>

        </Screen>
      </Drawer>
    )
  },
)

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    flexDirection: "row",
    paddingVertical: spacing.sm,
    position: "absolute",
    top: 0,
    width: "109%",
    zIndex: 10,
  },
  headerText: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: "bold",
  },
})

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

