/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-color-literals */
import React, { FC, useState, useEffect, useRef } from "react"
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Keyboard,
} from "react-native"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "../navigators"
import { useStores } from "../models"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "app/services/api"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "app/theme"

const { width, height } = Dimensions.get("window")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const { authenticationStore } = useStores()
  const scrollViewRef = useRef<ScrollView>(null)
  const usernameInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height)
    })
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0)
    })

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
      authenticationStore.setAuthUsername("")
      authenticationStore.setKodeKantor("")
      setAuthPassword("")
    }
  }, [authenticationStore])

  const getTokenAwal = async () => {
    try {
      return await AsyncStorage.getItem("authToken")
    } catch (error) {
      console.error("Error retrieving token:", error)
      return null
    }
  }

  async function login() {
    if (isSubmitting) return

    setIsSubmitting(true)

    if (authenticationStore.validationError || !authPassword.trim()) {
      setIsSubmitting(false)
      return
    }

    try {
      const kodeKantorInt = parseInt(authenticationStore.kodeKantor, 10)
      const token = await api.login(authenticationStore.authUsername, authPassword, kodeKantorInt)

      if (token) {
        await AsyncStorage.setItem("authToken", token.access_token)
        await AsyncStorage.setItem("kodeKantor", authenticationStore.kodeKantor)
        authenticationStore.setAuthToken(token.access_token)

        setAuthPassword("")
        authenticationStore.setAuthUsername("")
        authenticationStore.setKodeKantor("")
      }
    } catch (error) {
      console.error("Error during login:", error)
    }

    setIsSubmitting(false)
  }

  const handleFocus = (inputIndex: number) => {
    const scrollToPosition = height * 0.2 + inputIndex * 60 // Adjust this value as needed
    scrollViewRef.current?.scrollTo({ y: scrollToPosition, animated: true })
  }

  const handlePasswordChange = (text: string) => {
    setAuthPassword(text.toLowerCase())
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100} // Adjust this value
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scrollView, { paddingBottom: keyboardHeight / 2 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image source={require("../assets/img/dots_logo.png")} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>Sign in to continue</Text>

          <View style={styles.inputContainer}>
            <Icon
              name="office-building"
              size={24}
              color={colors.primaryColor}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={authenticationStore.kodeKantor}
              onChangeText={authenticationStore.setKodeKantor}
              placeholder="Office Code"
              placeholderTextColor="#a0a0a0"
              keyboardType="numeric"
              onFocus={() => handleFocus(0)}
              onSubmitEditing={() => usernameInputRef.current?.focus()}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="account" size={24} color={colors.primaryColor} style={styles.inputIcon} />
            <TextInput
              ref={usernameInputRef}
              style={styles.input}
              value={authenticationStore.authUsername}
              onChangeText={authenticationStore.setAuthUsername}
              placeholder="Username"
              placeholderTextColor="#a0a0a0"
              autoCapitalize="none"
              onFocus={() => handleFocus(1)}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color={colors.primaryColor} style={styles.inputIcon} />
            <TextInput
              ref={passwordInputRef}
              style={styles.input}
              value={authPassword}
              onChangeText={setAuthPassword}
              placeholder="Password"
              placeholderTextColor="#a0a0a0"
              secureTextEntry={isAuthPasswordHidden}
              autoCapitalize="none"
              onFocus={() => handleFocus(2)}
              onSubmitEditing={login}
              returnKeyType="go"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
            >
              <Icon
                name={isAuthPasswordHidden ? "eye-off" : "eye"}
                size={24}
                color={colors.primaryColor}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={login} disabled={isSubmitting}>
            <Text style={styles.loginButtonText}>{isSubmitting ? "Signing In..." : "Sign In"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Version 2.0.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  eyeIcon: {
    padding: 10,
  },
  formContainer: {
    marginTop: height * 0.05,
    width: "100%",
  },
  input: {
    color: "#333333",
    flex: 1,
    fontSize: 16,
    paddingVertical: 15,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    flexDirection: "row",
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: colors.primaryColor,
    borderRadius: 25,
    marginTop: 20,
    paddingVertical: 15,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  logo: {
    height: width * 0.4,
    resizeMode: "contain",
    width: width * 0.6,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  subText: {
    color: "#666666",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  versionText: {
    color: "#666666",
    marginTop: 20,
    textAlign: "center",
  },
  welcomeText: {
    color: colors.primaryColor,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
})
