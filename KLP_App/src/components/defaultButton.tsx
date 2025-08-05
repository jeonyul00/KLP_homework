import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '@src/constants/colors';

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

const DefaultButton = ({ label, onPress, disabled }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, disabled && styles.disabledButton]}>
      <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default DefaultButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { backgroundColor: colors.border },
  label: { color: colors.white, fontSize: 16, fontWeight: '600' },
  disabledLabel: { color: colors.white },
});
