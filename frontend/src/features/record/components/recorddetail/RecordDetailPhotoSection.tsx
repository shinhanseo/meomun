import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ImageIcon, XIcon } from 'lucide-react-native';

import { color, semanticColor } from '../../../../shared/constants/color';
import type { RecordImageResponse } from '../../types/record.types';

type RecordDetailPhotoSectionProps = {
  images: RecordImageResponse[];
};

export function RecordDetailPhotoSection({
  images,
}: RecordDetailPhotoSectionProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ImageIcon size={21} color={color.purple[500]} />
          <Text style={styles.sectionTitle}>사진</Text>
        </View>

        <Text style={styles.count}>{images.length}장</Text>
      </View>

      {images.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoList}
        >
          {images.map((image) => (
            <Pressable
              key={image.id}
              onPress={() => setSelectedImageUrl(image.imageUrl)}
            >
              <Image
                source={{ uri: image.imageUrl }}
                style={styles.photo}
              />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>첨부된 사진이 없어요.</Text>
        </View>
      )}

      <Modal
        visible={Boolean(selectedImageUrl)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImageUrl(null)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalCloseButton}
            onPress={() => setSelectedImageUrl(null)}
          >
            <XIcon size={26} color={color.white} strokeWidth={2} />
          </Pressable>

          {selectedImageUrl ? (
            <Image
              source={{ uri: selectedImageUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  header: {
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: color.purple[800],
    fontSize: 17,
    fontWeight: '700',
  },
  count: {
    color: color.purple[400],
    fontSize: 14,
    fontWeight: '700',
  },
  photoList: {
    gap: 12,
    paddingRight: 20,
  },
  photo: {
    width: 124,
    height: 124,
    borderRadius: 16,
    backgroundColor: color.gray[100],
  },
  emptyBox: {
    height: 96,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderWidth: 1,
    borderColor: color.purple[100],
  },
  emptyText: {
    color: semanticColor.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    flex: 1,
    justifyContent: 'center',
  },
  modalCloseButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    right: 22,
    top: 56,
    width: 44,
    zIndex: 2,
  },
  fullImage: {
    height: '82%',
    width: '100%',
  },
});
