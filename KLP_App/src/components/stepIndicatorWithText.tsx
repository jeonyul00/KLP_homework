import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@src/constants/colors';

type Props = {
  currentStep: number;
  totalSteps: number;
  title?: string;
};

const StepIndicatorWithText = ({ currentStep, totalSteps, title }: Props) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.wrapper}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.dotContainer}>
        {steps.map(step => (
          <View key={step} style={[styles.dot, step === currentStep && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

export default StepIndicatorWithText;

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', backgroundColor: colors.background },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: colors.textPrimary },
  dotContainer: { flexDirection: 'row', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  activeDot: { backgroundColor: colors.primary },
});
