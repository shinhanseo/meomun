import {
  Image as ImageIcon,
  ImagePlus,
  X,
} from 'lucide-react-native';
import {
  Image as RNImage,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import type { SelectedRecordImage } from '../../types/upload.types';

interface RecordPhotoSectionProps {
  images: SelectedRecordImage[];
  onPressAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

const MAX_PHOTO_COUNT = 3;

export function RecordPhotoSection({
  images,
  onPressAddImage,
  onRemoveImage,
}: RecordPhotoSectionProps) {
  const canAddImage = images.length < MAX_PHOTO_COUNT;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ImageIcon color="#9B8BC0" size={22} strokeWidth={2} />
          <Text style={styles.label}>사진</Text>
        </View>

        <Text style={styles.helper}>최대 3장까지 추가할 수 있어요</Text>
      </View>

      <View style={styles.photoRow}>
        {images.map((image, index) => (
          <View key={`${image.uri}-${index}`} style={styles.photoBox}>
            <RNImage source={{ uri: image.uri }} style={styles.photo} />

            <Pressable
              hitSlop={8}
              style={styles.removeButton}
              onPress={() => onRemoveImage(index)}
            >
              <X color="#6F6680" size={16} strokeWidth={2.4} />
            </Pressable>
          </View>
        ))}

        {canAddImage && (
          <Pressable
            style={({ pressed }) => [
              styles.addBox,
              pressed && styles.addBoxPressed,
            ]}
            onPress={onPressAddImage}
          >
            <ImagePlus color="#B8B0C8" size={24} strokeWidth={2} />
            <Text style={styles.addText}>사진 추가</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 12,
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  helper: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoBox: {
    borderRadius: 14,
    height: 88,
    overflow: 'hidden',
    position: 'relative',
    width: 88,
  },
  photo: {
    height: '100%',
    width: '100%',
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 6,
    top: 6,
    width: 28,
  },
  addBox: {
    alignItems: 'center',
    borderColor: '#DCD5E8',
    borderRadius: 14,
    borderStyle: 'dashed',
    borderWidth: 1.4,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  addBoxPressed: {
    opacity: 0.75,
  },
  addText: {
    color: semanticColor.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
});