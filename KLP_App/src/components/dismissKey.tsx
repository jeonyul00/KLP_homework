import React, { PropsWithChildren } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface DismissKeyProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

const DismissKey: React.FC<DismissKeyProps> = ({ children, ...props }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView {...props} style={[props.style, styles.flex]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {children}
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);

export default DismissKey;

const styles = StyleSheet.create({ flex: { flex: 1 } });
