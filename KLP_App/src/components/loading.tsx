import { StatusBar, StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '@src/constants/colors';
import LottieView from 'lottie-react-native';
import { images } from '@src/assets';

const Loading = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.background} />
      <LottieView source={images.loading} autoPlay loop style={{ width: 150, height: 150 }} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});
