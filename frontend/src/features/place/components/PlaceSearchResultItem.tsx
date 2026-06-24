import { ChevronRight, MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';
import type { PlaceSearchResult } from '../types/place.types';

interface PlaceSearchResultItemProps {
  place: PlaceSearchResult;
  onPress: (place: PlaceSearchResult) => void;
}

export function PlaceSearchResultItem({
  place,
  onPress,
}: PlaceSearchResultItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={() => onPress(place)}
    >
      <View style={styles.iconBox}>
        <MapPin color={semanticColor.primary} size={20} strokeWidth={2.2} />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {place.placeName}
        </Text>

        {place.categoryName && (
          <Text numberOfLines={1} style={styles.category}>
            {place.categoryName}
          </Text>
        )}

        <Text numberOfLines={1} style={styles.address}>
          {place.roadAddressName || place.addressName}
        </Text>
      </View>

      <ChevronRight color={semanticColor.textMuted} size={20} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: semanticColor.surface,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  containerPressed: {
    opacity: 0.82,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: semanticColor.primarySoft,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  content: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  name: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  category: {
    color: semanticColor.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  address: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
});
