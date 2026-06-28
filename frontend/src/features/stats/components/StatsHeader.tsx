import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';
import type { ArchiveMonthOption } from '../../archive/types';

interface StatsHeaderProps {
  year: number;
  month: number;
  monthOptions: ArchiveMonthOption[];
  onChangeMonth: (year: number, month: number) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

export function StatsHeader({
  year,
  month,
  monthOptions,
  onChangeMonth,
}: StatsHeaderProps) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [draftYear, setDraftYear] = useState(year);
  const [draftMonth, setDraftMonth] = useState(month);

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(monthOptions.map((monthOption) => monthOption.year)),
    ).sort((a, b) => b - a);

    return years.length > 0 ? years : [year];
  }, [monthOptions, year]);

  const availableMonthMap = useMemo(() => {
    return new Map(
      monthOptions.map((monthOption) => [
        `${monthOption.year}-${monthOption.month}`,
        monthOption.recordCount,
      ]),
    );
  }, [monthOptions]);

  const handleOpenPicker = () => {
    setDraftYear(year);
    setDraftMonth(month);
    setIsPickerVisible(true);
  };

  const handleApplyPicker = () => {
    const recordCount = availableMonthMap.get(`${draftYear}-${draftMonth}`) ?? 0;

    if (recordCount === 0) {
      return;
    }

    onChangeMonth(draftYear, draftMonth);
    setIsPickerVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>감정 통계</Text>
          <Text style={styles.subtitle}>
            당신의 감정 기록을{'\n'}천천히 돌아보세요.
          </Text>
        </View>

        <View style={styles.actionArea}>
          <Pressable
            style={({ pressed }) => [
              styles.calendarButton,
              pressed && styles.pressed,
            ]}
            onPress={handleOpenPicker}
          >
            <CalendarDays color="#6A55B3" size={20} strokeWidth={2.2} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.monthButton,
              pressed && styles.pressed,
            ]}
            onPress={handleOpenPicker}
          >
            <Text style={styles.monthButtonText}>
              {year}년 {month}월
            </Text>
            <ChevronDown color="#6A55B3" size={15} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isPickerVisible}
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>통계 월 선택</Text>
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
                const recordCount =
                  availableMonthMap.get(`${draftYear}-${monthOption}`) ?? 0;
                const isAvailable = recordCount > 0;
                const isSelected = draftMonth === monthOption;

                return (
                  <Pressable
                    key={monthOption}
                    disabled={!isAvailable}
                    style={({ pressed }) => [
                      styles.monthChip,
                      !isAvailable && styles.monthChipDisabled,
                      isSelected && isAvailable && styles.pickerChipSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => setDraftMonth(monthOption)}
                  >
                    <Text
                      style={[
                        styles.pickerChipText,
                        isSelected &&
                        isAvailable &&
                        styles.pickerChipTextSelected,
                      ]}
                    >
                      {monthOption}월
                    </Text>
                    {isAvailable && (
                      <Text
                        style={[
                          styles.monthRecordCount,
                          isSelected &&
                          isAvailable &&
                          styles.monthRecordCountSelected,
                        ]}
                      >
                        {recordCount}개
                      </Text>
                    )}
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
  actionArea: {
    alignItems: 'flex-end',
    gap: 14,
  },
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
  calendarButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 15,
    height: 38,
    justifyContent: 'center',
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    width: 38,
  },
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 64,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 5,
    minHeight: 38,
    paddingHorizontal: 13,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  monthButtonText: {
    color: '#5E4B9A',
    fontSize: 13,
    fontWeight: '900',
  },
  monthChip: {
    alignItems: 'center',
    backgroundColor: '#F8F5FA',
    borderRadius: 13,
    height: 48,
    justifyContent: 'center',
    width: '23%',
  },
  monthChipDisabled: {
    opacity: 0.34,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  monthRecordCount: {
    color: '#A8A1B8',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  monthRecordCountSelected: {
    color: 'rgba(255, 255, 255, 0.84)',
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
  subtitle: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: 10,
  },
  title: {
    color: '#5E4B9A',
    fontSize: 30,
    fontWeight: '900',
  },
  titleArea: {
    flex: 1,
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
