import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '@src/components/container';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MemberStackParamList } from '@src/navigations/memberStack';
import { navigations } from '@src/constants/navigations';
import { getBoardList } from '@src/apis/board';
import { BoardType } from '@src/types/board';
import { colors } from '@src/constants/colors';
import { useMember } from '@src/stores';
import FastImage from '@d11/react-native-fast-image';
import { S3 } from '@env';
import { images } from '@src/assets';
import dayjs from 'dayjs';
import Loading from '@src/components/loading';

/* 
    게시판 리스트
*/

type Props = NativeStackScreenProps<MemberStackParamList, typeof navigations.Board>;

const Board = ({ navigation }: Props) => {
  // MARK: property ----------------------------------------------------------------------------------------------------
  const [boardList, setBoardList] = useState<BoardType[]>([]);
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { member } = useMember();

  // MARK: function ----------------------------------------------------------------------------------------------------
  useEffect(() => {
    handleGetBoardList(1);
  }, []);

  const handleGetBoardList = async (pageParam = 1) => {
    if (isLoading || isEnd) return;
    setIsLoading(true);
    try {
      const { data, hasNext, status } = await getBoardList({ page: pageParam, size: 20 });
      if (status === 200) {
        setBoardList(prev => (pageParam === 1 ? data : [...prev, ...data.filter(item => !prev.find(prevItem => prevItem.idx === item.idx))]));
        setPage(pageParam + 1);
        if (!hasNext) setIsEnd(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndReached = () => {
    if (!isEnd && !isLoading) {
      handleGetBoardList(page);
    }
  };

  const renderItem = useCallback(({ item }: { item: BoardType }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => {}}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.nickname}>{item.nickname}</Text>
          <Text style={styles.date}>{dayjs(item.create_date).fromNow()}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  // MARK: JSX ----------------------------------------------------------------------------------------------------
  if (isLoading) return <Loading />;

  return (
    <Container style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={boardList}
        keyExtractor={item => String(item.idx)}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.emptyText}>게시글이 없습니다.</Text>}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <FastImage source={{ uri: `${S3}${member.thumbnail}` }} resizeMode="cover" style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileNickname}>{member.nickname}</Text>
              <Text style={styles.profileSubtitle}>오늘도 좋은 하루 되세요 ☀️</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                navigation.navigate(navigations.SignOut);
              }}
            >
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        }
      />
      <TouchableOpacity style={styles.writeButton}>
        <FastImage source={images.writeButton} resizeMode="contain" style={styles.writeIcon} />
      </TouchableOpacity>
    </Container>
  );
};

export default Board;

// MARK: style ----------------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20 },
  profileInfo: { flex: 1, paddingLeft: 16, gap: 5 },
  logoutButton: { backgroundColor: colors.error, padding: 15, borderRadius: 10 },
  logoutText: { fontSize: 12, color: colors.white, fontWeight: '500' },
  profileImage: { width: 60, height: 60, borderRadius: 30, overflow: 'hidden' },
  profileNickname: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  profileSubtitle: { fontSize: 13, color: colors.textSecondary },
  itemContainer: { paddingVertical: 16 },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  nickname: { fontSize: 13, color: colors.textSecondary },
  date: { fontSize: 13, color: colors.border },
  separator: { height: 1, backgroundColor: colors.border },
  emptyText: { paddingVertical: 40, textAlign: 'center', color: '#aaa' },
  writeButton: {
    position: 'absolute',
    bottom: 75,
    right: 50,
    zIndex: 1,
    opacity: 0.8,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeIcon: { width: 90, height: 90, borderRadius: 45 },
});
