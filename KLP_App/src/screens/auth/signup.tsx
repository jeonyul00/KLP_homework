import { Alert, Keyboard, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import Container from '@src/components/container';
import DismissKey from '@src/components/dismissKey';
import { colors } from '@src/constants/colors';
import DefaultButton from '@src/components/defaultButton';
import FastImage from '@d11/react-native-fast-image';
import { images } from '@src/assets';
import { navigations } from '@src/constants/navigations';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NonMemberStackParamList } from '@src/navigations/nonMemberStack';
import { constants } from '@src/constants';
import { validateAccountId, validateConfirmPassword, validateNickname, validatePassword } from '@src/utils/vaildation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from '@src/hooks/useDebounce';

type Props = NativeStackScreenProps<NonMemberStackParamList, typeof navigations.SignUp>;

const SignUp = ({ navigation }: Props) => {
  // MARK: property ----------------------------------------------------------------------------------------------------
  const inset = useSafeAreaInsets();
  const { debounce } = useDebounce(1000);
  const [thumbnail, setThumbnail] = useState({ uri: '', name: '', type: '' });
  const [form, setForm] = useState({ nickname: '', id: '', pwd: '', confirmPwd: '' });
  const [errors, setErrors] = useState({ nickname: '', id: '', pwd: '', confirmPwd: '' });

  // MARK: function ----------------------------------------------------------------------------------------------------
  const validateField = useCallback(
    (field: keyof typeof errors, value: string) => {
      if (!value) return '';
      if (field === 'nickname') return validateNickname(value);
      if (field === 'id') return validateAccountId(value);
      if (field === 'pwd') return validatePassword(value);
      if (field === 'confirmPwd') return validateConfirmPassword(form.pwd, value);
      return '';
    },
    [form.pwd],
  );

  const handleChange = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm(prev => ({ ...prev, [field]: value }));
      const errorKey = field as keyof typeof errors;
      setErrors(prev => ({ ...prev, [errorKey]: validateField(errorKey, value) }));
    },
    [validateField],
  );

  const borderColor = (field: keyof typeof errors) => {
    const value = form[field];
    if (!value.trim()) return colors.border;
    return errors[field] ? colors.error : colors.primary;
  };
  const isFormValid = useMemo(() => {
    return (
      !!thumbnail &&
      form.nickname.trim() !== '' &&
      form.id.trim() !== '' &&
      form.pwd.trim() !== '' &&
      form.confirmPwd.trim() !== '' &&
      Object.values(errors).every(e => e === '')
    );
  }, [thumbnail, form, errors]);

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert(constants.alertTitle, '모든 항목을 올바르게 입력해주세요.');
      return;
    }
    // TODO:  API
  };

  // MARK: JSX ----------------------------------------------------------------------------------------------------
  return (
    <Container style={[styles.container, { paddingBottom: inset.bottom }]}>
      <DismissKey>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.thumbnailWrapper}>
            <TouchableOpacity style={styles.thumbnailButton}>
              <FastImage source={images.emptyUser} style={styles.thumbnailImage} resizeMode="contain" tintColor={colors.border} />
            </TouchableOpacity>
          </View>
          <View style={styles.formWrapper}>
            <Text style={styles.label}>닉네임 *</Text>
            <TextInput
              style={[styles.input, { borderColor: borderColor('nickname') }]}
              placeholder="닉네임을 입력해주세요."
              maxLength={12}
              value={form.nickname}
              onChangeText={text => handleChange('nickname', text)}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={colors.border}
              autoCapitalize="none"
            />
            {form.nickname && errors.nickname ? <Text style={styles.errorText}>* {errors.nickname}</Text> : <View style={styles.spacer} />}
            <Text style={styles.label}>아이디 *</Text>
            <TextInput
              style={[styles.input, { borderColor: borderColor('id') }]}
              placeholder="4~20자 영문 숫자 조합"
              maxLength={20}
              autoCapitalize="none"
              value={form.id}
              onChangeText={text => handleChange('id', text)}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={colors.border}
            />
            {form.id && errors.id ? <Text style={styles.errorText}>* {errors.id}</Text> : <View style={styles.spacer} />}
            <Text style={styles.label}>비밀번호 *</Text>
            <TextInput
              maxLength={32}
              style={[styles.input, { borderColor: borderColor('pwd') }]}
              placeholder="8자 이상, 특수문자 포함"
              secureTextEntry
              autoCapitalize="none"
              value={form.pwd}
              onChangeText={text => handleChange('pwd', text)}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={colors.border}
            />
            {form.pwd && errors.pwd ? <Text style={styles.errorText}>* {errors.pwd}</Text> : <View style={styles.spacer} />}
            <Text style={styles.label}>비밀번호 확인 *</Text>
            <TextInput
              maxLength={32}
              style={[styles.input, { borderColor: borderColor('confirmPwd') }]}
              placeholder="비밀번호를 다시 입력해주세요."
              secureTextEntry
              autoCapitalize="none"
              value={form.confirmPwd}
              onChangeText={text => handleChange('confirmPwd', text)}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={colors.border}
            />
            {form.confirmPwd && errors.confirmPwd ? <Text style={styles.errorText}>* {errors.confirmPwd}</Text> : <View style={styles.spacer} />}
          </View>
        </ScrollView>
      </DismissKey>
      <DefaultButton label="가입하기" onPress={handleSubmit} disabled={!isFormValid} />
    </Container>
  );
};

export default SignUp;

// MARK: style ----------------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  scroll: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingTop: 10, paddingBottom: 20, backgroundColor: colors.background },
  thumbnailWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  thumbnailButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: { width: 125, height: 125 },
  formWrapper: { flex: 1, justifyContent: 'center' },
  label: { marginTop: 20, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 8,
  },
  spacer: { height: 10 },
  errorText: { color: colors.error, fontSize: 12, paddingLeft: 10, paddingTop: 5 },
});
