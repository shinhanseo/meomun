import { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { semanticColor } from '../../../../shared/constants/color';
import { emotionMeta } from '../../../../shared/constants/emotionMeta';
import type { MonthlyArchiveEmotionCount } from '../../types';

interface MonthlyArchiveSummarySectionProps {
  year: number;
  month: number;
  emotionCounts: MonthlyArchiveEmotionCount[];
  onChangeMonth: (year: number, month: number) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

export function MonthlyArchiveSummarySection({
  year,
  month,
  emotionCounts,
  onChangeMonth,
}: MonthlyArchiveSummarySectionProps) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [draftYear, setDraftYear] = useState(year);
  const [draftMonth, setDraftMonth] = useState(month);

  const totalRecordCount = useMemo(
    () =>
      emotionCounts.reduce(
        (sum, emotionCount) => sum + emotionCount.recordCount,
        0,
      ),
    [emotionCounts],
  );
  const sortedEmotionCounts = useMemo(
    () =>
      emotionCounts
        .slice()
        .sort((a, b) => b.recordCount - a.recordCount),
    [emotionCounts],
  );
  const mostRecordedEmotion = sortedEmotionCounts[0]?.emotion ?? null;
  const mostRecordedEmotionMeta = mostRecordedEmotion
    ? emotionMeta[mostRecordedEmotion]
    : null;
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 7 }, (_, index) => currentYear - 5 + index);
  }, []);

  const handleOpenPicker = () => {
    setDraftYear(year);
    setDraftMonth(month);
    setIsPickerVisible(true);
  };

  const handleApplyPicker = () => {
    onChangeMonth(draftYear, draftMonth);
    setIsPickerVisible(false);
  };

  return (
    <>
      <LinearGradient
        colors={['#E4D7FF', '#F5DDEB', '#CDBDF8']}
        locations={[0, 0.56, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <Pressable
          style={({ pressed }) => [
            styles.monthButton,
            pressed && styles.pressed,
          ]}
          onPress={handleOpenPicker}
        >
          <Text style={styles.monthText}>
            {year}년 {month}월
          </Text>
          <ChevronDown color="#5E4B9A" size={19} strokeWidth={2.2} />
        </Pressable>

        <Text style={styles.recordCount}>기록한 순간 {totalRecordCount}개</Text>

        <View style={styles.content}>
          <View style={styles.donut}>
            <View style={styles.donutInner}>
              {mostRecordedEmotionMeta ? (
                <Image
                  source={mostRecordedEmotionMeta.icon}
                  style={styles.donutEmotionIcon}
                />
              ) : null}
              <Text style={styles.donutCaption}>가장 많이 남긴 감정</Text>
              <Text style={styles.donutEmotion}>
                {mostRecordedEmotionMeta?.label ?? '-'}
              </Text>
            </View>
          </View>

          <View style={styles.emotionGrid}>
            {sortedEmotionCounts.map((emotionCount) => {
              const emotion = emotionMeta[emotionCount.emotion];

              return (
                <View key={emotionCount.emotion} style={styles.emotionItem}>
                  <View
                    style={[
                      styles.emotionIconBox,
                      { backgroundColor: `${emotion.color}22` },
                    ]}
                  >
                    <Image source={emotion.icon} style={styles.emotionIcon} />
                  </View>

                  <View>
                    <Text style={styles.emotionLabel}>{emotion.label}</Text>
                    <Text style={styles.emotionCount}>
                      {emotionCount.recordCount}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.message}>
          이번 달, {mostRecordedEmotionMeta?.label ?? '감정이 담긴'} 순간들이
          {'\n'}당신의 하루를 차곡차곡 채워주었어요.
        </Text>
      </LinearGradient>

      <Modal
        animationType="fade"
        transparent
        visible={isPickerVisible}
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>월 선택</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.modalCloseButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => setIsPickerVisible(false)}
              >
                <X color="#7B728A" size={20} strokeWidth={2.3} />
              </Pressable>
            </View>

            <Text style={styles.pickerLabel}>연도</Text>
            <View style={styles.yearGrid}>
              {yearOptions.map((yearOption) => {
                const isSelected = draftYear === yearOption;

                return (
                  <Pressable
                    key={yearOption}
                    style={({ pressed }) => [
                      styles.yearChip,
                      isSelected && styles.pickerChipSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setDraftYear(yearOption)}
                  >
                    <Text
                      style={[
                        styles.pickerChipText,
                        isSelected && styles.pickerChipTextSelected,
                      ]}
                    >
                      {yearOption}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.pickerLabel}>월</Text>
            <View style={styles.monthGrid}>
              {MONTHS.map((monthOption) => {
                const isSelected = draftMonth === monthOption;

                return (
                  <Pressable
                    key={monthOption}
                    style={({ pressed }) => [
                      styles.monthChip,
                      isSelected && styles.pickerChipSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setDraftMonth(monthOption)}
                  >
                    <Text
                      style={[
                        styles.pickerChipText,
                        isSelected && styles.pickerChipTextSelected,
                      ]}
                    >
                      {monthOption}월
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.applyButton,
                pressed && styles.pressed,
              ]}
              onPress={handleApplyPicker}
            >
              <Text style={styles.applyButtonText}>선택하기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  applyButton: {
    alignItems: 'center',
    backgroundColor: '#8E6CE5',
    borderRadius: 15,
    height: 48,
    justifyContent: 'center',
    marginTop: 22,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  container: {
    borderRadius: 22,
    marginHorizontal: 24,
    marginTop: 20,
    minHeight: 260,
    overflow: 'hidden',
    padding: 22,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    marginTop: 24,
  },
  donut: {
    alignItems: 'center',
    borderColor: 'rgba(142, 108, 229, 0.42)',
    borderRadius: 999,
    borderWidth: 14,
    height: 128,
    justifyContent: 'center',
    width: 128,
  },
  donutCaption: {
    color: '#7D7390',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  donutEmotion: {
    color: semanticColor.textPrimary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 2,
  },
  donutEmotionIcon: {
    height: 24,
    resizeMode: 'contain',
    width: 24,
  },
  donutInner: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
    borderRadius: 999,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  emotionCount: {
    color: semanticColor.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  emotionGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },
  emotionIcon: {
    height: 23,
    resizeMode: 'contain',
    width: 23,
  },
  emotionIconBox: {
    alignItems: 'center',
    borderRadius: 999,
    height: 33,
    justifyContent: 'center',
    width: 33,
  },
  emotionItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    width: '50%',
  },
  emotionLabel: {
    color: '#6E5C9D',
    fontSize: 13,
    fontWeight: '800',
  },
  message: {
    color: '#7A6D91',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 26,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    width: '86%',
  },
  modalCloseButton: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(30, 24, 46, 0.36)',
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    color: semanticColor.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  monthButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  monthChip: {
    alignItems: 'center',
    backgroundColor: '#F8F5FA',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    width: '23%',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  monthText: {
    color: semanticColor.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  pickerChipSelected: {
    backgroundColor: '#8E6CE5',
  },
  pickerChipText: {
    color: '#6E5C9D',
    fontSize: 13,
    fontWeight: '800',
  },
  pickerChipTextSelected: {
    color: '#FFFFFF',
  },
  pickerLabel: {
    color: '#5E4B9A',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 10,
    marginTop: 14,
  },
  pressed: {
    opacity: 0.76,
  },
  recordCount: {
    color: '#7A6D91',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
  yearChip: {
    alignItems: 'center',
    backgroundColor: '#F8F5FA',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    width: '31%',
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
