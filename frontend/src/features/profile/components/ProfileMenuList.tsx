import {
  ChevronRightIcon,
  CircleHelpIcon,
  FileTextIcon,
  HeadphonesIcon,
  LogOutIcon,
  ShieldIcon,
  UserMinusIcon,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';

interface ProfileMenuListProps {
  onPressPrivacy: () => void;
  onPressTerms: () => void;
  onPressContact: () => void;
  onPressHelp: () => void;
  onPressLogout: () => void;
  onPressDeleteAccount: () => void;
  isAuthActionPending?: boolean;
}

interface MenuSectionProps {
  title: string;
  children: ReactNode;
}

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  description?: string;
  tone?: 'default' | 'danger';
  onPress: () => void;
  disabled?: boolean;
}

export function ProfileMenuList({
  onPressPrivacy,
  onPressTerms,
  onPressContact,
  onPressHelp,
  onPressLogout,
  onPressDeleteAccount,
  isAuthActionPending = false,
}: ProfileMenuListProps) {
  return (
    <View style={styles.container}>
      <MenuSection title="안내">
        <MenuItem
          icon={<ShieldIcon color={color.purple[600]} size={21} />}
          label="개인정보처리방침"
          description="수집하고 보호하는 정보를 확인해요"
          onPress={onPressPrivacy}
        />
        <MenuItem
          icon={<FileTextIcon color={color.purple[600]} size={21} />}
          label="이용 약관"
          description="머문 이용에 필요한 약속을 확인해요"
          onPress={onPressTerms}
        />
      </MenuSection>

      <MenuSection title="지원">
        <MenuItem
          icon={<HeadphonesIcon color={color.green[500]} size={21} />}
          label="문의하기"
          description="불편한 점이나 제안을 남겨요"
          onPress={onPressContact}
        />
        <MenuItem
          icon={<CircleHelpIcon color={color.green[500]} size={21} />}
          label="도움말"
          description="자주 묻는 질문을 살펴봐요"
          onPress={onPressHelp}
        />
      </MenuSection>

      <MenuSection title="계정">
        <MenuItem
          icon={<LogOutIcon color={semanticColor.textSecondary} size={21} />}
          label="로그아웃"
          onPress={onPressLogout}
          disabled={isAuthActionPending}
        />
        <MenuItem
          icon={<UserMinusIcon color={semanticColor.danger} size={21} />}
          label="회원탈퇴"
          tone="danger"
          onPress={onPressDeleteAccount}
          disabled={isAuthActionPending}
        />
      </MenuSection>
    </View>
  );
}

function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  description,
  tone = 'default',
  onPress,
  disabled = false,
}: MenuItemProps) {
  const isDanger = tone === 'danger';

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
        disabled && styles.itemDisabled,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconBox}>{icon}</View>

      <View style={styles.itemTextArea}>
        <Text style={[styles.itemLabel, isDanger && styles.dangerText]}>
          {label}
        </Text>
        {description ? (
          <Text style={styles.itemDescription}>{description}</Text>
        ) : null}
      </View>

      <ChevronRightIcon
        color={isDanger ? semanticColor.danger : color.gray[400]}
        size={19}
        strokeWidth={2.2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 22,
    marginTop: 28,
    paddingHorizontal: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: color.purple[700],
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 20,
    paddingHorizontal: 2,
  },
  sectionCard: {
    backgroundColor: semanticColor.surface,
    borderColor: 'rgba(210, 207, 220, 0.42)',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: color.gray[900],
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.04,
    shadowRadius: 14,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemPressed: {
    backgroundColor: color.gray[50],
  },
  itemDisabled: {
    opacity: 0.55,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: color.gray[50],
    borderRadius: 14,
    height: 38,
    justifyContent: 'center',
    marginRight: 12,
    width: 38,
  },
  itemTextArea: {
    flex: 1,
    paddingRight: 10,
  },
  itemLabel: {
    color: semanticColor.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  itemDescription: {
    color: semanticColor.textMuted,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    marginTop: 2,
  },
  dangerText: {
    color: semanticColor.danger,
  },
});
