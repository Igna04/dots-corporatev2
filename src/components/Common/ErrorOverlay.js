/* eslint-disable no-use-before-define */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-unused-vars */
import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {Headline, Subheading, Button} from 'react-native-paper';

const ErrorOverlay = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../static/img/no-data.webp')}
      />
      <Headline>Terjadi Kesalahan</Headline>
      <Button>Refresh</Button>
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

export default ErrorOverlay;
