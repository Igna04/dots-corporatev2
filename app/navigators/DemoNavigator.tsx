/* eslint-disable @typescript-eslint/no-unused-vars */
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, useNavigation } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { DemoCommunityScreen, DemoShowroomScreen, DemoDebugScreen, QRScannerScreen } from "../screens"
import { DemoPodcastListScreen } from "../screens/DemoNotification"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { createStackNavigator } from "@react-navigation/stack"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import SavingDepositPage from "app/screens/pages/SavingDepositPage"
import SearchAccountPage from "app/screens/pages/SearchAccountPage"
import { RootStackParamList } from 'app/screens/pages/navigationTypes'; // Import RootStackParamList

export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
  QRButton: undefined;
  ActivityPage: undefined;
  CustomerListPage: undefined;
  SavingDepositPage: undefined;
  SearchAccountPage: undefined;
  AllBatchPage: undefined;
  TransactionHistory: undefined;
  DetailsPage: undefined;
  AccountDetails: undefined;
  SavingsDepositPage2: undefined;
  WithdrawalSavings: undefined;
  Scan: undefined;
}

/**
 * Helper for automatically generating navigation prop types for each route.
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

export function DemoShowroomScreens() {
  return (
    <Tab.Screen
      name="DemoShowroom"
      component={DemoShowroomScreen}
      options={{
        tabBarLabel: "Beranda",
        tabBarIcon: ({ focused }) => (
          <FontAwesome name="home" color={focused ? colors.tint : undefined} size={38} />
        ),
      }}
    />
  )
}

export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets()
  const navigation = useNavigation();


  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >

      {/* ==================== Buttom Navigasi ==================== */}
      <Tab.Screen
        name="DemoShowroom"
        component={DemoShowroomScreen}
        options={{
          tabBarLabel: "Beranda",
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="home" color={focused ? colors.primaryColor : undefined} size={38} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: "Aktivitas",
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="list-alt" color={focused ? colors.primaryColor : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Scan"
        component={QRScannerScreen}
        options={{
          tabBarIcon: () => (
            <TouchableOpacity
              style={$qrButtonContainer}
              onPress={() => navigation.navigate('Scan')}
            >
              <FontAwesome name="qrcode" size={40} color="white" />
            </TouchableOpacity>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />

      <Tab.Screen
        name="DemoPodcastList"
        component={DemoPodcastListScreen}
        options={{
          tabBarLabel: "Notifikasi",
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="bell" color={focused ? colors.primaryColor : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: "Pengaturan",
          tabBarIcon: ({ focused }) => (
            <FontAwesome name="cog" color={focused ? colors.primaryColor : undefined} size={30} />
          ),
        }}
      />

    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}

const $qrButtonContainer: ViewStyle = {
  position: "absolute",
  bottom: spacing.sm,
  height: 70,
  width: 70,
  borderRadius: 35,
  backgroundColor: colors.primaryColor,
  alignItems: "center",
  justifyContent: "center",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
}
