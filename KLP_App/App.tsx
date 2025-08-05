import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Alert, StatusBar } from 'react-native';

import MemberStack from '@src/navigations/memberStack';
import NonMemberStack from '@src/navigations/nonMemberStack';
import { useMember } from '@src/stores';
import EncryptedStorage from 'react-native-encrypted-storage';
import { constants } from '@src/constants';
import { initCheck } from '@src/apis/auth';
import Loading from '@src/components/loading';

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
        setLoading(false);
        return;
      }
      const { accessToken, id, message, nickname, status, thumbnail } = await initCheck(refreshToken);
      if (status === 201) {
        // TODO: 토스트 메시지
        setMember({ accessToken, id, nickname, thumbnail });
      } else {
        Alert.alert(constants.alertTitle, message);
      }
    } catch {
      await EncryptedStorage.clear();
      Alert.alert(constants.alertTitle, '시스템 오류입니다.');
    } finally {
      setLoading(false);
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
