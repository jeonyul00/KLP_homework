import { Alert, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Container from '@src/components/container';
import DismissKey from '@src/components/dismissKey';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { navigations } from '@src/constants/navigations';
import { NonMemberStackParamList } from '@src/navigations/nonMemberStack';
import { images } from '@src/assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from '@d11/react-native-fast-image';
import { colors } from '@src/constants/colors';
import DefaultButton from '@src/components/defaultButton';
import { constants } from '@src/constants';
import { validateAccountId, validatePassword } from '@src/utils/vaildation';
import { handleSignin } from '@src/apis/auth';
import { useMember } from '@src/stores';
import EncryptedStorage from 'react-native-encrypted-storage';
import Loading from '@src/components/loading';

/* 
    로그인
*/

type Props = NativeStackScreenProps<NonMemberStackParamList, typeof navigations.SignIn>;

const SignIn = ({ navigation }: Props) => {
  // MARK: property ----------------------------------------------------------------------------------------------------
  const inset = useSafeAreaInsets();
  const [form, setForm] = useState({ id: '', pwd: '' });
  const isAllValid = form.id.trim() !== '' && form.pwd.trim() !== '';
  const { isLoading, setLoading, setMember } = useMember();

  // MARK: function ----------------------------------------------------------------------------------------------------
  const getBorderColor = (key: keyof typeof form) => {
    return form[key].trim() ? colors.primary : colors.border;
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!isAllValid || validateAccountId(form.id) || validatePassword(form.pwd)) {
      Alert.alert(constants.alertTitle, '아이디 또는 비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      const { accessToken, id, message, nickname, refreshToken, status, thumbnail } = await handleSignin(form);
      if (status === 200) {
        // TODO: 토스트 메시지
        setMember({ accessToken, id, nickname, thumbnail });
        await EncryptedStorage.setItem(constants.refreshToken, refreshToken);
      } else {
        Alert.alert(constants.alertTitle, message);
      }
    } catch {
      Alert.alert(constants.alertTitle, '시스템 오류입니다.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // MARK: JSX ----------------------------------------------------------------------------------------------------
  if (isLoading) return <Loading />;

  return (
    <Container style={[styles.container, { paddingBottom: inset.bottom }]}>
      <DismissKey>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoWrapper}>
            <FastImage source={images.cat} resizeMode="contain" style={styles.logoImage} />
          </View>
          <View style={styles.formWrapper}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={[styles.input, { borderColor: getBorderColor('id') }]}
              placeholder="아이디를 입력해주세요."
              autoCapitalize="none"
              value={form.id}
              onChangeText={text => handleChange('id', text)}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={colors.border}
            />
            <View style={styles.inputSpacer} />
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={[styles.input, { borderColor: getBorderColor('pwd') }]}
              placeholder="비밀번호를 입력해주세요."
              autoCapitalize="none"
              secureTextEntry
              value={form.pwd}
              onChangeText={text => handleChange('pwd', text)}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={colors.border}
            />
            <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate(navigations.SignUp)}>
              <Text style={styles.signUpText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </DismissKey>
      <DefaultButton label="확인" onPress={handleSubmit} disabled={!isAllValid} />
    </Container>
  );
};

export default SignIn;

// MARK: style ----------------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  scroll: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', backgroundColor: colors.background },
  logoWrapper: { justifyContent: 'center', alignItems: 'center', flex: 2 },
  logoImage: { alignSelf: 'stretch', flex: 1 },
  formWrapper: { flex: 1, justifyContent: 'center' },
  label: { paddingBottom: 10, color: colors.textPrimary, fontSize: 15, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputSpacer: { paddingVertical: 10 },
  signUpButton: { alignSelf: 'stretch', marginVertical: 20 },
  signUpText: { color: colors.textSecondary, textDecorationLine: 'underline', textAlign: 'center' },
});
