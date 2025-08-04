import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '@src/constants/colors';

const Loading = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.background} />
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});
