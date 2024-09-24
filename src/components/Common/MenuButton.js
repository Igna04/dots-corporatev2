/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-spacing */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Card} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MenuButton = (props) => {
  return (
    <TouchableOpacity style={styles.buttonElement} onPress={props.onPress}>
      <Card {...props} style={{...styles.appCard, ...props.style}}>
        <Ionicons style={styles.buttonIcon} name={props.iconName} size={30} />
      </Card>
      <Text style={styles.titleText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  appCard: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  buttonIcon: {
    alignSelf: 'center',
    color: '#F9BF5B',
    paddingTop: 12,
  },
  buttonElement: {
    // alignSelf: 'center',
  },
});

export default MenuButton;
