import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  ArchiveIcon,
  BarChart3Icon,
  MapIcon,
  PlusIcon,
  UserIcon,
} from 'lucide-react-native';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../constants/color';

type BottomBarProps = BottomTabBarProps & {
  onPressCreate: () => void;
};

const tabItems = {
  Home: {
    label: '지도',
    Icon: MapIcon,
  },
  Archive: {
    label: '보관함',
    Icon: ArchiveIcon,
  },
  Stats: {
    label: '통계',
    Icon: BarChart3Icon,
  },
  Profile: {
    label: '내 정보',
    Icon: UserIcon,
  },
} as const;

export function BottomBar({
  state,
  navigation,
  onPressCreate,
}: BottomBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const handlePress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const item = tabItems[route.name as keyof typeof tabItems];

          if (!item) {
            return null;
          }

          const Icon = item.Icon;
          const tintColor = isFocused
            ? semanticColor.primary
            : color.purple[400];

          return (
            <Fragment key={route.key}>
              <Pressable style={styles.tabButton} onPress={handlePress}>
                <Icon size={24} color={tintColor} strokeWidth={2} />
                <Text style={[styles.label, isFocused && styles.activeLabel]}>
                  {item.label}
                </Text>
              </Pressable>

              {route.name === 'Archive' ? (
                <Pressable style={styles.recordButton} onPress={onPressCreate}>
                  <PlusIcon size={24} color={color.white} strokeWidth={2} />
                </Pressable>
              ) : null}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    bottom: 0,
    left: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    position: 'absolute',
    right: 0,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 32,
    elevation: 8,
    flexDirection: 'row',
    height: 76,
    justifyContent: 'space-around',
    shadowColor: color.purple[600],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  label: {
    color: color.purple[500],
    fontSize: 12,
    fontWeight: '600',
  },
  activeLabel: {
    color: semanticColor.primary,
  },
  recordButton: {
    alignItems: 'center',
    backgroundColor: semanticColor.primary,
    borderRadius: 29,
    elevation: 10,
    height: 48,
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: semanticColor.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    width: 48,
  },
});
