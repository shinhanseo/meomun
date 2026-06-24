import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import type { SelectedRecordImage } from '../types/upload.types';

const MAX_IMAGE_COUNT = 3;

export function useRecordImagePicker() {
  const [images, setImages] = useState<SelectedRecordImage[]>([]);

  const pickImages = useCallback(async () => {
    if (images.length >= MAX_IMAGE_COUNT) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGE_COUNT - images.length,
      quality: 0.9,
    });

    if (result.canceled) {
      return;
    }

    const pickedImages: SelectedRecordImage[] = result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName ?? `record-${Date.now()}.jpg`,
      contentType: asset.mimeType ?? 'image/jpeg',
    }));

    setImages((prevImages) => [
      ...prevImages,
      ...pickedImages,
    ].slice(0, MAX_IMAGE_COUNT));
  }, [images.length]);

  const removeImage = useCallback((index: number) => {
    setImages((prevImages) =>
      prevImages.filter((_, imageIndex) => imageIndex !== index),
    );
  }, []);

  const resetImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    pickImages,
    removeImage,
    resetImages,
  };
}