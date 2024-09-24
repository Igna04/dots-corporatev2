/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Headline, Subheading } from 'react-native-paper';

const NotFoundOverlay = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../static/img/no-data.webp')}
      />
      <Subheading>Tidak ada data...</Subheading>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default NotFoundOverlay;
