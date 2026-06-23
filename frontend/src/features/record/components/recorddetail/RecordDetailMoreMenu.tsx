import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  Edit3Icon,
  Trash2Icon,
  XIcon,
} from 'lucide-react-native';
import { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../../shared/constants/color';

type RecordDetailMoreMenuProps = {
  visible: boolean;
  onClose: () => void;
  onPressEdit: () => void;
  onPressDelete: () => void;
};

export function RecordDetailMoreMenu({
  visible,
  onClose,
  onPressEdit,
  onPressDelete,
}: RecordDetailMoreMenuProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['32%'], []);

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.38}
        pressBehavior="close"
      />
    ),
    [],
  );

  if (!visible) {
    return null;
  }

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.sheetBackground}
      onClose={onClose}
    >
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.title}>기록 관리</Text>

        <Pressable style={styles.menuItem} onPress={onPressEdit}>
          <View style={styles.menuIconBox}>
            <Edit3Icon
              size={22}
              color={semanticColor.primary}
              strokeWidth={2}
            />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={styles.menuTitle}>수정하기</Text>
            <Text style={styles.menuDescription}>
              이 기록의 내용과 장소를 다시 수정해요.
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={onPressDelete}>
          <View style={[styles.menuIconBox, styles.deleteIconBox]}>
            <Trash2Icon
              size={22}
              color={semanticColor.danger}
              strokeWidth={2}
            />
          </View>
          <View style={styles.menuTextBox}>
            <Text style={[styles.menuTitle, styles.deleteTitle]}>
              삭제하기
            </Text>
            <Text style={styles.menuDescription}>
              삭제한 기록은 다시 되돌릴 수 없어요.
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={onClose}>
          <XIcon size={18} color={color.gray[500]} strokeWidth={2} />
          <Text style={styles.cancelText}>취소</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: color.purple[900],
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  sheet: {
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: color.purple[200],
  },
  title: {
    marginBottom: 12,
    color: color.purple[900],
    fontSize: 18,
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  menuIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.purple[100],
  },
  deleteIconBox: {
    backgroundColor: semanticColor.dangerSoft,
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteTitle: {
    color: semanticColor.danger,
  },
  menuDescription: {
    marginTop: 4,
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  cancelButton: {
    marginTop: 14,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: color.gray[100],
  },
  cancelText: {
    color: color.gray[600],
    fontSize: 15,
    fontWeight: '700',
  },
});
