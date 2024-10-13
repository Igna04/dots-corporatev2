/* eslint-disable react-native/no-color-literals */
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import React from 'react';

interface ItemListProps {
  label?: string;
  value: string;
  onPress: () => void;
  connected: boolean;
  actionText: string;
  color?: string;
}

const ItemList: React.FC<ItemListProps> = ({ label, value, onPress, connected, actionText, color = '#00BCD4' }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label || 'UNKNOWN'}</Text>
        <Text>{value}</Text>
      </View>
      {connected ? (
        <Text style={styles.connected}>Terhubung</Text>
      ) : (
        <TouchableOpacity onPress={onPress} style={styles.button(color)}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  actionText: { color: 'white' },
  button: (color: string) => ({
    backgroundColor: color,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  }),
  connected: { color: '#00BCD4', fontWeight: 'bold' },
  container: {
    alignItems: 'center',
    backgroundColor: '#E7E7E7',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 12,
  },
  label: { fontWeight: 'bold' },
});
