// src/components/PrimaryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { colors } from '../components/utils/helpers';

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  style?: any;
};

export default function PrimaryButton({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
