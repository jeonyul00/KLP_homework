import {
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MemberStackParamList } from '@src/navigations/memberStack';
import { navigations } from '@src/constants/navigations';
import Loading from '@src/components/loading';
import { deleteBoard, deleteComment, getBoardDetail, handlePostComment } from '@src/apis/board';
import Container from '@src/components/container';
import DismissKey from '@src/components/dismissKey';
import { BoardImageType, CommentResponse } from '@src/types/board';
import { constants } from '@src/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { S3 } from '@env';
import { colors } from '@src/constants/colors';
import FastImage from '@d11/react-native-fast-image';
import { useMember } from '@src/stores';
import { useDebounce } from '@src/hooks/useDebounce';
import { NativeModules } from 'react-native';

/* 
  게시물 상세
*/

type Props = NativeStackScreenProps<MemberStackParamList, typeof navigations.BoardDetail>;

const BoardDetail = ({ route, navigation }: Props) => {
  // MARK: property ----------------------------------------------------------------------------------------------------
  const { idx } = route.params;
  const inset = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<{ idx: number; title: string; contents: string; nickname: string; author: number; create_date: string }>();
  const [commentList, setCommentList] = useState<CommentResponse[]>([]);
  const [images, setImages] = useState<BoardImageType[]>([]);
  const screenWidth = Dimensions.get('window').width;
  const [commentText, setCommentText] = useState('');
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { member } = useMember();
  const { debounce } = useDebounce(1000);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);

  // MARK: function ----------------------------------------------------------------------------------------------------
  useEffect(() => {
    handleGetBoardDetail(idx);
  }, [idx]);

  const handleGetBoardDetail = async (idx: number) => {
    try {
      const { data, message, status } = await getBoardDetail(idx);
      if (status === 200) {
        setBoard(data.board);
        setImages(data.images);
        setCommentList(data.comments);
      } else {
        NativeModules.ToastModule.showToast(message);
      }
    } catch (e) {
      NativeModules.ToastModule.showToast('시스템 오류입니다.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText) return;
    try {
      const { message, status } = await handlePostComment(idx, member.accessToken, commentText);
      if (status === 200) {
        Keyboard.dismiss();
        setCommentText('');
        await handleGetBoardDetail(idx);
      } else {
        NativeModules.ToastModule.showToast(message);
      }
    } catch (e) {
      NativeModules.ToastModule.showToast('시스템 오류입니다.');
    }
  };

  const handleEditBoard = () => {
    if (!board) return;
    navigation.navigate(navigations.BoardManage, { idx, title: board.title, contents: board.contents, paramsImages: images });
  };

  const handleDeleteBoard = async () => {
    Alert.alert(
      constants.alertTitle,
      '정말 이 게시글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const { message, status } = await deleteBoard(idx, member.accessToken);
              if (status === 200) {
                navigation.reset({ index: 0, routes: [{ name: navigations.Board }] });
              } else {
                NativeModules.ToastModule.showToast(message);
              }
            } catch (e) {
              NativeModules.ToastModule.showToast('시스템 오류입니다.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleDeleteComment = async (commentIdx: number) => {
    Alert.alert(constants.alertTitle, '댓글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const { message, status } = await deleteComment(commentIdx, member.accessToken);
            if (status === 200) {
              await handleGetBoardDetail(idx);
            } else {
              NativeModules.ToastModule.showToast(message);
            }
          } catch (e) {
            NativeModules.ToastModule.showToast('시스템 오류입니다.');
          }
        },
      },
    ]);
  };

  // MARK: JSX ----------------------------------------------------------------------------------------------------
  if (loading) return <Loading />;
  if (!board) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>게시글 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <Container style={{ paddingBottom: inset.bottom }}>
      <DismissKey>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.boardWrapper}>
            <Text style={styles.boardTitle}>{board.title}</Text>
            <View style={styles.boardMetaWrapper}>
              <Text style={styles.boardNickname}>{board.nickname}</Text>
              <Text style={styles.boardDate}>{dayjs(board.create_date).fromNow()}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {board.author === member.id && (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity onPress={handleEditBoard}>
                      <Text style={styles.editText}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteBoard}>
                      <Text style={styles.deleteText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.boardContent}>{board.contents}</Text>
          </View>
          {images && images?.length > 0 && (
            <View style={{ flex: 1 }}>
              <FlatList
                data={images}
                keyExtractor={item => String(item.order)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate="fast"
                style={styles.imageList}
                onScroll={event => {
                  const offsetX = event.nativeEvent.contentOffset.x;
                  const index = Math.round(offsetX / screenWidth) + 1;
                  setCurrentImageIndex(index);
                }}
                scrollEventThrottle={16}
                renderItem={({ item }) => (
                  <Pressable
                    style={{ width: screenWidth, height: screenWidth, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}
                  >
                    <FastImage source={{ uri: `${S3}${item.image}` }} style={{ width: screenWidth, height: screenWidth }} resizeMode="contain" />
                  </Pressable>
                )}
              />
              <View style={styles.imageIndicator}>
                <Text style={styles.imageIndicatorText}>
                  {currentImageIndex} / {images.length}
                </Text>
              </View>
            </View>
          )}

          {commentList.length > 0 && (
            <View style={styles.commentToggleWrapper}>
              <TouchableOpacity onPress={() => setIsCommentOpen(prev => !prev)}>
                <Text style={styles.commentToggleText}>
                  댓글 {commentList.length} {isCommentOpen ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isCommentOpen && (
            <Pressable style={styles.commentListWrapper}>
              {commentList.map(comment => (
                <View key={comment.idx} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View style={{ gap: 2 }}>
                      <Text style={styles.commentNickname}>{comment.nickname}</Text>
                      <Text style={styles.commentDate}>{dayjs(comment.create_date).fromNow()}</Text>
                    </View>
                    {comment.author === member.id && (
                      <TouchableOpacity onPress={() => handleDeleteComment(comment.idx)} style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={styles.deleteText}>삭제</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.commentContent} numberOfLines={3}>
                    {comment.contents}
                  </Text>
                </View>
              ))}
            </Pressable>
          )}
        </ScrollView>
        <View style={styles.commentInputWrapper}>
          <TextInput
            value={commentText}
            autoCapitalize="none"
            onChangeText={setCommentText}
            placeholder="댓글을 입력하세요"
            placeholderTextColor={colors.border}
            style={styles.commentInput}
          />
          <TouchableOpacity
            disabled={!commentText.trim()}
            onPress={() => debounce(handleSubmitComment)}
            style={[styles.commentSubmitButton, commentText.trim() ? { backgroundColor: colors.blue } : { backgroundColor: colors.border }]}
          >
            <Text style={styles.commentSubmitText}>등록</Text>
          </TouchableOpacity>
        </View>
      </DismissKey>
    </Container>
  );
};

export default BoardDetail;

// MARK: style ----------------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  boardWrapper: { paddingHorizontal: 16, paddingBottom: 20, flexShrink: 1, flex: 1 },
  boardTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 12 },
  boardMetaWrapper: { flexDirection: 'row', marginBottom: 16 },
  boardNickname: { fontSize: 14, color: colors.textSecondary },
  boardDate: { fontSize: 13, color: colors.textSecondary, alignSelf: 'stretch', flex: 1, paddingHorizontal: 10 },
  boardContent: { fontSize: 16, color: colors.textPrimary, flex: 1 },
  imageList: { marginBottom: 20, flex: 1 },
  commentToggleWrapper: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 20 },
  commentToggleText: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary },
  commentListWrapper: { paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
  commentCard: { backgroundColor: '#eeeeee', padding: 12, borderRadius: 8 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' },
  commentNickname: { fontSize: 14, fontWeight: '600', color: '#333' },
  commentDate: { fontSize: 12, color: '#aaa' },
  commentContent: { fontSize: 15, color: '#222', lineHeight: 22, paddingTop: 5 },
  commentInputWrapper: { borderTopWidth: 0.5, borderTopColor: colors.border, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },
  commentSubmitButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  commentSubmitText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  editText: { color: colors.blue, fontWeight: '600', paddingHorizontal: 10 },
  deleteText: { color: colors.error, fontWeight: '500', paddingHorizontal: 10 },
  imageIndicator: {
    position: 'absolute',
    top: 10,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageIndicatorText: { color: colors.white, fontSize: 13, fontWeight: '500' },
});
