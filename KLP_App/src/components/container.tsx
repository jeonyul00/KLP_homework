import { colors } from '@src/constants/colors';
import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Container = ({ children, style }: ContainerProps) => {
  const inset = useSafeAreaInsets();
  return <View style={[{ paddingTop: inset.top, flex: 1, backgroundColor: colors.background }, style]}>{children}</View>;
};

export default Container;
