import { LinearGradient } from 'expo-linear-gradient';
import { MapPinIcon, NotebookTextIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';

interface ProfileSummaryCardProps {
  totalRecordCount: number | null;
  totalPlaceCount: number | null;
  isLoading?: boolean;
}

interface SummaryItemProps {
  icon: ReactNode;
  label: string;
  caption: string;
  value: string;
  colors: [string, string];
  iconBackgroundColor: string;
}

export function ProfileSummaryCard({
  totalRecordCount,
  totalPlaceCount,
  isLoading = false,
}: ProfileSummaryCardProps) {
  const recordValue = isLoading ? '-' : `${totalRecordCount ?? 0}개`;
  const placeValue = isLoading ? '-' : `${totalPlaceCount ?? 0}곳`;

  return (
    <View style={styles.container}>
      <SummaryItem
        icon={
          <NotebookTextIcon
            color={color.purple[600]}
            size={20}
            strokeWidth={2.2}
          />
        }
        label="총 기록"
        caption="남긴 순간"
        value={recordValue}
        colors={['#FFF7FB', '#EFE5FF']}
        iconBackgroundColor={color.purple[100]}
      />

      <SummaryItem
        icon={
          <MapPinIcon
            color={color.green[500]}
            size={20}
            strokeWidth={2.2}
          />
        }
        label="기록한 장소"
        caption="머문 공간"
        value={placeValue}
        colors={['#FFFFFF', '#F0FAF4']}
        iconBackgroundColor={color.green[100]}
      />
    </View>
  );
}

function SummaryItem({
  icon,
  label,
  caption,
  value,
  colors,
  iconBackgroundColor,
}: SummaryItemProps) {
  return (
    <LinearGradient colors={colors} style={styles.item}>
      <View style={styles.itemHeader}>
        <View style={[styles.iconBox, { backgroundColor: iconBackgroundColor }]}>
          {icon}
        </View>

        <View style={styles.labelArea}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      </View>

      <View style={styles.valueArea}>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          numberOfLines={1}
          style={styles.value}
        >
          {value}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 24,
    marginTop: 16,
  },
  item: {
    borderColor: 'rgba(210, 207, 220, 0.38)',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 118,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 15,
    shadowColor: color.gray[900],
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 14,
  },
  itemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  labelArea: {
    flex: 1,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: 13,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  label: {
    color: semanticColor.textPrimary,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  caption: {
    color: semanticColor.textMuted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
    marginTop: 2,
  },
  valueArea: {
    justifyContent: 'flex-end',
    minHeight: 45,
  },
  value: {
    color: semanticColor.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 39,
    marginTop: 14,
  },
});
