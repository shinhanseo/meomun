import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../shared/constants/color';
import { EmotionArchiveDetailHeader } from '../components/emotion-detail/EmotionArchiveDetailHeader';
import { EmotionArchiveDetailRecordList } from '../components/emotion-detail/EmotionArchiveDetailRecordList';
import { EmotionArchiveDetailSearchBar } from '../components/emotion-detail/EmotionArchiveDetailSearchBar';
import { useEmotionArchiveDetail } from '../hooks/useEmotionArchiveDetail';
import type { ArchiveSort } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'EmotionArchiveDetail'>;

export function EmotionArchiveDetailScreen({ route, navigation }: Props) {
  const { emotion } = route.params;
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sort, setSort] = useState<ArchiveSort>('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const emotionArchiveDetailQuery = useEmotionArchiveDetail(
    emotion,
    keyword,
    sort,
  );
  const records =
    emotionArchiveDetailQuery.data?.pages.flatMap((page) => page.records) ?? [];

  const handleEndReached = () => {
    if (
      !emotionArchiveDetailQuery.hasNextPage ||
      emotionArchiveDetailQuery.isFetchingNextPage
    ) {
      return;
    }

    emotionArchiveDetailQuery.fetchNextPage();
  };

  const handlePressRecord = (recordId: string) => {
    navigation.navigate('RecordDetail', { recordId });
  };

  const handleSelectSort = (nextSort: ArchiveSort) => {
    setSort(nextSort);
    setIsSortOpen(false);
  };

  return (
    <View style={styles.container}>
      <EmotionArchiveDetailRecordList
        records={records}
        isLoading={emotionArchiveDetailQuery.isLoading}
        isError={emotionArchiveDetailQuery.isError}
        isFetchingNextPage={emotionArchiveDetailQuery.isFetchingNextPage}
        listHeaderComponent={
          <>
            <EmotionArchiveDetailHeader
              emotion={emotion}
              recordCount={records.length}
              sort={sort}
              isSearchOpen={isSearchOpen}
              isSortOpen={isSortOpen}
              topInset={insets.top}
              onPressBack={() => navigation.goBack()}
              onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
              onToggleSort={() => setIsSortOpen((prev) => !prev)}
              onSelectSort={handleSelectSort}
            />

            {isSearchOpen && (
              <EmotionArchiveDetailSearchBar
                keyword={keyword}
                onChangeKeyword={setKeyword}
              />
            )}
          </>
        }
        onEndReached={handleEndReached}
        onPressRecord={handlePressRecord}
        onRetry={() => emotionArchiveDetailQuery.refetch()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
});
