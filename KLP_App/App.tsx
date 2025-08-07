import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import MemberStack from '@src/navigations/memberStack';
import NonMemberStack from '@src/navigations/nonMemberStack';
import { useMember } from '@src/stores';
import EncryptedStorage from 'react-native-encrypted-storage';
import { constants } from '@src/constants';
import { initCheck } from '@src/apis/auth';
import Loading from '@src/components/loading';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import { NativeModules } from 'react-native';

dayjs.extend(relativeTime);
dayjs.locale('ko');

function App(): React.JSX.Element {
  const { member, setMember, isLoading, setLoading } = useMember();
  const isLoggedIn = !!member.accessToken;

  useEffect(() => {
    handleInitCheck();
  }, []);

  const handleInitCheck = async () => {
    try {
      setLoading(true);
      const refreshToken = await EncryptedStorage.getItem(constants.refreshToken);
      if (!refreshToken) {
        await EncryptedStorage.clear();
        return;
      }
      const { accessToken, id, message, nickname, status, thumbnail } = await initCheck(refreshToken);
      NativeModules.ToastModule.showToast(message);
      if (status === 201) {
        setMember({ accessToken, id, nickname, thumbnail });
      } else {
        await EncryptedStorage.clear();
      }
    } catch {
      NativeModules.ToastModule.showToast('시스템 오류입니다.');
      await EncryptedStorage.clear();
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" />
      {isLoggedIn ? <MemberStack /> : <NonMemberStack />}
    </NavigationContainer>
  );
}

export default App;
