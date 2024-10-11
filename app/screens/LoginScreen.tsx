/* eslint-disable @typescript-eslint/no-unused-vars */
import { observer } from "mobx-react-lite";
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react";
import { Image, TextInput, TextStyle, ViewStyle } from "react-native";
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components";
import { useStores } from "../models";
import { AppStackScreenProps } from "../navigators";
import { colors, spacing } from "../theme";
import { api } from "app/services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps extends AppStackScreenProps<"Login"> { }

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {

  // State Declaration for Password
  const authPasswordInput = useRef<TextInput>(null);
  const [authPassword, setAuthPassword] = useState(""); // Local state for the password
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true);
  const [, setIsSubmitted] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);

  // Use the MobX store
  const { authenticationStore } = useStores(); 

  // Reset fields after login or when unmounted
  useEffect(() => {
    return () => {
      authenticationStore.setAuthUsername(""); // Clear username in the store
      authenticationStore.setKodeKantor("");   // Clear Kode Kantor in the store
      setAuthPassword("");                     // Clear local password state
    };
  }, [authenticationStore]);

  // Login Button Function
  async function login() {
    setIsSubmitted(true);
    setAttemptsCount(attemptsCount + 1);
  
    console.log("Starting login...");
  
    // Check validation error from store
    if (authenticationStore.validationError) {
      console.error("Validation Error:", authenticationStore.validationError);
      return; // Prevent login if validation fails
    }
  
    // Validate password locally
    if (!authPassword.trim()) {
      console.error("Validation Error: Password can't be blank.");
      return;
    }
  
    try {
      console.log("Sending login request...");
  
      // Convert kodeKantor to an integer
      const kodeKantorInt = parseInt(authenticationStore.kodeKantor, 10);
      const token = await api.login(authenticationStore.authUsername, authPassword, kodeKantorInt); // Pass store values
  
      if (token) {
        await AsyncStorage.setItem('authToken', token.access_token);
        await AsyncStorage.setItem('kodeKantor', authenticationStore.kodeKantor); // Store kodeKantor
        authenticationStore.setAuthToken(token.access_token);
  
        console.log("Login successful, token:", token.access_token);
        setAuthPassword(""); // Clear password after successful login
        authenticationStore.setAuthUsername(""); // Clear username
        authenticationStore.setKodeKantor(""); // Clear Kode Kantor
      } else {
        console.error("Login failed: No token returned");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  
    setIsSubmitted(false);
  }
  

  // Password field accessory for toggling visibility
  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        );
      },
    [isAuthPasswordHidden],
  );

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >

      {/* Logo */}
      <Image source={require("../assets/img/dots_logo.png")} style={$logoStyle as any} />

      <Text style={$welcomeText}>Selamat Datang</Text>

      {/* Kode Kantor */}
      <TextField
        value={authenticationStore.kodeKantor} // Bind the Kode Kantor input to the store
        onChangeText={authenticationStore.setKodeKantor} // Update store on change
        containerStyle={$textField}
        autoCapitalize="none"
        autoCorrect={false}
        label="Kode Kantor"
        placeholder="Masukkan Kode Kantor"
        keyboardType="numeric" // Set keyboard type to numeric
      />

      {/* Username */}
      <TextField
        value={authenticationStore.authUsername} // Bind the Username input to the store
        onChangeText={authenticationStore.setAuthUsername} // Update store on change
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="username"
        autoCorrect={false}
        label="Username"
        placeholder="Masukkan Username"
      />

      {/* Password */}
      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        label="Password"
        placeholder="Masukkan Password"
        RightAccessory={PasswordRightAccessory}
      />

      {/* Login Button */}
      <Button
        testID="login-button"
        text="LOGIN"
        style={$loginButton}
        textStyle={$loginButtonText}
        onPress={login}
      />

      {/* Version Text */}
      <Text style={$versionText}>Version 2.0.0</Text>
    </Screen>
  );
});

/**
 * CSS Style
 */
const $screenContentContainer: ViewStyle = {
  paddingVertical: 80,
  paddingHorizontal: spacing.lg,
  justifyContent: "flex-start",
  flex: 1,
};

const $welcomeText: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  textAlign: "center",
  marginBottom: spacing.md,
  marginTop: spacing.lg,
};

const $logoStyle: ViewStyle = {
  alignSelf: "center",
  marginBottom: spacing.lg,
};

const $textField: ViewStyle = {
  marginBottom: spacing.md,
};

const $loginButton: ViewStyle = {
  marginTop: spacing.lg,
  backgroundColor: 'navy',
};

const $versionText: TextStyle = {
  marginTop: spacing.xl,
  textAlign: "center",
  color: colors.palette.neutral600,
};

const $loginButtonText: TextStyle = {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
};
