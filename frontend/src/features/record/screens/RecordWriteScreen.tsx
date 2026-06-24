import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../shared/constants/color';

import { RecordContentSection } from '../components/recordwrite/RecordContentSection';
import { RecordEmotionSection } from '../components/recordwrite/RecordEmotionSection';
import { RecordPhotoSection } from '../components/recordwrite/RecordPhotoSection';
import { RecordPlaceSection } from '../components/recordwrite/RecordPlaceSection';
import { RecordWriteHeader } from '../components/recordwrite/RecordWriteHeader';
import { RecordWrtieTitleInput } from '../components/recordwrite/RecordWriteTitleInput';
import { RecordWriteValidationModal } from '../components/recordwrite/RecordWriteValidationModal';

import { useCreateRecord } from '../hooks/useCreateRecord';
import { useRecordImagePicker } from '../hooks/useRecordImagePicker';
import { useRecordWriteStore } from '../store/recordWriteStore';

type RecordWriteNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'RecordWrite'
>;

export function RecordWriteScreen() {
  const navigation = useNavigation<RecordWriteNavigationProp>();
  const [validationMessage, setValidationMessage] = useState('');

  const title = useRecordWriteStore((state) => state.title);
  const place = useRecordWriteStore((state) => state.place);
  const emotion = useRecordWriteStore((state) => state.emotion);
  const content = useRecordWriteStore((state) => state.content);
  const setTitle = useRecordWriteStore((state) => state.setTitle);
  const setEmotion = useRecordWriteStore((state) => state.setEmotion);
  const setContent = useRecordWriteStore((state) => state.setContent);
  const resetDraft = useRecordWriteStore((state) => state.resetDraft);

  const {
    images,
    pickImages,
    removeImage,
    resetImages,
  } = useRecordImagePicker();

  const createRecordMutation = useCreateRecord();
  const isValidationModalVisible = validationMessage.length > 0;

  const handleClose = () => {
    resetDraft();
    resetImages();
    navigation.goBack();
  };

  const handleSave = () => {
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

    createRecordMutation.mutate(
      {
        record: {
          title: title.trim(),
          emotion,
          content: content.trim() || undefined,
          recordedAt: new Date().toISOString(),
          visibility: 'PRIVATE',
          place,
        },
        images,
      },
      {
        onSuccess: (createdRecord) => {
          resetDraft();
          resetImages();

          navigation.replace('RecordDetail', {
            recordId: createdRecord.id,
          });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            console.log('[record-create] failed', {
              message: error.message,
              status: error.response?.status,
              data: error.response?.data,
              url: error.config?.url,
              method: error.config?.method,
            });
          } else {
            console.log('[record-create] failed', error);
          }

          Alert.alert('기록 저장에 실패했어요. 잠시 후 다시 시도해주세요.');
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
            isSaving={createRecordMutation.isPending}
            onPressClose={handleClose}
            onPressSave={handleSave}
          />

          <RecordWrtieTitleInput title={title} onChangeTitle={setTitle} />

          <RecordPlaceSection
            place={place}
            onPressSelectPlace={handlePressSelectPlace}
          />

          <RecordEmotionSection
            selectedEmotion={emotion}
            onSelectEmotion={setEmotion}
          />

          <RecordPhotoSection
            images={images}
            onPressAddImage={pickImages}
            onRemoveImage={removeImage}
          />

          <RecordContentSection content={content} onChangeContent={setContent} />
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
});
