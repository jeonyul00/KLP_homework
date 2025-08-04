import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';

import MemberStack from '@src/navigations/memberStack';
import NonMemberStack from '@src/navigations/nonMemberStack';

function App(): React.JSX.Element {
  // TODO: zustand || recoil
  const isLoggedIn = true;

  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" />
      {isLoggedIn ? <MemberStack /> : <NonMemberStack />}
    </NavigationContainer>
  );
}

export default App;
