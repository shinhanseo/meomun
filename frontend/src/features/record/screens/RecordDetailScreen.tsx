import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../shared/constants/color';

import { useRecordDetail } from '../hooks/useRecordDetail';
import { useDeleteRecord } from '../hooks/useDeleteRecord';

import { RecordDetailError } from '../components/recorddetail/RecordDetailError';
import { RecordDetailLoading } from '../components/recorddetail/RecordDetailLoading';
import { RecordDetailHero } from '../components/recorddetail/RecordDetailHero';
import { RecordDetailContent } from '../components/recorddetail/RecordDetailContent';
import { RecordDetailPlaceSection } from '../components/recorddetail/RecordDetailPlaceSection';
import { RecordDetailPhotoSection } from '../components/recorddetail/RecordDetailPhotoSection';
import { RecordDetailMoreMenu } from '../components/recorddetail/RecordDetailMoreMenu';
import { RecordDeleteConfirmModal } from '../components/recorddetail/RecordDeleteConfirmModal';

type Props = NativeStackScreenProps<MainStackParamList, 'RecordDetail'>;

export function RecordDetailScreen({ route, navigation }: Props) {
  const { recordId, backBehavior = 'goBack' } = route.params;
  const deleteRecord = useDeleteRecord();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    data: record,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRecordDetail(recordId);

  const goHome = () => {
    navigation.popToTop();
    navigation.navigate('MainTabs', {
      screen: 'Home',
    });
  };

  const handleBack = () => {
    if (backBehavior === 'home') {
      goHome();
      return;
    }

    navigation.goBack();
  };

  if (isLoading) {
    return <RecordDetailLoading />;
  }

  if (isError || !record) {
    return (
      <RecordDetailError
        isFetching={isFetching}
        onRetry={refetch}
        onBack={handleBack}
      />
    );
  }

  const handleEdit = () => {
    setIsMoreMenuOpen(false);
    navigation.navigate('RecordEdit', {
      recordId: recordId,
    });
  };

  const handleDelete = () => {
    setIsMoreMenuOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteRecord.mutate(record.id, {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false);
        goHome();
      },
      onError: () => {
        Alert.alert(
          '삭제하지 못했어요',
          '잠시 후 다시 시도해주세요.',
        );
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <RecordDetailHero
          title={record.title}
          recordedAt={record.recordedAt}
          placeName={record.place.placeName}
          address={record.place.roadAddressName ?? record.place.addressName}
          emotion={record.emotion}
          imageUrl={record.images[0]?.imageUrl}
          onBack={handleBack}
          onPressMore={() => setIsMoreMenuOpen(true)}
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

      <RecordDetailMoreMenu
        visible={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        onPressEdit={handleEdit}
        onPressDelete={handleDelete}
      />

      <RecordDeleteConfirmModal
        visible={isDeleteConfirmOpen}
        isDeleting={deleteRecord.isPending}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticColor.background,
  },
  scrollView: {
    flex: 1,
  },
});
