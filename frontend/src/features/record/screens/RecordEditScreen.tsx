import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../shared/constants/color';

import { RecordContentSection } from '../components/recordwrite/RecordContentSection';
import { RecordEmotionSection } from '../components/recordwrite/RecordEmotionSection';
import { RecordPlaceSection } from '../components/recordwrite/RecordPlaceSection';
import { RecordWriteHeader } from '../components/recordwrite/RecordWriteHeader';
import { RecordWrtieTitleInput } from '../components/recordwrite/RecordWriteTitleInput';
import { RecordWriteValidationModal } from '../components/recordwrite/RecordWriteValidationModal';

import { useEditRecord } from '../hooks/useEditRecord';
import { usePlaceRecordSummary } from '../hooks/usePlaceRecordSummary';
import { useRecordDetail } from '../hooks/useRecordDetail';
import { useRecordWriteStore } from '../store/recordWriteStore';

type RecordEditNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'RecordEdit'
>;

type RecordEditRouteProp = RouteProp<MainStackParamList, 'RecordEdit'>;

export function RecordEditScreen() {
  const navigation = useNavigation<RecordEditNavigationProp>();
  const route = useRoute<RecordEditRouteProp>();
  const { recordId } = route.params;

  const initializedRecordIdRef = useRef<string | null>(null);
  const [validationMessage, setValidationMessage] = useState('');

  const { data: record, isLoading } = useRecordDetail(recordId);
  const editRecordMutation = useEditRecord();

  const title = useRecordWriteStore((state) => state.title);
  const place = useRecordWriteStore((state) => state.place);
  const emotion = useRecordWriteStore((state) => state.emotion);
  const content = useRecordWriteStore((state) => state.content);

  const setTitle = useRecordWriteStore((state) => state.setTitle);
  const setPlace = useRecordWriteStore((state) => state.setPlace);
  const setEmotion = useRecordWriteStore((state) => state.setEmotion);
  const setContent = useRecordWriteStore((state) => state.setContent);
  const resetDraft = useRecordWriteStore((state) => state.resetDraft);

  const { data: placeRecordSummary } = usePlaceRecordSummary(
    place?.kakaoPlaceId,
  );

  const isValidationModalVisible = validationMessage.length > 0;

  useEffect(() => {
    if (!record) {
      return;
    }

    if (initializedRecordIdRef.current === record.id) {
      return;
    }

    initializedRecordIdRef.current = record.id;

    setTitle(record.title);
    setEmotion(record.emotion);
    setContent(record.content ?? '');
    setPlace({
      kakaoPlaceId: record.place.kakaoPlaceId,
      placeName: record.place.placeName,
      categoryName: record.place.categoryName,
      addressName: record.place.addressName,
      roadAddressName: record.place.roadAddressName,
      longitude: record.place.longitude,
      latitude: record.place.latitude,
    });
  }, [record, setTitle, setEmotion, setContent, setPlace]);

  const handleClose = () => {
    resetDraft();
    navigation.goBack();
  };

  const handleSave = () => {
    if (!record) {
      return;
    }

    if (!title.trim()) {
      setValidationMessage('제목을 입력해주세요.');
      return;
    }

    if (!place) {
      setValidationMessage('장소를 선택해주세요.');
      return;
    }

    if (!emotion) {
      setValidationMessage('감정을 선택해주세요.');
      return;
    }

    if (!content.trim()) {
      setValidationMessage('오늘 이 장소에서 느낀 감정을 기록으로 남겨주세요.');
      return;
    }

    editRecordMutation.mutate(
      {
        recordId,
        record: {
          title: title.trim(),
          emotion,
          content: content.trim() || undefined,
          recordedAt: record.recordedAt,
          visibility: record.visibility,
          place,
          imageObjectKeys: record.images.map((image) => image.objectKey),
        },
      },
      {
        onSuccess: (updatedRecord) => {
          resetDraft();

          navigation.replace('RecordDetail', {
            recordId: updatedRecord.id,
          });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            console.log('[record-edit] failed', {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data,
              url: error.config?.url,
              method: error.config?.method,
            });
          } else {
            console.log('[record-edit] failed', error);
          }

          Alert.alert('기록 수정에 실패했어요. 잠시 후 다시 시도해주세요.');
        },
      },
    );
  };

  const handlePressSelectPlace = () => {
    navigation.navigate('PlaceSelect');
  };

  const handleCloseValidationModal = () => {
    setValidationMessage('');
  };

  if (isLoading || !record) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={semanticColor.primary} />
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <RecordWriteHeader
            isSaving={editRecordMutation.isPending}
            onPressClose={handleClose}
            onPressSave={handleSave}
          />

          <RecordWrtieTitleInput title={title} onChangeTitle={setTitle} />

          <RecordPlaceSection
            place={place}
            placeRecordSummary={placeRecordSummary}
            onPressSelectPlace={handlePressSelectPlace}
          />

          <RecordEmotionSection
            selectedEmotion={emotion}
            onSelectEmotion={setEmotion}
          />

          <RecordContentSection
            selectedEmotion={emotion}
            content={content}
            onChangeContent={setContent}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <RecordWriteValidationModal
        visible={isValidationModalVisible}
        message={validationMessage}
        onClose={handleCloseValidationModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: semanticColor.background,
    flex: 1,
    justifyContent: 'center',
  },
});