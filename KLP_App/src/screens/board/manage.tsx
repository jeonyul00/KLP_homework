import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard, Pressable } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import Container from '@src/components/container';
import DismissKey from '@src/components/dismissKey';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MemberStackParamList } from '@src/navigations/memberStack';
import { navigations } from '@src/constants/navigations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from '@src/hooks/useDebounce';
import { usePermission } from '@src/hooks/usePermissions';
import { openSettings } from 'react-native-permissions';
import { colors } from '@src/constants/colors';
import DefaultButton from '@src/components/defaultButton';
import { constants } from '@src/constants';
import { pickMultiplePostImages } from '@src/utils/imagePicker';
import Loading from '@src/components/loading';
import { handlePostBoard, handleUpdateBoard } from '@src/apis/board';
import { useMember } from '@src/stores';
import { S3 } from '@env';
import FastImage from '@d11/react-native-fast-image';

/* 
  게시물 등록 || 수정
*/

type Props = NativeStackScreenProps<MemberStackParamList, typeof navigations.BoardManage>;

const BoardManage = ({ route, navigation }: Props) => {
  // MARK: property ----------------------------------------------------------------------------------------------------
  const { idx, title, contents, paramsImages } = route.params || {};
  const isEdit = !!idx;
  const inset = useSafeAreaInsets();
  const { debounce } = useDebounce(1000);
  const hasPhotoPermission = usePermission('PHOTO');
  const [form, setForm] = useState({ title: '', contents: '' });
  const [images, setImages] = useState<{ idx: number; uri: string; name: string; type: string }[]>([]);
  const { setLoading, isLoading, member } = useMember();

  // MARK: function ----------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (isEdit && title && contents) {
      setForm({ title, contents });
    }
    if (isEdit && paramsImages?.length) {
      const mapped = paramsImages.map((img, i) => ({
        idx: i,
        uri: `${S3}${img.image}`,
        name: img.image.split('/').pop() ?? `image${i}.jpg`,
        type: 'image/jpeg',
      }));
      setImages(mapped);
    }
  }, [isEdit, title, contents, paramsImages]);

  const handlePickImage = async () => {
    if (!hasPhotoPermission) {
      Alert.alert(constants.alertTitle, '이미지를 업로드하려면 사진 접근 권한이 필요합니다.', [
        { text: constants.cancel, style: 'cancel' },
        {
          text: '설정으로 이동',
          onPress: () =>
            openSettings().catch(() => {
              Alert.alert(constants.alertTitle, '설정 화면을 열 수 없습니다.');
            }),
        },
      ]);
      return;
    }

    if (images.length >= 5) {
      Alert.alert(constants.alertTitle, '이미지는 최대 5장까지 등록할 수 있습니다.');
      return;
    }

    try {
      const available = 5 - images.length;
      const selectedImages = await pickMultiplePostImages(available);
      if (selectedImages.length > 0) {
        const selectedWithIdx = selectedImages.map((img, i) => ({ ...img, idx: images.length + i }));
        setImages(prev => [...prev, ...selectedWithIdx]);
      }
    } catch {
      Alert.alert(constants.alertTitle, '이미지를 불러올 수 없습니다.');
    }
  };

  const handleRemoveImage = (targetIdx: number) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.idx !== targetIdx);
      return filtered.map((img, newIdx) => ({ ...img, idx: newIdx }));
    });
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const isValid = useMemo(() => {
    return form.title.trim() !== '' && form.contents.trim() !== '';
  }, [form]);

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert(constants.alertTitle, '제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      const promiseImageAppend = async (value: { idx: number; uri: string; name: string; type: string }) => {
        if (value.uri) {
          formData.append('images', value);
        }
      };
      const promiseMap = images.map(value => promiseImageAppend(value));
      await Promise.all(promiseMap);
      formData.append('title', form.title);
      formData.append('contents', form.contents);
      let message = '';
      let status = 500;
      if (isEdit && idx) {
        formData.append('idx', idx);
        const response = await handleUpdateBoard(formData, member.accessToken);
        message = response.message;
        status = response.status;
        if (status === 200) {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate(navigations.Board);
          }
        } else {
          Alert.alert(constants.alertTitle, message);
        }
      } else {
        const response = await handlePostBoard(formData, member.accessToken);
        message = response.message;
        status = response.status;
        if (status === 200) {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate(navigations.Board);
          }
        } else {
          Alert.alert(constants.alertTitle, message);
        }
      }
    } catch (e) {
      Alert.alert(constants.alertTitle, '시스템 오류입니다.');
    } finally {
      setLoading(false);
    }
  };

  // MARK: JSX ----------------------------------------------------------------------------------------------------
  if (isLoading) return <Loading />;

  return (
    <Container style={{ paddingHorizontal: 16, paddingBottom: inset.bottom }}>
      <DismissKey>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>제목 *</Text>
          <TextInput
            style={[styles.input, form.title.trim() && { borderColor: colors.primary }]}
            placeholder="제목을 입력하세요."
            value={form.title}
            onChangeText={text => handleChange('title', text)}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            maxLength={45}
            autoCapitalize="none"
          />
          <Text style={[styles.counter, form.title.length < 45 ? styles.counterNormal : styles.counterError]}>{form.title.length} / 45</Text>
          <Text style={styles.label}>내용 *</Text>
          <TextInput
            style={[styles.input, styles.textarea, form.contents.trim() && { borderColor: colors.primary }]}
            placeholder="내용을 입력하세요."
            value={form.contents}
            onChangeText={text => handleChange('contents', text)}
            multiline
            maxLength={400}
          />
          <Text style={[styles.counter, form.contents.length < 400 ? styles.counterNormal : styles.counterError]}>{form.contents.length} / 400</Text>
          <Text style={[styles.label, { paddingBottom: 8 }]}>이미지 ({images.length}/5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {images.map(img => (
              <Pressable key={img.idx} style={styles.imageBox}>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveImage(img.idx)}>
                  <Text style={styles.removeText}>X</Text>
                </TouchableOpacity>
                <FastImage source={{ uri: img.uri }} style={styles.image} />
              </Pressable>
            ))}
            {images.length < 5 && (
              <TouchableOpacity style={styles.imageAddBtn} onPress={handlePickImage}>
                <Text style={styles.imageAddText}>＋</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </ScrollView>
      </DismissKey>
      <DefaultButton label={isEdit ? '수정하기' : '등록하기'} onPress={() => debounce(handleSubmit)} disabled={!isValid} />
    </Container>
  );
};

export default BoardManage;

// MARK: style ----------------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  label: { fontSize: 14, fontWeight: 'bold', color: colors.textPrimary, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: colors.white,
    color: colors.textPrimary,
    marginTop: 8,
  },
  textarea: { height: 200, textAlignVertical: 'top' },
  counter: { alignSelf: 'stretch', textAlign: 'right', paddingTop: 10 },
  counterNormal: { color: colors.border },
  counterError: { color: colors.error },
  imageBox: { paddingRight: 10 },
  image: { width: 100, height: 100, borderRadius: 8, zIndex: -1, overflow: 'hidden' },
  removeBtn: {
    zIndex: 1,
    position: 'absolute',
    backgroundColor: colors.error,
    borderRadius: 11,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    right: 15,
    top: 5,
  },
  removeText: { color: colors.white, fontWeight: 'bold', fontSize: 12 },
  imageAddBtn: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  imageAddText: { fontSize: 30, color: colors.border },
});
