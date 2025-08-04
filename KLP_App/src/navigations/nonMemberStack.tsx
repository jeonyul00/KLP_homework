import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigations } from '@src/constants/navigations';
import SignIn from '@src/screens/auth/signin';
import SignUp from '@src/screens/auth/signup';

export type NonMemberStackParamList = {
  [navigations.SignIn]: undefined;
  [navigations.SignUp]: undefined;
};

const NonMemberStackNavi = createNativeStackNavigator<NonMemberStackParamList>();

const NonMemberStack = () => (
  <NonMemberStackNavi.Navigator screenOptions={{ headerShown: false }}>
    <NonMemberStackNavi.Screen name={navigations.SignIn} component={SignIn} />
    <NonMemberStackNavi.Screen name={navigations.SignUp} component={SignUp} />
  </NonMemberStackNavi.Navigator>
);

export default NonMemberStack;
