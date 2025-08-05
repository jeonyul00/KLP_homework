import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';

import MemberStack from '@src/navigations/memberStack';
import NonMemberStack from '@src/navigations/nonMemberStack';
import { useMember } from '@src/stores';

function App(): React.JSX.Element {
  const { member } = useMember();
  const isLoggedIn = !!member.accessToken;

  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" />
      {isLoggedIn ? <MemberStack /> : <NonMemberStack />}
    </NavigationContainer>
  );
}

export default App;
