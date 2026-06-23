import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../shared/constants/color';
import { RecordDetailError } from '../components/recorddetail/RecordDetailError';
import { RecordDetailLoading } from '../components/recorddetail/RecordDetailLoading';
import { useRecordDetail } from '../hooks/useRecordDetail';

import { RecordDetailHero } from '../components/recorddetail/RecordDetailHero';
import { RecordDetailContent } from '../components/recorddetail/RecordDetailContent';
import { RecordDetailPlaceSection } from '../components/recorddetail/RecordDetailPlaceSection';
import { RecordDetailPhotoSection } from '../components/recorddetail/RecordDetailPhotoSection';
import { useDeleteRecord } from '../hooks/useDeleteRecord';

type Props = NativeStackScreenProps<MainStackParamList, 'RecordDetail'>;

export function RecordDetailScreen({ route, navigation }: Props) {
  const { recordId } = route.params;
  const deleteRecord = useDeleteRecord();

  const {
    data: record,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRecordDetail(recordId);

  if (isLoading) {
    return <RecordDetailLoading />;
  }

  if (isError || !record) {
    return (
      <RecordDetailError
        isFetching={isFetching}
        onRetry={refetch}
        onBack={navigation.goBack}
      />
    );
  }

  const handleEdit = () => {
    navigation.navigate('RecordWrite');
  };

  const handleDelete = () => {
    Alert.alert(
      '기록을 삭제할까요?',
      '삭제한 기록은 되돌릴 수 없어요.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            deleteRecord.mutate(record.id, {
              onSuccess: () => {
                navigation.goBack();
              },
              onError: () => {
                Alert.alert(
                  '삭제하지 못했어요',
                  '잠시 후 다시 시도해주세요.',
                );
              },
            });
          },
        },
      ],
    );
  };

  const handlePressMore = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['수정하기', '삭제하기', '취소'],
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          userInterfaceStyle: 'light',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            handleEdit();
          }

          if (buttonIndex === 1) {
            handleDelete();
          }
        },
      );

      return;
    }

    Alert.alert(
      '기록 관리',
      undefined,
      [
        {
          text: '수정하기',
          onPress: handleEdit,
        },
        {
          text: '삭제하기',
          style: 'destructive',
          onPress: handleDelete,
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <RecordDetailHero
        title={record.title}
        recordedAt={record.recordedAt}
        placeName={record.place.placeName}
        address={record.place.roadAddressName ?? record.place.addressName}
        emotion={record.emotion}
        imageUrl={record.images[0]?.imageUrl}
        onBack={navigation.goBack}
        onPressMore={handlePressMore}
      />

      <RecordDetailContent content={record.content} />

      <RecordDetailPlaceSection
        placeName={record.place.placeName}
        address={record.place.addressName}
        roadAddress={record.place.roadAddressName}
        latitude={record.place.latitude}
        longitude={record.place.longitude}
        emotion={record.emotion}
      />

      <RecordDetailPhotoSection images={record.images} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColor.background,
  },
  body: {
    flex: 1,
    padding: 24,
  },
  place: {
    color: semanticColor.textSecondary,
    fontSize: 15,
    marginTop: 8,
  },
  content: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 24,
  },
  emptyContent: {
    color: semanticColor.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 24,
  },
});
