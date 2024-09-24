/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';

const LoadingOverlay = () => {
  return (
    <ActivityIndicator
      style={styles.spinner}
      animating
      size={40}
      color={Colors.red800}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    bottom: '50%',
    zIndex: 99,
  },
});

export default LoadingOverlay;
