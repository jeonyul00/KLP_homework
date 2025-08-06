import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigations } from '@src/constants/navigations';
import Board from '@src/screens/board';
import BoardDetail from '@src/screens/board/detail';
import BoardManage from '@src/screens/board/manage';
import SignOut from '@src/screens/auth/signout';

export type MemberStackParamList = {
  [navigations.Board]: undefined;
  [navigations.BoardDetail]: { idx: number };
  [navigations.BoardManage]: { idx: number } | undefined;
  [navigations.SignOut]: undefined;
};

const MemberStackNavi = createNativeStackNavigator<MemberStackParamList>();

const MemberStack = () => {
  return (
    <MemberStackNavi.Navigator screenOptions={{ headerShown: false }}>
      <MemberStackNavi.Screen name={navigations.Board} component={Board} />
      <MemberStackNavi.Screen name={navigations.BoardDetail} component={BoardDetail} />
      <MemberStackNavi.Screen name={navigations.BoardManage} component={BoardManage} />
      <MemberStackNavi.Screen name={navigations.SignOut} component={SignOut} />
    </MemberStackNavi.Navigator>
  );
};

export default MemberStack;
