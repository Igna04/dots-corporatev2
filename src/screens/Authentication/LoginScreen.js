/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React, { useState, useContext } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Button, Caption, Headline, TextInput, Text } from 'react-native-paper';
import { useToast } from 'react-native-paper-toast';
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import { AuthContext } from '@/components/providers/AuthenticationProvider';

// Define styles above the component
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  version: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Inter-ExtraBold',
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 5,
  },
  textInput: {
    height: 48,
    borderColor: '#E0E9F6',
    borderRadius: 5,
    marginTop: 5,
  },
  inputCaption: {
    fontSize: 13,
    fontFamily: 'Inter-ExtraBold',
    color: '#378CE7',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1.8 },
    textShadowRadius: 3,
  },
  logo: {
    width: 284,
    height: 110,
    marginTop: 38,
    marginBottom: 45,
    alignSelf: 'center',
  },
});

function LoginScreen() {
  const toaster = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tenantID, setTenantID] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    if (!username || !password || !tenantID) {
      toaster.show({ message: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    login(username, password, tenantID)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        toaster.show({ message: error.toString() });
        setLoading(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.screen}>
        {loading && <LoadingOverlay />}
        <Headline style={[styles.heading, { letterSpacing: 3 }]}>Selamat Datang</Headline>
        <Image source={require('../../../static/img/dots_logo.png')} style={styles.logo} />
        <Caption style={styles.inputCaption}>Kode Kantor</Caption>
        <TextInput
          style={styles.textInput}
          value={tenantID}
          onChangeText={(text) => setTenantID(text)}
        />
        <Caption style={styles.inputCaption}>Username</Caption>
        <TextInput
          style={styles.textInput}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <Caption style={styles.inputCaption}>Password</Caption>
        <TextInput
          style={styles.textInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
          right={
            <TextInput.Icon
              name={showPassword ? 'eye-off' : 'eye'}
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            />
          }
        />
        <View style={{ alignItems: 'center' }}>
          <Button
            mode="contained"
            onPress={handleLogin}
            style={{ marginTop: 45, width: 220, height: 40, borderRadius: 15 }}
          >
            Login
          </Button>
        </View>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

export default LoginScreen;
