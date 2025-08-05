import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '@src/constants/colors';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useMember } from '@src/stores';
import FastImage from '@d11/react-native-fast-image';
import { images } from '@src/assets';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MemberStackParamList } from '@src/navigations/memberStack';
import { navigations } from '@src/constants/navigations';

/* 
  로그아웃
*/

type Props = NativeStackScreenProps<MemberStackParamList, typeof navigations.SignOut>;

const SignOut = ({ navigation }: Props) => {
  // MARK: property ----------------------------------------------------------------------------------------------------
  const { logoutMember } = useMember();
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // MARK: function ----------------------------------------------------------------------------------------------------
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    logoutTimerRef.current = setTimeout(async () => {
      try {
        await EncryptedStorage.clear();
        logoutMember();
      } catch (e) {
        console.error('로그아웃 실패:', e);
      }
    }, 3000);

    return () => {
      clearInterval(timerRef.current!);
      clearTimeout(logoutTimerRef.current!);
    };
  }, []);

  const cancelLogout = () => {
    clearInterval(timerRef.current!);
    clearTimeout(logoutTimerRef.current!);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace(navigations.Board);
    }
  };

  // MARK: JSX ----------------------------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <FastImage source={images.logout} resizeMode="contain" style={{ width: 80, height: 80, overflow: 'hidden' }} />
      <Text style={styles.title}>로그아웃 되었습니다.</Text>
      <Text style={styles.subtitle}>{countdown}초 뒤 로그인 화면으로 돌아갑니다 :)</Text>
      <TouchableOpacity style={styles.cancelButton} onPress={cancelLogout}>
        <Text style={styles.cancelButtonText}>취소하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignOut;

// MARK: style ----------------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: '800', color: colors.primary, marginTop: 24 },
  subtitle: { fontSize: 16, color: colors.error, marginTop: 12, textAlign: 'center', lineHeight: 22 },
  cancelButton: {
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: colors.blue,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cancelButtonText: { color: colors.white, fontSize: 15, fontWeight: '600' },
});
